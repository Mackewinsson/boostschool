"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail, findUserById, updateUserPassword } from "@/lib/auth/users";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSessionToken,
} from "@/lib/auth/session";
import { MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { getAuthContext, getPortalPathForRole } from "@/lib/materials/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "INVALID_CREDENTIALS" };
  }

  const user = await findUserByEmail(email);
  if (!user || !user.active) {
    return { error: "INVALID_CREDENTIALS" };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: "INVALID_CREDENTIALS" };
  }

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
  redirect(getPortalPathForRole(user.role));
}

export async function logoutAction() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  redirect("/sign-in");
}

export type ChangePasswordState = {
  error?:
    | "current"
    | "short"
    | "mismatch"
    | "same"
    | "generic";
  saved?: boolean;
};

function readPasswordField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function changeOwnPasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const context = await getAuthContext();
  if (!context) {
    redirect("/sign-in");
  }

  const currentPassword = readPasswordField(formData, "currentPassword");
  const password = readPasswordField(formData, "password");
  const passwordConfirm = readPasswordField(formData, "passwordConfirm");

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: "short" };
  }
  if (password !== passwordConfirm) {
    return { error: "mismatch" };
  }
  if (password === currentPassword) {
    return { error: "same" };
  }

  const user = await findUserById(context.userId);
  if (!user || !user.active) {
    redirect("/sign-in");
  }

  const currentOk = await verifyPassword(currentPassword, user.passwordHash);
  if (!currentOk) {
    return { error: "current" };
  }

  try {
    await updateUserPassword(user.id, password);
  } catch {
    return { error: "generic" };
  }

  return { saved: true };
}
