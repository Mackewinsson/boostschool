import type { UserRole } from "@/lib/auth/constants";
import { canAccessTeacherRole, requireAuth } from "@/lib/materials/auth";

export function isAdminUser(role: string | null | undefined): boolean {
  return role === "admin";
}

export function canAccessTeacherWorkspace(
  role: string | null | undefined,
): boolean {
  return role === "admin" || role === "teacher";
}

export async function getAdminContext() {
  const context = await requireAuth().catch(() => null);
  if (!context || !canAccessTeacherRole(context.role)) {
    return null;
  }

  return {
    userId: context.userId,
    email: context.email,
    firstName: context.firstName,
    role: context.role as UserRole,
  };
}

/** CRM / teacher workspace gate (admin OR teacher). Prefer requireAdminUser for user CRUD. */
export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context) {
    throw new Error("FORBIDDEN");
  }
  return context;
}

/** Strict admin-only gate for managing portal users. */
export async function requireAdminUser() {
  const context = await requireAuth();
  if (!isAdminUser(context.role)) {
    throw new Error("FORBIDDEN");
  }
  return {
    userId: context.userId,
    email: context.email,
    firstName: context.firstName,
    role: context.role as UserRole,
  };
}
