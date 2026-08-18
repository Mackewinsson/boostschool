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
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context) {
    throw new Error("FORBIDDEN");
  }
  return context;
}
