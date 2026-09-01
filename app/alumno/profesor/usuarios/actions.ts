"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  clearParentStudentLinks,
  setParentStudentLink,
} from "@/lib/auth/parents";
import type { UserRole } from "@/lib/auth/constants";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import {
  createUser,
  deactivateUser,
  deleteUser,
  findUserByEmail,
  getManagedUserById,
  updateUser,
  updateUserPassword,
} from "@/lib/auth/users";
import { teacherPaths } from "@/lib/teacher/paths";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function readPassword(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
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
  if (error.message === "PASSWORD_TOO_SHORT") {
    return "password";
  }
  if (error.message === "PASSWORD_MISMATCH") {
    return "passwordMismatch";
  }
  return "generic";
}

export async function createManagedUserAction(formData: FormData) {
  await requireAdminUser();

  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const password = readPassword(formData, "password");
  const role = parseRole(readString(formData, "role"));
  const studentId = readString(formData, "studentId");
  const active = formData.get("active") === "on";

  if (
    name.length < 2 ||
    !email.includes("@") ||
    !role ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    redirect(`${teacherPaths.users}?error=generic`);
  }

  if (role === "parent" && !studentId) {
    redirect(`${teacherPaths.users}?error=parentStudent`);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    redirect(`${teacherPaths.users}?error=generic`);
  }

  let userId: string;
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
    userId = user.id;
  } catch (error) {
    redirect(`${teacherPaths.users}?error=${mapUserError(error)}`);
  }

  revalidateUserPaths(userId);
  redirect(teacherPaths.user(userId));
}

export async function updateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
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
      actorUserId: actor.userId,
    });

    if (role === "parent") {
      await setParentStudentLink(id, studentId);
    } else {
      await clearParentStudentLinks(id);
    }
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }

  revalidateUserPaths(id);
  redirect(`${teacherPaths.user(id)}?saved=1`);
}

export async function updateManagedUserPasswordAction(formData: FormData) {
  await requireAdminUser();
  const id = readString(formData, "id");
  const password = readPassword(formData, "password");
  const passwordConfirm = readPassword(formData, "passwordConfirm");

  if (!id) {
    redirect(teacherPaths.users);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect(`${teacherPaths.user(id)}?error=password`);
  }

  if (password !== passwordConfirm) {
    redirect(`${teacherPaths.user(id)}?error=passwordMismatch`);
  }

  try {
    await updateUserPassword(id, password);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }

  revalidateUserPaths(id);
  redirect(`${teacherPaths.user(id)}?saved=password`);
}

export async function deactivateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  try {
    await deactivateUser(id, actor.userId);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
  revalidateUserPaths(id);
  redirect(`${teacherPaths.user(id)}?saved=1`);
}

export async function activateManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  const user = await getManagedUserById(id);
  if (!user) {
    redirect(teacherPaths.users);
  }

  try {
    await updateUser({
      id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: true,
      actorUserId: actor.userId,
    });
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
  revalidateUserPaths(id);
  redirect(`${teacherPaths.user(id)}?saved=1`);
}

export async function deleteManagedUserAction(formData: FormData) {
  const actor = await requireAdminUser();
  const id = readString(formData, "id");
  if (!id) {
    redirect(teacherPaths.users);
  }
  try {
    await deleteUser(id, actor.userId);
  } catch (error) {
    redirect(`${teacherPaths.user(id)}?error=${mapUserError(error)}`);
  }
  revalidateUserPaths();
  redirect(teacherPaths.users);
}
