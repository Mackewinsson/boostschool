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

type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  active: boolean;
  clerk_user_id: string | null;
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
    active: row.active,
    clerkUserId: row.clerk_user_id,
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
}) {
  const sql = getDb();
  const passwordHash = await hashPassword(input.password);
  const rows = (await sql`
    INSERT INTO users (email, name, password_hash, role)
    VALUES (
      ${input.email.toLowerCase()},
      ${input.name},
      ${passwordHash},
      ${input.role}
    )
    RETURNING id, email, name, password_hash, role, active, clerk_user_id
  `) as UserRow[];

  return mapUser(rows[0]);
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
