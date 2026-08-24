import { cookies } from "next/headers";
import { getLinkedStudentForParent } from "@/lib/auth/parents";
import { findUserById } from "@/lib/auth/users";
import {
  SESSION_COOKIE,
  type UserRole,
  verifySessionToken,
} from "@/lib/auth/session";
import type { Role } from "./types";

export function getRoleFromMetadata(
  _userId: string,
  publicMetadata: Record<string, unknown> | undefined,
): Role {
  const role = publicMetadata?.role;
  if (
    role === "admin" ||
    role === "teacher" ||
    role === "student" ||
    role === "parent"
  ) {
    return role;
  }
  return "student";
}

export async function getAuthContext() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return null;
  }

  const user = await findUserById(session.sub);
  if (!user || !user.active) {
    return null;
  }

  const [firstName, ...lastNameParts] = user.name.trim().split(/\s+/);

  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    firstName: firstName ?? null,
    lastName: lastNameParts.length > 0 ? lastNameParts.join(" ") : null,
  };
}

export async function getEffectiveStudentId(
  context: NonNullable<Awaited<ReturnType<typeof getAuthContext>>>,
): Promise<string | null> {
  if (context.role === "student") {
    return context.userId;
  }

  if (context.role === "parent") {
    const linked = await getLinkedStudentForParent(context.userId);
    return linked?.id ?? null;
  }

  return null;
}

export async function getLinkedStudentName(
  context: NonNullable<Awaited<ReturnType<typeof getAuthContext>>>,
): Promise<string | null> {
  if (context.role !== "parent") {
    return null;
  }
  const linked = await getLinkedStudentForParent(context.userId);
  return linked?.name ?? null;
}

export async function requireAuth() {
  const context = await getAuthContext();
  if (!context) {
    throw new Error("UNAUTHORIZED");
  }
  return context;
}

export async function requireTeacher() {
  const context = await requireAuth();
  if (context.role !== "teacher" && context.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return context;
}

export async function requireStudentOrParent() {
  const context = await requireAuth();
  if (context.role !== "student" && context.role !== "parent") {
    throw new Error("FORBIDDEN");
  }
  return context;
}

export async function requireStudent() {
  const context = await requireAuth();
  if (context.role !== "student") {
    throw new Error("FORBIDDEN");
  }
  return context;
}

export function canAccessTeacherRole(role: UserRole): boolean {
  return role === "teacher" || role === "admin";
}

export function isParentRole(role: UserRole): boolean {
  return role === "parent";
}

export function getPortalPathForRole(role: Role): string {
  return canAccessTeacherRole(role) ? "/alumno/profesor" : "/alumno";
}
