"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getEmailTemplate,
  LEAD_MAGNET_WELCOME_TEMPLATE_ID,
  updateEmailTemplate,
} from "@/lib/crm/templates";
import { isLocale } from "@/lib/locale";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { sendAssignmentPreviewEmail } from "@/lib/mail/assignment-notify";
import {
  buildLeadMagnetPreview,
  isTestEmailKind,
  leadMagnetTextFromHtml,
} from "@/lib/mail/preview";
import { isTransactionalEmailConfigured, sendResendEmail } from "@/lib/mail/resend";
import { getStudentContent } from "@/lib/student-content";
import { teacherPaths } from "@/lib/teacher/paths";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateEmailTemplateAction(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) {
    return;
  }

  await updateEmailTemplate(id, {
    subjectEs: readString(formData, "subject_es"),
    subjectEn: readString(formData, "subject_en"),
    subjectPl: readString(formData, "subject_pl"),
    bodyHtmlEs: readString(formData, "body_html_es"),
    bodyHtmlEn: readString(formData, "body_html_en"),
    bodyHtmlPl: readString(formData, "body_html_pl"),
  });

  revalidatePath(teacherPaths.emails);
}

export type SendTestEmailState = {
  ok: boolean;
  message: string;
} | null;

export async function sendTestEmailAction(
  _prev: SendTestEmailState,
  formData: FormData,
): Promise<NonNullable<SendTestEmailState>> {
  await requireAdmin();
  const locale = await getLocaleFromCookies();
  const copy = getStudentContent(locale).teacher;

  const to = readString(formData, "to");
  const kindRaw = readString(formData, "kind");
  const emailLocaleRaw = readString(formData, "emailLocale");
  const emailLocale = isLocale(emailLocaleRaw) ? emailLocaleRaw : locale;

  if (!isTestEmailKind(kindRaw)) {
    return { ok: false, message: copy.emailsTestErrorSend };
  }
  if (!to.includes("@")) {
    return { ok: false, message: copy.emailsTestErrorEmail };
  }

  if (kindRaw === "lead-magnet") {
    if (!isTransactionalEmailConfigured()) {
      return { ok: false, message: copy.emailsTestErrorConfig };
    }
    const template = await getEmailTemplate(LEAD_MAGNET_WELCOME_TEMPLATE_ID);
    if (!template) {
      return { ok: false, message: copy.emailsTestErrorSend };
    }
    const preview = buildLeadMagnetPreview(template, emailLocale);
    const mailCopy = getStudentContent(emailLocale).mail;
    const sent = await sendResendEmail({
      to,
      subject: `${mailCopy.testSubjectPrefix}${preview.subject}`,
      html: preview.html,
      text: leadMagnetTextFromHtml(preview.html),
    });
    return sent
      ? { ok: true, message: copy.emailsTestSent }
      : { ok: false, message: copy.emailsTestErrorSend };
  }

  const result = await sendAssignmentPreviewEmail({
    to,
    kind: kindRaw.startsWith("homework") ? "homework" : "material",
    forParent: kindRaw.endsWith("parent"),
    locale: emailLocale,
  });
  if (result === "ok") return { ok: true, message: copy.emailsTestSent };
  if (result === "not_configured") {
    return { ok: false, message: copy.emailsTestErrorConfig };
  }
  if (result === "invalid_email") {
    return { ok: false, message: copy.emailsTestErrorEmail };
  }
  return { ok: false, message: copy.emailsTestErrorSend };
}
