import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const root = dirname(fileURLToPath(import.meta.url));
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
