import { auth, currentUser, type User } from "@clerk/nextjs/server";
import { getRoleFromMetadata } from "@/lib/materials/auth";

function getAdminAllowlistEmails(): Set<string> {
  const raw = process.env.CLERK_ADMIN_EMAILS?.trim();
  if (!raw) {
    return new Set();
  }
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  if (
    user.publicMetadata?.role === "admin" ||
    user.publicMetadata?.admin === true
  ) {
    return true;
  }

  const allowlist = getAdminAllowlistEmails();
  if (allowlist.size === 0) {
    return false;
  }

  return user.emailAddresses.some((entry) =>
    allowlist.has(entry.emailAddress.toLowerCase()),
  );
}

export function canAccessTeacherWorkspace(
  user: User | null | undefined,
): boolean {
  if (!user) {
    return false;
  }
  if (isAdminUser(user)) {
    return true;
  }
  return getRoleFromMetadata(user.id, user.publicMetadata) === "teacher";
}

export async function getAdminContext() {
  const session = await auth();
  if (!session.userId) {
    return null;
  }

  const user = await currentUser();
  if (!canAccessTeacherWorkspace(user)) {
    return null;
  }

  return {
    userId: session.userId,
    email: user?.emailAddresses[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context) {
    throw new Error("FORBIDDEN");
  }
  return context;
}
