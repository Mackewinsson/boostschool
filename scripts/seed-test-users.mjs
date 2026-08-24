import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

function loadEnvLocal() {
  const root = dirname(fileURLToPath(import.meta.url));
  const envPath = join(root, "../.env.local");
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const i = trimmed.indexOf("=");
      if (i < 0) continue;
      const key = trimmed.slice(0, i);
      let value = trimmed.slice(i + 1);
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local optional if DATABASE_URL already set
  }
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(databaseUrl);
const PASSWORD = process.env.TEST_USERS_PASSWORD?.trim() || "Prueba123!";

const USERS = [
  {
    email: "admin@bilingualboost.test",
    name: "Admin Prueba",
    role: "admin",
  },
  {
    email: "profe@bilingualboost.test",
    name: "Paulina Prueba",
    role: "teacher",
  },
  {
    email: "alumno@bilingualboost.test",
    name: "Ana Alumna",
    role: "student",
  },
  {
    email: "padre@bilingualboost.test",
    name: "María Madre",
    role: "parent",
  },
];

async function upsertUser({ email, name, role }, passwordHash) {
  const rows = await sql`
    INSERT INTO users (email, name, password_hash, role, active)
    VALUES (${email}, ${name}, ${passwordHash}, ${role}, true)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      active = true,
      updated_at = now()
    RETURNING id, email, role, name
  `;
  return rows[0];
}

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const created = {};

  for (const user of USERS) {
    created[user.role] = await upsertUser(user, passwordHash);
  }

  await sql`
    INSERT INTO parent_students (parent_user_id, student_user_id)
    VALUES (${created.parent.id}::uuid, ${created.student.id}::uuid)
    ON CONFLICT (parent_user_id, student_user_id) DO NOTHING
  `;

  const materials = await sql`
    SELECT id FROM materials ORDER BY created_at DESC LIMIT 1
  `;

  if (materials[0]) {
    await sql`
      INSERT INTO student_materials (user_id, material_id)
      VALUES (${created.student.id}::uuid, ${materials[0].id}::uuid)
      ON CONFLICT (user_id, material_id) DO NOTHING
    `;
  } else {
    console.log("No materials yet — create one as teacher to test assignments.");
  }

  console.log("Test users ready (password for all):", PASSWORD);
  console.log("");
  for (const user of USERS) {
    const row = created[user.role];
    console.log(`- ${row.role.padEnd(8)} ${row.email}  (${row.name})`);
  }
  console.log("");
  console.log("Parent is linked to student:", created.student.email);
  if (materials[0]) {
    console.log("Assigned latest material to student.");
  } else {
    console.log("No materials yet — create one as teacher to test assignments.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
