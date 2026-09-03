import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

const root = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: join(root, "../.env.local") });
loadEnv({ path: join(root, "../.env") });

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const schemaPath = join(root, "../lib/db/schema.sql");
const schema = readFileSync(schemaPath, "utf8");

const sql = neon(databaseUrl);
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Database schema applied.");
