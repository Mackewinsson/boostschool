import { Resend } from "resend";
import { siteUrl } from "@/lib/site-config";
import type { Locale } from "@/lib/locale";
import { createLeadMagnetToken } from "./token";

type LeadMagnetEmailCopy = {
  subject: string;
  preview: string;
  greeting: string;
  body: string;
  buttonLabel: string;
  footer: string;
};

const emailCopy: Record<Locale, LeadMagnetEmailCopy> = {
  es: {
    subject: "Tu guía gratis de Bilingual Boost",
    preview: "Descarga tu guía y empieza a hablar con más confianza.",
    greeting: "¡Hola!",
    body: "Gracias por registrarte. Aquí tienes tu guía gratis para soltarte al hablar y organizar tu aprendizaje.",
    buttonLabel: "Descargar guía PDF",
    footer: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
  },
  en: {
    subject: "Your free Bilingual Boost guide",
    preview: "Download your guide and start speaking with more confidence.",
    greeting: "Hi!",
    body: "Thanks for signing up. Here is your free guide to speak more freely and organize your learning.",
    buttonLabel: "Download PDF guide",
    footer: "If the button does not work, copy and paste this link into your browser:",
  },
  pl: {
    subject: "Twój darmowy przewodnik Bilingual Boost",
    preview: "Pobierz przewodnik i zacznij mówić z większą pewnością.",
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

export async function subscribeLeadMagnet(params: {
  name: string;
  email: string;
  locale: Locale;
  downloadToken: string;
}): Promise<{ emailed: boolean; notified: boolean }> {
  const resend = getResendClient();
  const from = getFromAddress();
  const copy = emailCopy[params.locale];
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

      await resend.emails.send({
        from,
        to: params.email,
        subject: copy.subject,
        html: `
        <p>${copy.greeting} ${escapeHtml(params.name)}</p>
        <p>${copy.body}</p>
        <p><a href="${downloadUrl}">${copy.buttonLabel}</a></p>
        <p>${copy.footer}<br /><a href="${downloadUrl}">${downloadUrl}</a></p>
      `,
        text: `${copy.greeting} ${params.name}\n\n${copy.body}\n\n${downloadUrl}`,
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

  return { emailed, notified };
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
