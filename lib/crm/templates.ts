import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/locale";
import type { EmailTemplate } from "./types";

export const LEAD_MAGNET_WELCOME_TEMPLATE_ID = "lead_magnet_welcome";

type TemplateRow = {
  id: string;
  subject_es: string;
  subject_en: string;
  subject_pl: string;
  body_html_es: string;
  body_html_en: string;
  body_html_pl: string;
  updated_at: string;
};

function mapTemplate(row: TemplateRow): EmailTemplate {
  return {
    id: row.id,
    subjectEs: row.subject_es,
    subjectEn: row.subject_en,
    subjectPl: row.subject_pl,
    bodyHtmlEs: row.body_html_es,
    bodyHtmlEn: row.body_html_en,
    bodyHtmlPl: row.body_html_pl,
    updatedAt: row.updated_at,
  };
}

export async function listEmailTemplates(): Promise<EmailTemplate[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      id,
      subject_es,
      subject_en,
      subject_pl,
      body_html_es,
      body_html_en,
      body_html_pl,
      updated_at
    FROM email_templates
    ORDER BY id ASC
  `) as TemplateRow[];
  return rows.map(mapTemplate);
}

export async function getEmailTemplate(
  id: string,
): Promise<EmailTemplate | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      id,
      subject_es,
      subject_en,
      subject_pl,
      body_html_es,
      body_html_en,
      body_html_pl,
      updated_at
    FROM email_templates
    WHERE id = ${id}
    LIMIT 1
  `) as TemplateRow[];
  return rows[0] ? mapTemplate(rows[0]) : null;
}

export async function updateEmailTemplate(
  id: string,
  input: {
    subjectEs: string;
    subjectEn: string;
    subjectPl: string;
    bodyHtmlEs: string;
    bodyHtmlEn: string;
    bodyHtmlPl: string;
  },
): Promise<EmailTemplate | null> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE email_templates
    SET
      subject_es = ${input.subjectEs},
      subject_en = ${input.subjectEn},
      subject_pl = ${input.subjectPl},
      body_html_es = ${input.bodyHtmlEs},
      body_html_en = ${input.bodyHtmlEn},
      body_html_pl = ${input.bodyHtmlPl},
      updated_at = now()
    WHERE id = ${id}
    RETURNING
      id,
      subject_es,
      subject_en,
      subject_pl,
      body_html_es,
      body_html_en,
      body_html_pl,
      updated_at
  `) as TemplateRow[];
  return rows[0] ? mapTemplate(rows[0]) : null;
}

export function resolveTemplateForLocale(
  template: EmailTemplate,
  locale: Locale,
): { subject: string; bodyHtml: string } {
  if (locale === "en") {
    return { subject: template.subjectEn, bodyHtml: template.bodyHtmlEn };
  }
  if (locale === "pl") {
    return { subject: template.subjectPl, bodyHtml: template.bodyHtmlPl };
  }
  return { subject: template.subjectEs, bodyHtml: template.bodyHtmlEs };
}

export function renderTemplate(
  htmlOrSubject: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (content, [key, value]) =>
      content.replaceAll(`{{${key}}}`, value),
    htmlOrSubject,
  );
}
