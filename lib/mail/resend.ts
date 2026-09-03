import { Resend } from "resend";

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getFromAddress(): string | null {
  return process.env.RESEND_FROM_EMAIL?.trim() || null;
}

export function isTransactionalEmailConfigured(): boolean {
  return Boolean(getResendClient() && getFromAddress());
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const resend = getResendClient();
  const from = getFromAddress();
  if (!resend || !from) return false;

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    if (error) {
      console.error("Resend send failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend send failed:", error);
    return false;
  }
}
