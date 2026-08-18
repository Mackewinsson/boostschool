import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!clerkSecretKey) {
  throw new Error("CLERK_SECRET_KEY is required to import users from Clerk.");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sql = neon(databaseUrl);

function csvSet(value) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

const adminEmails = csvSet(process.env.CLERK_ADMIN_EMAILS);
const teacherEmails = csvSet(process.env.CLERK_TEACHER_EMAILS);
const teacherIds = csvSet(process.env.CLERK_TEACHER_USER_IDS);

function mapRole(user) {
  const email = user.email_addresses?.[0]?.email_address?.toLowerCase() ?? "";
  const role = user.public_metadata?.role;
  const isAdmin =
    role === "admin" ||
    user.public_metadata?.admin === true ||
    adminEmails.has(email);

  if (isAdmin) {
    return "admin";
  }

  if (role === "teacher" || teacherEmails.has(email) || teacherIds.has(user.id.toLowerCase())) {
    return "teacher";
  }

  return "student";
}

function buildName(user) {
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (name) {
    return name;
  }
  const email = user.email_addresses?.[0]?.email_address ?? user.id;
  return email.split("@")[0];
}

function generateTempPassword() {
  return randomBytes(9).toString("base64url");
}

async function listClerkUsers() {
  const users = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = new URL("https://api.clerk.com/v1/users");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Clerk export failed: ${response.status} ${text}`);
    }

    const page = await response.json();
    if (!Array.isArray(page) || page.length === 0) {
      break;
    }

    users.push(...page);
    if (page.length < limit) {
      break;
    }
    offset += limit;
  }

  return users;
}

async function ensureUsersTableReady() {
  await sql`
    ALTER TABLE student_materials
    ADD COLUMN IF NOT EXISTS user_id UUID
  `;
}

async function importUsers() {
  const clerkUsers = await listClerkUsers();
  const credentials = [];

  for (const user of clerkUsers) {
    const email = user.email_addresses?.[0]?.email_address?.toLowerCase();
    if (!email) {
      continue;
    }

    const name = buildName(user);
    const role = mapRole(user);
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const rows = await sql`
      INSERT INTO users (email, name, password_hash, role, clerk_user_id, active)
      VALUES (${email}, ${name}, ${passwordHash}, ${role}, ${user.id}, true)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        clerk_user_id = EXCLUDED.clerk_user_id,
        active = true,
        updated_at = now()
      RETURNING id, email, role, clerk_user_id
    `;

    credentials.push({
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role,
      tempPassword,
      clerkUserId: rows[0].clerk_user_id,
    });
  }

  return credentials;
}

async function remapAssignments() {
  await sql`
    UPDATE student_materials sm
    SET user_id = u.id
    FROM users u
    WHERE sm.clerk_user_id = u.clerk_user_id
      AND sm.user_id IS DISTINCT FROM u.id
  `;

  await sql`
    DELETE FROM student_materials
    WHERE user_id IS NULL
  `;

  await sql`
    ALTER TABLE student_materials
    DROP CONSTRAINT IF EXISTS student_materials_pkey
  `;

  await sql`
    ALTER TABLE student_materials
    ADD CONSTRAINT student_materials_pkey PRIMARY KEY (user_id, material_id)
  `;

  await sql`
    ALTER TABLE student_materials
    ALTER COLUMN user_id SET NOT NULL
  `;

  await sql`
    ALTER TABLE student_materials
    DROP COLUMN IF EXISTS clerk_user_id
  `;

  await sql`
    DROP INDEX IF EXISTS idx_student_materials_user
  `;
}

async function main() {
  await ensureUsersTableReady();
  const credentials = await importUsers();
  await remapAssignments();

  mkdirSync(".tmp", { recursive: true });
  const outputPath = ".tmp/clerk-migrated-users.json";
  writeFileSync(outputPath, `${JSON.stringify(credentials, null, 2)}\n`);

  console.log(`Imported ${credentials.length} Clerk users.`);
  console.log(`Saved temporary credentials to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
