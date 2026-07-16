"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { updateEmailTemplate } from "@/lib/crm/templates";

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

  revalidatePath("/admin/emails");
}
