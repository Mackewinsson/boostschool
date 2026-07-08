import type { Locale } from "@/lib/locale";
import { getDb } from "@/lib/db/client";
import type { Assignment, Material } from "./types";

type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  locale: string;
  created_at: string;
  assigned_at?: string;
  completed_at?: string | null;
};

type AssignmentRow = {
  clerk_user_id: string;
  material_id: string;
  assigned_at: string;
  completed_at: string | null;
};

function mapMaterial(row: MaterialRow): Material {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    locale: row.locale as Locale,
    createdAt: row.created_at,
    ...(row.assigned_at !== undefined ? { assignedAt: row.assigned_at } : {}),
    ...(row.completed_at !== undefined ? { completedAt: row.completed_at } : {}),
  };
}

export async function listMaterials(): Promise<Material[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, title, description, url, locale, created_at
    FROM materials
    ORDER BY created_at DESC
  `) as MaterialRow[];
  return rows.map(mapMaterial);
}

export async function createMaterial(input: {
  title: string;
  description?: string;
  url: string;
  locale: Locale;
}): Promise<Material> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO materials (title, description, url, locale)
    VALUES (${input.title}, ${input.description ?? null}, ${input.url}, ${input.locale})
    RETURNING id, title, description, url, locale, created_at
  `) as MaterialRow[];
  return mapMaterial(rows[0]);
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    DELETE FROM materials WHERE id = ${id}::uuid RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

export async function listAssignments(userId?: string): Promise<Assignment[]> {
  const sql = getDb();
  const rows = (userId
    ? await sql`
        SELECT clerk_user_id, material_id, assigned_at, completed_at
        FROM student_materials
        WHERE clerk_user_id = ${userId}
        ORDER BY assigned_at DESC
      `
    : await sql`
        SELECT clerk_user_id, material_id, assigned_at, completed_at
        FROM student_materials
        ORDER BY assigned_at DESC
      `) as AssignmentRow[];

  return rows.map((row) => ({
    clerkUserId: row.clerk_user_id,
    materialId: row.material_id,
    assignedAt: row.assigned_at,
    completedAt: row.completed_at,
  }));
}

export async function assignMaterial(
  userId: string,
  materialId: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO student_materials (clerk_user_id, material_id)
    VALUES (${userId}, ${materialId}::uuid)
    ON CONFLICT (clerk_user_id, material_id) DO NOTHING
  `;
}

export async function unassignMaterial(
  userId: string,
  materialId: string,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    DELETE FROM student_materials
    WHERE clerk_user_id = ${userId} AND material_id = ${materialId}::uuid
    RETURNING clerk_user_id
  `) as { clerk_user_id: string }[];
  return rows.length > 0;
}

export async function listMaterialsForStudent(userId: string): Promise<Material[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT m.id, m.title, m.description, m.url, m.locale, m.created_at,
           sm.assigned_at, sm.completed_at
    FROM materials m
    INNER JOIN student_materials sm ON sm.material_id = m.id
    WHERE sm.clerk_user_id = ${userId}
    ORDER BY sm.assigned_at DESC
  `) as MaterialRow[];
  return rows.map(mapMaterial);
}

export async function setCompletion(
  userId: string,
  materialId: string,
  completed: boolean,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE student_materials
    SET completed_at = ${completed ? new Date().toISOString() : null}
    WHERE clerk_user_id = ${userId} AND material_id = ${materialId}::uuid
    RETURNING clerk_user_id
  `) as { clerk_user_id: string }[];
  return rows.length > 0;
}
