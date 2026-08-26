import { getDb } from "@/lib/db/client";
import type { StudentSummary } from "@/lib/materials/types";
import { hashPassword } from "./password";
import type { UserRole } from "./constants";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  clerkUserId: string | null;
};

/** Public user row for admin UI (no password hash). */
export type ManagedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  linkedStudentId: string | null;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  active: boolean;
  clerk_user_id: string | null;
};

type ManagedUserRow = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  linked_student_id: string | null;
};

type StudentRow = {
  id: string;
  email: string;
  name: string;
};

function mapUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role,
    active: Boolean(row.active),
    clerkUserId: row.clerk_user_id,
  };
}

function mapManagedUser(row: ManagedUserRow): ManagedUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    active: Boolean(row.active),
    linkedStudentId: row.linked_student_id,
  };
}

function splitName(name: string): { firstName: string | null; lastName: string | null } {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  return {
    firstName: parts[0] ?? null,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : null,
  };
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, email, name, password_hash, role, active, clerk_user_id
    FROM users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as UserRow[];

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, email, name, password_hash, role, active, clerk_user_id
    FROM users
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as UserRow[];

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function listUsers(): Promise<ManagedUser[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      u.id,
      u.email,
      u.name,
      u.role,
      u.active,
      (
        SELECT ps.student_user_id
        FROM parent_students ps
        WHERE ps.parent_user_id = u.id
        LIMIT 1
      ) AS linked_student_id
    FROM users u
    ORDER BY u.email ASC
  `) as ManagedUserRow[];

  return rows.map(mapManagedUser);
}

export async function getManagedUserById(id: string): Promise<ManagedUser | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      u.id,
      u.email,
      u.name,
      u.role,
      u.active,
      (
        SELECT ps.student_user_id
        FROM parent_students ps
        WHERE ps.parent_user_id = u.id
        LIMIT 1
      ) AS linked_student_id
    FROM users u
    WHERE u.id = ${id}::uuid
    LIMIT 1
  `) as ManagedUserRow[];

  return rows[0] ? mapManagedUser(rows[0]) : null;
}

async function countActiveAdmins(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT count(*)::int AS count
    FROM users
    WHERE role = 'admin' AND active = true
  `) as { count: number }[];
  return rows[0]?.count ?? 0;
}

export async function listStudents(): Promise<StudentSummary[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, email, name
    FROM users
    WHERE role = 'student' AND active = true
    ORDER BY email ASC
  `) as StudentRow[];

  return rows.map((row) => {
    const { firstName, lastName } = splitName(row.name);
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      firstName,
      lastName,
    };
  });
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  active?: boolean;
}) {
  const sql = getDb();
  const passwordHash = await hashPassword(input.password);
  const active = input.active ?? true;
  const rows = (await sql`
    INSERT INTO users (email, name, password_hash, role, active)
    VALUES (
      ${input.email.toLowerCase()},
      ${input.name},
      ${passwordHash},
      ${input.role},
      ${active}
    )
    RETURNING id, email, name, password_hash, role, active, clerk_user_id
  `) as UserRow[];

  return mapUser(rows[0]);
}

export async function updateUser(input: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  password?: string;
  actorUserId: string;
}): Promise<ManagedUser> {
  const existing = await findUserById(input.id);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }

  if (input.id === input.actorUserId && !input.active) {
    throw new Error("CANNOT_DEACTIVATE_SELF");
  }

  if (input.id === input.actorUserId && input.role !== "admin") {
    throw new Error("CANNOT_DEMOTE_SELF");
  }

  if (existing.role === "admin" && existing.active) {
    const demotingOrDeactivating = input.role !== "admin" || !input.active;
    if (demotingOrDeactivating) {
      const admins = await countActiveAdmins();
      if (admins <= 1) {
        throw new Error("LAST_ADMIN");
      }
    }
  }

  const sql = getDb();
  const email = input.email.trim().toLowerCase();

  if (input.password && input.password.length >= 8) {
    const passwordHash = await hashPassword(input.password);
    await sql`
      UPDATE users
      SET
        name = ${input.name.trim()},
        email = ${email},
        role = ${input.role},
        active = ${input.active},
        password_hash = ${passwordHash},
        updated_at = now()
      WHERE id = ${input.id}::uuid
    `;
  } else {
    await sql`
      UPDATE users
      SET
        name = ${input.name.trim()},
        email = ${email},
        role = ${input.role},
        active = ${input.active},
        updated_at = now()
      WHERE id = ${input.id}::uuid
    `;
  }

  const updated = await getManagedUserById(input.id);
  if (!updated) {
    throw new Error("USER_NOT_FOUND");
  }
  return updated;
}

export async function deactivateUser(
  userId: string,
  actorUserId: string,
): Promise<void> {
  if (userId === actorUserId) {
    throw new Error("CANNOT_DEACTIVATE_SELF");
  }
  const existing = await findUserById(userId);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  if (existing.role === "admin" && existing.active) {
    const admins = await countActiveAdmins();
    if (admins <= 1) {
      throw new Error("LAST_ADMIN");
    }
  }
  const sql = getDb();
  await sql`
    UPDATE users
    SET active = false, updated_at = now()
    WHERE id = ${userId}::uuid
  `;
}

export async function deleteUser(
  userId: string,
  actorUserId: string,
): Promise<void> {
  if (userId === actorUserId) {
    throw new Error("CANNOT_DELETE_SELF");
  }
  const existing = await findUserById(userId);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  if (existing.role === "admin" && existing.active) {
    const admins = await countActiveAdmins();
    if (admins <= 1) {
      throw new Error("LAST_ADMIN");
    }
  }
  const sql = getDb();
  await sql`
    DELETE FROM users
    WHERE id = ${userId}::uuid
  `;
}

export async function updateUserPassword(userId: string, password: string) {
  const sql = getDb();
  const passwordHash = await hashPassword(password);
  const rows = (await sql`
    UPDATE users
    SET password_hash = ${passwordHash}, updated_at = now()
    WHERE id = ${userId}::uuid
    RETURNING id
  `) as { id: string }[];

  return rows.length > 0;
}
