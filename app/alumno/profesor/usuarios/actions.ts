"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  clearParentStudentLinks,
  setParentStudentLink,
} from "@/lib/auth/parents";
import type { UserRole } from "@/lib/auth/constants";
import {
  createUser,
  deactivateUser,
  deleteUser,
  findUserByEmail,
  getManagedUserById,
  updateUser,
} from "@/lib/auth/users";
import { teacherPaths } from "@/lib/teacher/paths";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseRole(value: string): UserRole | null {
  if (
    value === "admin" ||
    value === "teacher" ||
    value === "student" ||
    value === "parent"
  ) {
    return value;
  }
  return null;
}

function revalidateUserPaths(id?: string) {
  revalidatePath(teacherPaths.users);
  if (id) {
    revalidatePath(teacherPaths.user(id));
  }
}

function mapUserError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "generic";
  }
  if (
    error.message === "CANNOT_DEACTIVATE_SELF" ||
    error.message === "CANNOT_DELETE_SELF" ||
    error.message === "CANNOT_DEMOTE_SELF"
  ) {
    return "self";
  }
  if (error.message === "LAST_ADMIN") {
    return "lastAdmin";
  }
  if (error.message === "PARENT_STUDENT_REQUIRED") {
    return "parentStudent";
  }
  return "generic";
}

export async function createManagedUserAction(formData: FormData) {
  await requireAdminUser();

  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const role = parseRole(readString(formData, "role"));
  const studentId = readString(formData, "studentId");
  const active = formData.get("active") === "on";

  if (name.length < 2 || !email.includes("@") || !role || password.length < 8) {
    redirect(`${teacherPaths.users}?error=generic`);
  }

  if (role === "parent" && !studentId) {
    redirect(`${teacherPaths.users}?error=parentStudent`);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    redirect(`${teacherPaths.users}?error=generic`);
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      role,
      active,
    });
    if (role === "parent") {
      await setParentStudentLink(user.id, studentId);
    }
    revalidateUserPaths(user.id);
    redirect(teacherPaths.user(user.id));
  } catch (error) {
    redirect(`${teacherPaths.users}?error=${mapUserError(error)}`);
  }
}

export async function updateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const role = parseRole(readString(formData, "role"));
  const studentId = readString(formData, "studentId");
  const active = formData.get("active") === "on";

  if (!id || name.length < 2 || !email.includes("@") || !role) {
    redirect(`${teacherPaths.user(id || "")}?error=generic`);
  }

  if (role === "parent" && !studentId) {
    redirect(`${teacherPaths.user(id)}?error=parentStudent`);
  }

  try {
    await updateUser({
      id,
      name,
      email,
      role,
      active,
      password: password.length >= 8 ? password : undefined,
      actorUserId: actor.userId,
    });

    if (role === "parent") {
      await setParentStudentLink(id, studentId);
    } else {
      await clearParentStudentLinks(id);
    }

    revalidateUserPaths(id);
    redirect(`${teacherPaths.user(id)}?saved=1`);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
}

export async function deactivateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  try {
    await deactivateUser(id, actor.userId);
    revalidateUserPaths(id);
    redirect(`${teacherPaths.user(id)}?saved=1`);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
}

export async function activateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  try {
    const user = await getManagedUserById(id);
    if (!user) {
      redirect(teacherPaths.users);
    }
    await updateUser({
      id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: true,
      actorUserId: actor.userId,
    });
    revalidateUserPaths(id);
    redirect(`${teacherPaths.user(id)}?saved=1`);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
}

export async function deleteManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  try {
    await deleteUser(id, actor.userId);
    revalidateUserPaths();
    redirect(teacherPaths.users);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
}
