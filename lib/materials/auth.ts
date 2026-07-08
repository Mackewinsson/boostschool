import { auth, currentUser } from "@clerk/nextjs/server";
import type { Role } from "./types";

function getTeacherAllowlist(): Set<string> {
  const raw = process.env.CLERK_TEACHER_USER_IDS?.trim();
  if (!raw) {
    return new Set();
  }
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export function getRoleFromMetadata(
  userId: string,
  publicMetadata: Record<string, unknown> | undefined,
): Role {
  const role = publicMetadata?.role;
  if (role === "teacher" || role === "student") {
    return role;
  }
  if (getTeacherAllowlist().has(userId)) {
    return "teacher";
  }
  return "student";
}

export async function getAuthContext() {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const role = getRoleFromMetadata(userId, user?.publicMetadata);

  return {
    userId,
    role,
    email: user?.emailAddresses[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
  };
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
  if (context.role !== "teacher") {
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

export function getPortalPathForRole(role: Role): string {
  return role === "teacher" ? "/alumno/profesor" : "/alumno";
}
