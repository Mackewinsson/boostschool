import type { Locale } from "@/lib/locale";
import { getDb } from "@/lib/db/client";
import type { Assignment, CompletionStatus, Material } from "./types";

type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  locale: string;
  scheduled_at: string | null;
  meet_url: string | null;
  created_at: string;
  assigned_at?: string;
  completion_status?: CompletionStatus | null;
  reviewed_at?: string | null;
  notes?: string | null;
};

type AssignmentRow = {
  user_id: string;
  material_id: string;
  assigned_at: string;
  completion_status: CompletionStatus | null;
  reviewed_at: string | null;
  notes: string | null;
};

function mapMaterial(row: MaterialRow): Material {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    locale: row.locale as Locale,
    scheduledAt: row.scheduled_at,
    meetUrl: row.meet_url,
    createdAt: row.created_at,
    ...(row.assigned_at !== undefined ? { assignedAt: row.assigned_at } : {}),
    ...(row.completion_status !== undefined
      ? { completionStatus: row.completion_status }
      : {}),
    ...(row.reviewed_at !== undefined ? { reviewedAt: row.reviewed_at } : {}),
    ...(row.notes !== undefined ? { notes: row.notes } : {}),
  };
}

export async function listMaterials(): Promise<Material[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, title, description, url, locale, scheduled_at, meet_url, created_at
    FROM materials
    ORDER BY scheduled_at ASC NULLS LAST, created_at DESC
  `) as MaterialRow[];
  return rows.map(mapMaterial);
}

export async function createMaterial(input: {
  title: string;
  description?: string;
  url: string;
  locale: Locale;
  scheduledAt?: string | null;
  meetUrl?: string | null;
}): Promise<Material> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO materials (title, description, url, locale, scheduled_at, meet_url)
    VALUES (
      ${input.title},
      ${input.description ?? null},
      ${input.url},
      ${input.locale},
      ${input.scheduledAt ?? null},
      ${input.meetUrl ?? null}
    )
    RETURNING id, title, description, url, locale, scheduled_at, meet_url, created_at
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
        SELECT user_id, material_id, assigned_at, completion_status, reviewed_at, notes
        FROM student_materials
        WHERE user_id = ${userId}::uuid
        ORDER BY assigned_at DESC
      `
    : await sql`
        SELECT user_id, material_id, assigned_at, completion_status, reviewed_at, notes
        FROM student_materials
        ORDER BY assigned_at DESC
      `) as AssignmentRow[];

  return rows.map((row) => ({
    userId: row.user_id,
    materialId: row.material_id,
    assignedAt: row.assigned_at,
    completionStatus: row.completion_status,
    reviewedAt: row.reviewed_at,
    notes: row.notes,
  }));
}

export async function assignMaterial(
  userId: string,
  materialId: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO student_materials (user_id, material_id)
    VALUES (${userId}::uuid, ${materialId}::uuid)
    ON CONFLICT (user_id, material_id) DO NOTHING
  `;
}

export async function unassignMaterial(
  userId: string,
  materialId: string,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    DELETE FROM student_materials
    WHERE user_id = ${userId}::uuid AND material_id = ${materialId}::uuid
    RETURNING user_id
  `) as { user_id: string }[];
  return rows.length > 0;
}

export async function listMaterialsForStudent(userId: string): Promise<Material[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT m.id, m.title, m.description, m.url, m.locale, m.scheduled_at, m.meet_url,
           m.created_at, sm.assigned_at, sm.completion_status, sm.reviewed_at, sm.notes
    FROM materials m
    INNER JOIN student_materials sm ON sm.material_id = m.id
    WHERE sm.user_id = ${userId}::uuid
    ORDER BY m.scheduled_at ASC NULLS LAST, sm.assigned_at DESC
  `) as MaterialRow[];
  return rows.map(mapMaterial);
}

export async function setCompletionStatus(
  userId: string,
  materialId: string,
  status: CompletionStatus | null,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE student_materials
    SET
      completion_status = ${status},
      reviewed_at = ${status ? new Date().toISOString() : null}
    WHERE user_id = ${userId}::uuid AND material_id = ${materialId}::uuid
    RETURNING user_id
  `) as { user_id: string }[];
  return rows.length > 0;
}

export async function setStudentNotes(
  userId: string,
  materialId: string,
  notes: string,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE student_materials
    SET notes = ${notes}
    WHERE user_id = ${userId}::uuid AND material_id = ${materialId}::uuid
    RETURNING user_id
  `) as { user_id: string }[];
  return rows.length > 0;
}
