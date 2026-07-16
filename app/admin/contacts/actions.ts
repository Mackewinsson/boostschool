"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  deleteContactMessage,
  markContactMessageRead,
} from "@/lib/crm/contacts";

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
  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${id}`);
}

export async function deleteContactAction(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    return;
  }
  await deleteContactMessage(id);
  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  redirect("/admin/contacts");
}
