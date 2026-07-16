import { Resend } from "resend";
import { createContactMessage } from "@/lib/crm/contacts";
import { isDatabaseConfigured } from "@/lib/db/client";
import type { Locale } from "@/lib/locale";

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

export function isContactConfigured(): boolean {
  if (isDatabaseConfigured()) {
    return true;
  }
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_FROM_EMAIL?.trim() &&
      process.env.LEAD_MAGNET_NOTIFY_EMAIL?.trim(),
  );
}

export async function sendContactMessage(params: {
  name: string;
  email: string;
  message: string;
  locale: Locale;
}): Promise<{ persisted: boolean }> {
  let persisted = false;

  if (isDatabaseConfigured()) {
    try {
      await createContactMessage({
        name: params.name,
        email: params.email,
        message: params.message,
        locale: params.locale,
      });
      persisted = true;
    } catch (error) {
      console.error("Failed to persist contact message:", error);
    }
  }

  const resend = getResendClient();
  const from = getFromAddress();
  const notifyTo = getNotifyAddress();

  if (!resend || !from || !notifyTo) {
    if (!persisted) {
      throw new Error("Contact form is not configured");
    }
    return { persisted };
  }

  const subject = `Nuevo mensaje de contacto: ${params.email}`;
  const text = [
    `Nombre: ${params.name}`,
    `Email: ${params.email}`,
    `Idioma: ${params.locale}`,
    "",
    "Mensaje:",
    params.message,
  ].join("\n");

  const html = `
    <p><strong>Nombre:</strong> ${escapeHtml(params.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(params.email)}</p>
    <p><strong>Idioma:</strong> ${escapeHtml(params.locale)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(params.message).replaceAll("\n", "<br />")}</p>
  `;

  try {
    await resend.emails.send({
      from,
      to: notifyTo,
      replyTo: params.email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Contact notify email failed:", error);
    if (!persisted) {
      throw error;
    }
  }

  return { persisted };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
