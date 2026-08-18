"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/lib/auth/users";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSessionToken,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getPortalPathForRole } from "@/lib/materials/auth";

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
