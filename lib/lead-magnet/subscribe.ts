import { Resend } from "resend";
import {
  getEmailTemplate,
  LEAD_MAGNET_WELCOME_TEMPLATE_ID,
  renderTemplate,
  resolveTemplateForLocale,
} from "@/lib/crm/templates";
import { upsertLead } from "@/lib/crm/leads";
import { isDatabaseConfigured } from "@/lib/db/client";
import { siteUrl } from "@/lib/site-config";
import type { Locale } from "@/lib/locale";
import { createLeadMagnetToken } from "./token";

type LeadMagnetEmailCopy = {
  subject: string;
  greeting: string;
  body: string;
  buttonLabel: string;
  footer: string;
};

const fallbackCopy: Record<Locale, LeadMagnetEmailCopy> = {
  es: {
    subject: "Tu guía gratis de Bilingual Boost",
    greeting: "¡Hola!",
    body: "Gracias por registrarte. Aquí tienes tu guía gratis para soltarte al hablar y organizar tu aprendizaje.",
    buttonLabel: "Descargar guía PDF",
    footer: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
  },
  en: {
    subject: "Your free Bilingual Boost guide",
    greeting: "Hi!",
    body: "Thanks for signing up. Here is your free guide to speak more freely and organize your learning.",
    buttonLabel: "Download PDF guide",
    footer: "If the button does not work, copy and paste this link into your browser:",
  },
  pl: {
    subject: "Twój darmowy przewodnik Bilingual Boost",
    greeting: "Cześć!",
    body: "Dziękuję za zapis. Oto Twój darmowy przewodnik, który pomoże Ci swobodniej mówić i uporządkować naukę.",
    buttonLabel: "Pobierz przewodnik PDF",
    footer: "Jeśli przycisk nie działa, skopiuj i wklej ten link w przeglądarce:",
  },
};

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function getFromAddress(): string | null {
  return process.env.RESEND_FROM_EMAIL?.trim() || null;
}

function getNotifyAddress(): string | null {
  return process.env.LEAD_MAGNET_NOTIFY_EMAIL?.trim() || null;
}

async function resolveEmailContent(params: {
  name: string;
  locale: Locale;
  downloadUrl: string;
}): Promise<{ subject: string; html: string; text: string }> {
  const safeName = escapeHtml(params.name);
  const vars = {
    name: safeName,
    download_url: params.downloadUrl,
  };

  if (isDatabaseConfigured()) {
    try {
      const template = await getEmailTemplate(LEAD_MAGNET_WELCOME_TEMPLATE_ID);
      if (template) {
        const resolved = resolveTemplateForLocale(template, params.locale);
        const html = renderTemplate(resolved.bodyHtml, vars);
        const subject = renderTemplate(resolved.subject, {
          name: params.name,
          download_url: params.downloadUrl,
        });
        return {
          subject,
          html,
          text: htmlToText(html),
        };
      }
    } catch (error) {
      console.error("Failed to load lead magnet email template:", error);
    }
  }

  const copy = fallbackCopy[params.locale];
  const html = `
    <p>${copy.greeting} ${safeName}</p>
    <p>${copy.body}</p>
    <p><a href="${params.downloadUrl}">${copy.buttonLabel}</a></p>
    <p>${copy.footer}<br /><a href="${params.downloadUrl}">${params.downloadUrl}</a></p>
  `;
  return {
    subject: copy.subject,
    html,
    text: `${copy.greeting} ${params.name}\n\n${copy.body}\n\n${params.downloadUrl}`,
  };
}

export async function subscribeLeadMagnet(params: {
  name: string;
  email: string;
  locale: Locale;
  downloadToken: string;
}): Promise<{ emailed: boolean; notified: boolean; persisted: boolean }> {
  let persisted = false;

  if (isDatabaseConfigured()) {
    try {
      await upsertLead({
        name: params.name,
        email: params.email,
        locale: params.locale,
        source: "lead_magnet",
      });
      persisted = true;
    } catch (error) {
      console.error("Failed to persist lead:", error);
    }
  }

  const resend = getResendClient();
  const from = getFromAddress();
  const downloadUrl = `${siteUrl}/api/lead-magnet/download?token=${encodeURIComponent(params.downloadToken)}`;

  let emailed = false;
  let notified = false;

  if (resend && from) {
    try {
      const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
      if (audienceId) {
        try {
          await resend.contacts.create({
            audienceId,
            email: params.email,
            firstName: params.name,
            unsubscribed: false,
          });
        } catch (error) {
          console.error("Resend contact create failed:", error);
        }
      }

      const content = await resolveEmailContent({
        name: params.name,
        locale: params.locale,
        downloadUrl,
      });

      await resend.emails.send({
        from,
        to: params.email,
        subject: content.subject,
        html: content.html,
        text: content.text,
      });
      emailed = true;

      const notifyTo = getNotifyAddress();
      if (notifyTo) {
        await resend.emails.send({
          from,
          to: notifyTo,
          subject: `Nuevo lead: ${params.email}`,
          text: `Nombre: ${params.name}\nEmail: ${params.email}\nIdioma: ${params.locale}`,
        });
        notified = true;
      }
    } catch (error) {
      console.error("Resend lead magnet delivery failed:", error);
    }
  }

  return { emailed, notified, persisted };
}

export function buildDownloadUrl(token: string): string {
  return `/api/lead-magnet/download?token=${encodeURIComponent(token)}`;
}

export function createTokenForEmail(email: string): string {
  return createLeadMagnetToken(email);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function htmlToText(html: string): string {
  return html
    .replaceAll(/<br\s*\/?>/gi, "\n")
    .replaceAll(/<\/p>/gi, "\n\n")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .trim();
}
