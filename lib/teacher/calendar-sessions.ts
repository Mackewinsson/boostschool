import { getDb } from "@/lib/db/client";
import { addMonths } from "@/lib/materials/class-calendar";
import { partsInZone, wallTimeInZoneToUtc } from "@/lib/materials/schedule-time";
import { ANALYTICS_TIMEZONE } from "@/lib/teacher/analytics";

export type TeacherCalendarSession = {
  id: string;
  scheduledAt: string;
  originalScheduledAt: string | null;
  studentId: string;
  studentLabel: string;
};

type CalendarSessionDbRow = {
  material_id: string;
  scheduled_at: string;
  original_scheduled_at: string | null;
  student_id: string;
  student_name: string;
};

function toIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

export function studentShortLabel(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

/** Visible month window: two months back through four months ahead (inclusive). */
export function teacherCalendarBounds(
  now: Date = new Date(),
  timeZone: string = ANALYTICS_TIMEZONE,
) {
  const today = partsInZone(now, timeZone);
  const startMonth = addMonths(today.year, today.month, -2);
  const endMonth = addMonths(today.year, today.month, 4);
  const endMonthDayCount = new Date(endMonth.year, endMonth.month, 0).getDate();

  return {
    from: wallTimeInZoneToUtc(startMonth.year, startMonth.month, 1, 0, 0, timeZone),
    to: wallTimeInZoneToUtc(
      endMonth.year,
      endMonth.month,
      endMonthDayCount + 1,
      0,
      0,
      timeZone,
    ),
  };
}

export async function getTeacherCalendarSessions(
  now: Date = new Date(),
  timeZone: string = ANALYTICS_TIMEZONE,
): Promise<TeacherCalendarSession[]> {
  const sql = getDb();
  const { from, to } = teacherCalendarBounds(now, timeZone);

  const rows = (await sql`
    SELECT
      m.id AS material_id,
      m.scheduled_at,
      m.original_scheduled_at,
      u.id AS student_id,
      u.name AS student_name
    FROM materials m
    INNER JOIN student_materials sm ON sm.material_id = m.id
    INNER JOIN users u ON u.id = sm.user_id
    WHERE m.scheduled_at IS NOT NULL
      AND m.scheduled_at >= ${from.toISOString()}
      AND m.scheduled_at < ${to.toISOString()}
      AND u.role = 'student'
      AND u.active = true
    ORDER BY m.scheduled_at ASC, u.name ASC
  `) as CalendarSessionDbRow[];

  return rows.map((row) => ({
    id: row.material_id,
    scheduledAt: toIso(row.scheduled_at) ?? "",
    originalScheduledAt: toIso(row.original_scheduled_at),
    studentId: row.student_id,
    studentLabel: studentShortLabel(row.student_name),
  }));
}