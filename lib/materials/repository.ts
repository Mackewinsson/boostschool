import type { Locale } from "@/lib/locale";
import { getDb } from "@/lib/db/client";
import type {
  Assignment,
  CompletionStatus,
  Material,
  StudentClassSchedule,
} from "./types";

type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  locale: string;
  scheduled_at: string | null;
  meet_url: string | null;
  schedule_id?: string | null;
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

type ScheduleRow = {
  id: string;
  student_user_id: string;
  weekday: number | null;
  time_local: string | null;
  timezone: string;
  meet_url: string | null;
  title_template: string;
  horizon_weeks: number;
  active: boolean;
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
    scheduleId: row.schedule_id ?? null,
    createdAt: row.created_at,
    ...(row.assigned_at !== undefined ? { assignedAt: row.assigned_at } : {}),
    ...(row.completion_status !== undefined
      ? { completionStatus: row.completion_status }
      : {}),
    ...(row.reviewed_at !== undefined ? { reviewedAt: row.reviewed_at } : {}),
    ...(row.notes !== undefined ? { notes: row.notes } : {}),
  };
}

function mapSchedule(row: ScheduleRow): StudentClassSchedule {
  const timeLocal =
    row.time_local == null
      ? null
      : typeof row.time_local === "string"
        ? row.time_local.slice(0, 5)
        : String(row.time_local).slice(0, 5);
  return {
    id: row.id,
    studentUserId: row.student_user_id,
    weekday: row.weekday == null ? null : Number(row.weekday),
    timeLocal,
    timezone: row.timezone,
    meetUrl: row.meet_url,
    titleTemplate: row.title_template,
    horizonWeeks: Number(row.horizon_weeks),
    active: Boolean(row.active),
  };
}

export async function listMaterials(): Promise<Material[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, title, description, url, locale, scheduled_at, meet_url, schedule_id, created_at
    FROM materials
    ORDER BY scheduled_at ASC NULLS LAST, created_at DESC
  `) as MaterialRow[];
  return rows.map(mapMaterial);
}

export async function getMaterial(id: string): Promise<Material | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, title, description, url, locale, scheduled_at, meet_url, schedule_id, created_at
    FROM materials
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as MaterialRow[];
  return rows[0] ? mapMaterial(rows[0]) : null;
}

export async function patchMaterialClassDetails(
  id: string,
  input: {
    scheduledAt: string | null;
    meetUrl: string | null;
  },
): Promise<Material | null> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE materials
    SET
      scheduled_at = ${input.scheduledAt},
      meet_url = ${input.meetUrl}
    WHERE id = ${id}::uuid
    RETURNING id, title, description, url, locale, scheduled_at, meet_url, schedule_id, created_at
  `) as MaterialRow[];
  return rows[0] ? mapMaterial(rows[0]) : null;
}

export async function createMaterial(input: {
  title: string;
  description?: string | null;
  url?: string | null;
  locale: Locale;
  scheduledAt?: string | null;
  meetUrl?: string | null;
  scheduleId?: string | null;
}): Promise<Material> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO materials (title, description, url, locale, scheduled_at, meet_url, schedule_id)
    VALUES (
      ${input.title},
      ${input.description ?? null},
      ${input.url ?? null},
      ${input.locale},
      ${input.scheduledAt ?? null},
      ${input.meetUrl ?? null},
      ${input.scheduleId ?? null}
    )
    RETURNING id, title, description, url, locale, scheduled_at, meet_url, schedule_id, created_at
  `) as MaterialRow[];
  return mapMaterial(rows[0]);
}

export async function updateMaterial(
  id: string,
  input: {
    title: string;
    description?: string | null;
    url?: string | null;
    scheduledAt?: string | null;
    meetUrl?: string | null;
  },
): Promise<Material | null> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE materials
    SET
      title = ${input.title},
      description = ${input.description ?? null},
      url = ${input.url ?? null},
      scheduled_at = ${input.scheduledAt ?? null},
      meet_url = ${input.meetUrl ?? null}
    WHERE id = ${id}::uuid
    RETURNING id, title, description, url, locale, scheduled_at, meet_url, schedule_id, created_at
  `) as MaterialRow[];
  return rows[0] ? mapMaterial(rows[0]) : null;
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
           m.schedule_id, m.created_at, sm.assigned_at, sm.completion_status, sm.reviewed_at, sm.notes
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

export async function listClassSchedules(): Promise<StudentClassSchedule[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, student_user_id, weekday, time_local, timezone, meet_url,
           title_template, horizon_weeks, active
    FROM student_class_schedules
    ORDER BY created_at ASC
  `) as ScheduleRow[];
  return rows.map(mapSchedule);
}

export async function getClassScheduleByStudentId(
  studentUserId: string,
): Promise<StudentClassSchedule | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, student_user_id, weekday, time_local, timezone, meet_url,
           title_template, horizon_weeks, active
    FROM student_class_schedules
    WHERE student_user_id = ${studentUserId}::uuid
    LIMIT 1
  `) as ScheduleRow[];
  return rows[0] ? mapSchedule(rows[0]) : null;
}

export async function upsertClassSchedule(input: {
  studentUserId: string;
  weekday?: number | null;
  timeLocal?: string | null;
  timezone?: string;
  meetUrl?: string | null;
  titleTemplate?: string;
  horizonWeeks?: number;
  active?: boolean;
}): Promise<StudentClassSchedule> {
  const sql = getDb();
  const timezone = input.timezone?.trim() || "Europe/Warsaw";
  const titleTemplate = input.titleTemplate?.trim() || "Clase";
  const horizonWeeks = input.horizonWeeks ?? 6;
  const active = input.active ?? true;
  const meetUrl = input.meetUrl?.trim() || null;
  const weekday = input.weekday ?? null;
  const timeLocal = input.timeLocal?.trim() || null;

  const rows = (await sql`
    INSERT INTO student_class_schedules (
      student_user_id, weekday, time_local, timezone, meet_url,
      title_template, horizon_weeks, active, updated_at
    )
    VALUES (
      ${input.studentUserId}::uuid,
      ${weekday},
      ${timeLocal}::time,
      ${timezone},
      ${meetUrl},
      ${titleTemplate},
      ${horizonWeeks},
      ${active},
      now()
    )
    ON CONFLICT (student_user_id) DO UPDATE SET
      weekday = EXCLUDED.weekday,
      time_local = EXCLUDED.time_local,
      timezone = EXCLUDED.timezone,
      meet_url = EXCLUDED.meet_url,
      title_template = EXCLUDED.title_template,
      horizon_weeks = EXCLUDED.horizon_weeks,
      active = EXCLUDED.active,
      updated_at = now()
    RETURNING id, student_user_id, weekday, time_local, timezone, meet_url,
              title_template, horizon_weeks, active
  `) as ScheduleRow[];
  return mapSchedule(rows[0]);
}

/** Copy the schedule Meet link onto all sessions generated from that schedule. */
export async function syncMeetUrlForSchedule(
  scheduleId: string,
  meetUrl: string | null,
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE materials
    SET meet_url = ${meetUrl}
    WHERE schedule_id = ${scheduleId}::uuid
  `;
}
