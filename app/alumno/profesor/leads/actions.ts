"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createLead, deleteLead, updateLead } from "@/lib/crm/leads";
import { isLocale, type Locale } from "@/lib/locale";
import { teacherPaths } from "@/lib/teacher/paths";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function readLocale(formData: FormData): Locale {
  const value = readString(formData, "locale");
  return isLocale(value) ? value : "es";
}

function revalidateLeadPaths(id?: string) {
  revalidatePath(teacherPaths.home);
  revalidatePath(teacherPaths.leads);
  if (id) {
    revalidatePath(teacherPaths.lead(id));
  }
}

export async function createLeadAction(formData: FormData) {
  await requireAdmin();

  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const locale = readLocale(formData);
  const notes = readString(formData, "notes");

  if (name.length < 2 || !email.includes("@")) {
    return;
  }

  const lead = await createLead({
    name,
    email,
    locale,
    source: "manual",
    notes: notes || undefined,
  });

  revalidateLeadPaths(lead.id);
  redirect(teacherPaths.lead(lead.id));
}

export async function updateLeadAction(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  const name = readString(formData, "name");
  const locale = readLocale(formData);
  const notes = readString(formData, "notes");

  if (!id || name.length < 2) {
    return;
  }

  await updateLead(id, { name, locale, notes: notes || undefined });
  revalidateLeadPaths(id);
}

export async function deleteLeadAction(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) {
    return;
  }

  await deleteLead(id);
  revalidateLeadPaths();
  redirect(teacherPaths.leads);
}
