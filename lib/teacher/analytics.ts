import { getDb } from "@/lib/db/client";
import type { CompletionStatus } from "@/lib/materials/types";
import { partsInZone, wallTimeInZoneToUtc } from "@/lib/materials/schedule-time";

export const ANALYTICS_TIMEZONE = "Europe/Warsaw";

export type AnalyticsHomeworkStatus =
  | "done"
  | "not_done"
  | "partial"
  | "pending"
  | "none";

export type AnalyticsClassRow = {
  materialId: string;
  studentId: string;
  studentName: string;
  scheduledAt: string;
  homeworkStatus: AnalyticsHomeworkStatus;
};

export type AnalyticsAttentionRow = {
  kind: "overdue" | "noUpcoming";
  studentId: string;
  studentName: string;
  scheduledAt: string | null;
};

export type TeacherAnalytics = {
  timeZone: string;
  weekStart: string;
  weekEnd: string;
  now: string;
  classesThisWeek: number;
  classesToday: number;
  homeworkDone: number;
  homeworkPending: number;
  homeworkNotDone: number;
  homeworkPartial: number;
  homeworkOverdue: number;
  studentsActive: number;
  studentsNoUpcoming: number;
  studentsNoParent: number;
  unreadContacts: number;
  leadsThisWeek: number;
  weekClasses: AnalyticsClassRow[];
  attention: AnalyticsAttentionRow[];
};

type WeekClassDbRow = {
  material_id: string;
  student_id: string;
  student_name: string;
  scheduled_at: string;
  description: string | null;
  completion_status: CompletionStatus | null;
};

type AttentionDbRow = {
  kind: "overdue" | "noUpcoming";
  student_id: string;
  student_name: string;
  scheduled_at: string | null;
};

type CountDbRow = {
  students_active: number;
  students_no_upcoming: number;
  students_no_parent: number;
  unread_contacts: number;
  leads_this_week: number;
  homework_overdue: number;
};

function toIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function addDaysCivil(year: number, month: number, day: number, delta: number) {
  const date = new Date(year, month - 1, day + delta);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function weekBounds(now: Date, timeZone: string) {
  const parts = partsInZone(now, timeZone);
  const daysFromMonday = parts.weekday === 0 ? 6 : parts.weekday - 1;
  const monday = addDaysCivil(parts.year, parts.month, parts.day, -daysFromMonday);
  const nextMonday = addDaysCivil(monday.year, monday.month, monday.day, 7);
  const todayEnd = addDaysCivil(parts.year, parts.month, parts.day, 1);

  return {
    weekStart: wallTimeInZoneToUtc(monday.year, monday.month, monday.day, 0, 0, timeZone),
    weekEnd: wallTimeInZoneToUtc(
      nextMonday.year,
      nextMonday.month,
      nextMonday.day,
      0,
      0,
      timeZone,
    ),
    todayStart: wallTimeInZoneToUtc(parts.year, parts.month, parts.day, 0, 0, timeZone),
    todayEnd: wallTimeInZoneToUtc(todayEnd.year, todayEnd.month, todayEnd.day, 0, 0, timeZone),
  };
}

export function homeworkStatusFromRow(
  description: string | null,
  completion: CompletionStatus | null,
): AnalyticsHomeworkStatus {
  if (!description?.trim()) return "none";
  if (completion === "done") return "done";
  if (completion === "not_done") return "not_done";
  if (completion === "partial") return "partial";
  return "pending";
}

export async function getTeacherAnalytics(
  now: Date = new Date(),
  timeZone: string = ANALYTICS_TIMEZONE,
): Promise<TeacherAnalytics> {
  const sql = getDb();
  const { weekStart, weekEnd, todayStart, todayEnd } = weekBounds(now, timeZone);
  const overdueFrom = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const weekStartIso = weekStart.toISOString();
  const weekEndIso = weekEnd.toISOString();
  const nowIso = now.toISOString();
  const overdueFromIso = overdueFrom.toISOString();

  const [weekRows, countRows, overdueRows, noUpcomingRows] = (await Promise.all([
    sql`
      SELECT
        m.id AS material_id,
        u.id AS student_id,
        u.name AS student_name,
        m.scheduled_at,
        m.description,
        sm.completion_status
      FROM materials m
      INNER JOIN student_materials sm ON sm.material_id = m.id
      INNER JOIN users u ON u.id = sm.user_id
      WHERE m.scheduled_at IS NOT NULL
        AND m.scheduled_at >= ${weekStartIso}
        AND m.scheduled_at < ${weekEndIso}
        AND u.role = 'student'
        AND u.active = true
      ORDER BY m.scheduled_at ASC, u.name ASC
    `,
    sql`
      SELECT
        (
          SELECT COUNT(*)::int
          FROM users
          WHERE role = 'student' AND active = true
        ) AS students_active,
        (
          SELECT COUNT(*)::int
          FROM users s
          WHERE s.role = 'student'
            AND s.active = true
            AND NOT EXISTS (
              SELECT 1
              FROM student_materials sm
              INNER JOIN materials m ON m.id = sm.material_id
              WHERE sm.user_id = s.id
                AND m.scheduled_at IS NOT NULL
                AND m.scheduled_at >= ${nowIso}
            )
        ) AS students_no_upcoming,
        (
          SELECT COUNT(*)::int
          FROM users s
          WHERE s.role = 'student'
            AND s.active = true
            AND NOT EXISTS (
              SELECT 1
              FROM parent_students ps
              WHERE ps.student_user_id = s.id
            )
        ) AS students_no_parent,
        (
          SELECT COUNT(*)::int
          FROM contact_messages
          WHERE read_at IS NULL
        ) AS unread_contacts,
        (
          SELECT COUNT(*)::int
          FROM leads
          WHERE created_at >= ${weekStartIso}
            AND created_at < ${weekEndIso}
        ) AS leads_this_week,
        (
          SELECT COUNT(*)::int
          FROM materials m
          INNER JOIN student_materials sm ON sm.material_id = m.id
          INNER JOIN users u ON u.id = sm.user_id
          WHERE m.scheduled_at IS NOT NULL
            AND m.scheduled_at >= ${overdueFromIso}
            AND m.scheduled_at < ${nowIso}
            AND NULLIF(BTRIM(m.description), '') IS NOT NULL
            AND (sm.completion_status IS NULL OR sm.completion_status <> 'done')
            AND u.role = 'student'
            AND u.active = true
        ) AS homework_overdue
    `,
    sql`
      SELECT
        'overdue'::text AS kind,
        u.id AS student_id,
        u.name AS student_name,
        m.scheduled_at
      FROM materials m
      INNER JOIN student_materials sm ON sm.material_id = m.id
      INNER JOIN users u ON u.id = sm.user_id
      WHERE m.scheduled_at IS NOT NULL
        AND m.scheduled_at >= ${overdueFromIso}
        AND m.scheduled_at < ${nowIso}
        AND NULLIF(BTRIM(m.description), '') IS NOT NULL
        AND (sm.completion_status IS NULL OR sm.completion_status <> 'done')
        AND u.role = 'student'
        AND u.active = true
      ORDER BY m.scheduled_at DESC
      LIMIT 8
    `,
    sql`
      SELECT
        'noUpcoming'::text AS kind,
        s.id AS student_id,
        s.name AS student_name,
        NULL::timestamptz AS scheduled_at
      FROM users s
      WHERE s.role = 'student'
        AND s.active = true
        AND NOT EXISTS (
          SELECT 1
          FROM student_materials sm
          INNER JOIN materials m ON m.id = sm.material_id
          WHERE sm.user_id = s.id
            AND m.scheduled_at IS NOT NULL
            AND m.scheduled_at >= ${nowIso}
        )
      ORDER BY s.name ASC
      LIMIT 8
    `,
  ])) as [WeekClassDbRow[], CountDbRow[], AttentionDbRow[], AttentionDbRow[]];

  const counts = countRows[0];
  const weekClasses = weekRows.map((row) => ({
    materialId: row.material_id,
    studentId: row.student_id,
    studentName: row.student_name,
    scheduledAt: toIso(row.scheduled_at) ?? "",
    homeworkStatus: homeworkStatusFromRow(row.description, row.completion_status),
  }));

  const todayStartMs = todayStart.getTime();
  const todayEndMs = todayEnd.getTime();
  const classesToday = weekClasses.filter((row) => {
    const time = new Date(row.scheduledAt).getTime();
    return time >= todayStartMs && time < todayEndMs;
  }).length;

  let homeworkDone = 0;
  let homeworkPending = 0;
  let homeworkNotDone = 0;
  let homeworkPartial = 0;
  for (const row of weekClasses) {
    if (row.homeworkStatus === "done") homeworkDone += 1;
    if (row.homeworkStatus === "pending") homeworkPending += 1;
    if (row.homeworkStatus === "not_done") homeworkNotDone += 1;
    if (row.homeworkStatus === "partial") homeworkPartial += 1;
  }

  return {
    timeZone,
    weekStart: weekStartIso,
    weekEnd: weekEndIso,
    now: nowIso,
    classesThisWeek: weekClasses.length,
    classesToday,
    homeworkDone,
    homeworkPending,
    homeworkNotDone,
    homeworkPartial,
    homeworkOverdue: Number(counts?.homework_overdue ?? 0),
    studentsActive: Number(counts?.students_active ?? 0),
    studentsNoUpcoming: Number(counts?.students_no_upcoming ?? 0),
    studentsNoParent: Number(counts?.students_no_parent ?? 0),
    unreadContacts: Number(counts?.unread_contacts ?? 0),
    leadsThisWeek: Number(counts?.leads_this_week ?? 0),
    weekClasses,
    attention: [...overdueRows, ...noUpcomingRows].map((row) => ({
      kind: row.kind,
      studentId: row.student_id,
      studentName: row.student_name,
      scheduledAt: toIso(row.scheduled_at),
    })),
  };
}
