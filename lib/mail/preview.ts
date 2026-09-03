import type { Locale } from "@/lib/locale";
import { LOCALES } from "@/lib/locale";
import type { EmailTemplate } from "@/lib/crm/types";
import { renderTemplate, resolveTemplateForLocale } from "@/lib/crm/templates";
import { siteUrl } from "@/lib/site-config";
import { getStudentContent } from "@/lib/student-content";
import { buildAssignmentEmail } from "./assignment-notify";

export const TEST_EMAIL_KINDS = [
  "homework-student",
  "homework-parent",
  "material-student",
  "material-parent",
  "lead-magnet",
] as const;

export type TestEmailKind = (typeof TEST_EMAIL_KINDS)[number];

export type TestEmailPreview = {
  subject: string;
  html: string;
};

export function isTestEmailKind(value: string): value is TestEmailKind {
  return (TEST_EMAIL_KINDS as readonly string[]).includes(value);
}

export function previewKey(kind: TestEmailKind, locale: Locale): string {
  return `${kind}:${locale}`;
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

export function buildLeadMagnetPreview(
  template: EmailTemplate,
  locale: Locale,
): TestEmailPreview {
  const copy = getStudentContent(locale).mail;
  const resolved = resolveTemplateForLocale(template, locale);
  const vars = {
    name: copy.sampleStudentName,
    download_url: `${siteUrl}/recursos`,
  };
  const html = renderTemplate(resolved.bodyHtml, vars);
  const subject = renderTemplate(resolved.subject, vars);
  return { subject, html };
}

export function buildAssignmentKindPreview(
  kind: Exclude<TestEmailKind, "lead-magnet">,
  locale: Locale,
): TestEmailPreview {
  const copy = getStudentContent(locale).mail;
  const forParent = kind.endsWith("parent");
  const isHomework = kind.startsWith("homework");
  const when = isHomework
    ? new Intl.DateTimeFormat(locale, {
        timeZone: "Europe/Warsaw",
        dateStyle: "medium",
        timeStyle: "short",
        hourCycle: "h23",
      }).format(new Date("2026-09-10T16:00:00.000Z"))
    : null;
  return buildAssignmentEmail({
    locale,
    recipientName: forParent ? copy.sampleParentName : copy.sampleStudentName,
    studentName: copy.sampleStudentName,
    forParent,
    kind: isHomework ? "homework" : "material",
    title: isHomework ? copy.sampleClassTitle : copy.sampleMaterialTitle,
    when,
    preview: isHomework ? copy.sampleHomeworkPreview : null,
  });
}

export function buildAllTestEmailPreviews(
  leadMagnet: EmailTemplate | null,
): Record<string, TestEmailPreview> {
  const previews: Record<string, TestEmailPreview> = {};
  for (const locale of LOCALES) {
    for (const kind of TEST_EMAIL_KINDS) {
      if (kind === "lead-magnet") {
        if (!leadMagnet) continue;
        previews[previewKey(kind, locale)] = buildLeadMagnetPreview(leadMagnet, locale);
        continue;
      }
      previews[previewKey(kind, locale)] = buildAssignmentKindPreview(kind, locale);
    }
  }
  return previews;
}

export function leadMagnetTextFromHtml(html: string): string {
  return htmlToText(html);
}
