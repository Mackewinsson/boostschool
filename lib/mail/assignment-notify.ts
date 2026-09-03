import { findUserById } from "@/lib/auth/users";
import { listParentsForStudent } from "@/lib/auth/parents";
import type { Locale } from "@/lib/locale";
import {
  getMaterial,
  listStudentUserIdsForMaterial,
} from "@/lib/materials/repository";
import type { Material } from "@/lib/materials/types";
import { siteUrl } from "@/lib/site-config";
import { getStudentContent } from "@/lib/student-content";
import { escapeHtml, isTransactionalEmailConfigured, sendResendEmail } from "./resend";

const PORTAL_PATH = "/alumno";
const PREVIEW_MAX = 280;

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

function firstName(name: string): string {
  const part = name.trim().split(/\s+/).filter(Boolean)[0];
  return part || name.trim();
}

/** Skip seed/e2e inboxes so Playwright does not hit Resend. */
export function shouldSendAssignmentEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  if (normalized.endsWith(".test") || normalized.endsWith(".example")) return false;
  if (normalized.endsWith("@example.com")) return false;
  return true;
}

function formatWhen(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Warsaw",
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
  }).format(date);
}

function previewText(value: string | null | undefined): string | null {
  const text = value?.trim() ?? "";
  if (!text) return null;
  if (text.length <= PREVIEW_MAX) return text;
  return `${text.slice(0, PREVIEW_MAX).trimEnd()}…`;
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

export function buildAssignmentEmail(input: {
  locale: Locale;
  recipientName: string;
  studentName: string;
  forParent: boolean;
  kind: "homework" | "material";
  title: string;
  when: string | null;
  preview: string | null;
}): { subject: string; html: string; text: string } {
  const copy = getStudentContent(input.locale).mail;
  const portalUrl = `${siteUrl}${PORTAL_PATH}`;
  const name = firstName(input.recipientName) || input.recipientName;
  const vars = {
    name,
    studentName: input.studentName,
    title: input.title,
    when: input.when ?? "",
    url: portalUrl,
  };

  const subject = fill(
    input.forParent
      ? input.kind === "homework"
        ? copy.parentHomeworkSubject
        : copy.parentMaterialSubject
      : input.kind === "homework"
        ? copy.homeworkSubject
        : copy.materialSubject,
    vars,
  );
  const body = fill(
    input.forParent
      ? input.kind === "homework"
        ? copy.parentHomeworkBody
        : copy.parentMaterialBody
      : input.kind === "homework"
        ? copy.homeworkBody
        : copy.materialBody,
    vars,
  );

  const greeting = fill(copy.greeting, vars);
  const whenLine = input.when ? fill(copy.whenLabel, vars) : "";
  const preview = input.kind === "homework" ? input.preview : null;
  const footer = fill(copy.footer, vars);

  const html = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>${escapeHtml(body)}</p>`,
    whenLine ? `<p>${escapeHtml(whenLine)}</p>` : "",
    preview
      ? `<p><strong>${escapeHtml(copy.previewLabel)}</strong></p><p>${escapeHtml(preview).replaceAll("\n", "<br />")}</p>`
      : "",
    `<p><a href="${escapeHtml(portalUrl)}">${escapeHtml(copy.ctaLabel)}</a></p>`,
    `<p>${escapeHtml(footer)}</p>`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text: htmlToText(html) };
}

async function sendToInbox(input: {
  email: string;
  locale: Locale;
  recipientName: string;
  studentName: string;
  forParent: boolean;
  kind: "homework" | "material";
  title: string;
  when: string | null;
  preview: string | null;
}): Promise<void> {
  if (!shouldSendAssignmentEmail(input.email)) return;
  const content = buildAssignmentEmail(input);
  await sendResendEmail({
    to: input.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });
}

function notifyKind(material: Material): "homework" | "material" | null {
  if (material.scheduledAt) {
    return material.description?.trim() ? "homework" : null;
  }
  return "material";
}

async function notifyStudentAndParents(input: {
  studentUserId: string;
  material: Material;
}): Promise<void> {
  if (!isTransactionalEmailConfigured()) return;

  const student = await findUserById(input.studentUserId);
  if (!student || !student.active || student.role !== "student") return;

  const kind = notifyKind(input.material);
  if (!kind) return;

  const locale = input.material.locale;
  const when = formatWhen(input.material.scheduledAt, locale);
  const preview = previewText(input.material.description);
  const shared = {
    locale,
    studentName: student.name,
    kind,
    title: input.material.title,
    when,
    preview,
  };

  await sendToInbox({
    ...shared,
    email: student.email,
    recipientName: student.name,
    forParent: false,
  });

  const parents = await listParentsForStudent(input.studentUserId);
  for (const parent of parents) {
    if (parent.email.toLowerCase() === student.email.toLowerCase()) continue;
    await sendToInbox({
      ...shared,
      email: parent.email,
      recipientName: parent.name,
      forParent: true,
    });
  }
}

/** New extra (or class) assigned to a student. */
export async function notifyMaterialAssigned(input: {
  studentUserId: string;
  materialId: string;
}): Promise<void> {
  try {
    const material = await getMaterial(input.materialId);
    if (!material) return;
    await notifyStudentAndParents({
      studentUserId: input.studentUserId,
      material,
    });
  } catch (error) {
    console.error("Assignment notify failed:", error);
  }
}

/** Homework text saved on a class already assigned to students. */
export async function notifyHomeworkSaved(input: { materialId: string }): Promise<void> {
  try {
    const material = await getMaterial(input.materialId);
    if (!material) return;
    const studentIds = await listStudentUserIdsForMaterial(input.materialId);
    for (const studentUserId of studentIds) {
      await notifyStudentAndParents({ studentUserId, material });
    }
  } catch (error) {
    console.error("Homework notify failed:", error);
  }
}

function isSendableAddress(email: string): boolean {
  const normalized = email.trim();
  return normalized.includes("@") && normalized.length >= 5;
}

/** Admin/teacher preview: send a sample homework or material email to `to`. */
export async function sendAssignmentPreviewEmail(input: {
  to: string;
  kind: "homework" | "material";
  forParent: boolean;
  locale: Locale;
}): Promise<"ok" | "not_configured" | "invalid_email" | "send_failed"> {
  if (!isTransactionalEmailConfigured()) return "not_configured";
  if (!isSendableAddress(input.to)) return "invalid_email";

  const copy = getStudentContent(input.locale).mail;
  const when = input.kind === "homework" ? formatWhen("2026-09-10T16:00:00.000Z", input.locale) : null;
  const content = buildAssignmentEmail({
    locale: input.locale,
    recipientName: input.forParent ? copy.sampleParentName : copy.sampleStudentName,
    studentName: copy.sampleStudentName,
    forParent: input.forParent,
    kind: input.kind,
    title: input.kind === "homework" ? copy.sampleClassTitle : copy.sampleMaterialTitle,
    when,
    preview: input.kind === "homework" ? copy.sampleHomeworkPreview : null,
  });

  const sent = await sendResendEmail({
    to: input.to.trim(),
    subject: `${copy.testSubjectPrefix}${content.subject}`,
    html: content.html,
    text: content.text,
  });
  return sent ? "ok" : "send_failed";
}
