"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  deleteContactMessage,
  markContactMessageRead,
} from "@/lib/crm/contacts";
import { teacherPaths } from "@/lib/teacher/paths";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function markContactReadAction(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    return;
  }
  await markContactMessageRead(id);
  revalidatePath(teacherPaths.home);
  revalidatePath(teacherPaths.contacts);
  revalidatePath(teacherPaths.contact(id));
}

export async function deleteContactAction(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    return;
  }
  await deleteContactMessage(id);
  revalidatePath(teacherPaths.home);
  revalidatePath(teacherPaths.contacts);
  redirect(teacherPaths.contacts);
}
