import type { Locale } from "@/lib/locale";
import { getDb } from "@/lib/db/client";
import {
  assignMaterial,
  createMaterial,
  deleteMaterial,
  getClassScheduleByStudentId,
  listClassSchedules,
} from "./repository";
import {
  partsInZone,
  wallTimeInZoneToUtc,
} from "./schedule-time";
import type { Material, StudentClassSchedule } from "./types";

export {
  datetimeLocalInZoneToUtcIso,
  toDatetimeLocalValueInZone,
  wallTimeInZoneToUtc,
} from "./schedule-time";

export function hasFixedWeeklySlot(schedule: StudentClassSchedule): boolean {
  return (
    schedule.weekday != null &&
    Boolean(schedule.timeLocal) &&
    /^\d{2}:\d{2}$/.test(schedule.timeLocal ?? "")
  );
}

export function upcomingOccurrences(
  schedule: StudentClassSchedule,
  from: Date = new Date(),
): Date[] {
  if (!hasFixedWeeklySlot(schedule) || !schedule.timeLocal) {
    return [];
  }

  const [hourStr, minuteStr] = schedule.timeLocal.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return [];
  }

  const results: Date[] = [];
  const cursor = new Date(from.getTime());
  const maxDays = Math.max(1, schedule.horizonWeeks) * 7 + 1;

  for (let i = 0; i < maxDays && results.length < schedule.horizonWeeks; i += 1) {
    const day = new Date(cursor.getTime() + i * 24 * 60 * 60 * 1000);
    const parts = partsInZone(day, schedule.timezone);
    if (parts.weekday !== schedule.weekday) {
      continue;
    }
    const occurrence = wallTimeInZoneToUtc(
      parts.year,
      parts.month,
      parts.day,
      hour,
      minute,
      schedule.timezone,
    );
    if (occurrence.getTime() < from.getTime() - 60_000) {
      continue;
    }
    results.push(occurrence);
  }

  return results;
}

function formatTitleDate(date: Date, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "medium",
  }).format(date);
}

async function materialExistsForOccurrence(
  scheduleId: string,
  scheduledAtIso: string,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id FROM materials
    WHERE schedule_id = ${scheduleId}::uuid
      AND scheduled_at = ${scheduledAtIso}::timestamptz
    LIMIT 1
  `) as { id: string }[];
  return rows.length > 0;
}

type FutureSessionRow = {
  id: string;
  description: string | null;
  scheduled_at: string;
};

/**
 * Rebuild upcoming class slots for a student from their fixed weekly schedule.
 * Keeps homework text (oldest homework → next occurrence), deletes empty
 * leftovers (including one-offs), then fills the horizon.
 */
export async function realignFutureSessionsForSchedule(
  schedule: StudentClassSchedule,
  locale: Locale = "es",
): Promise<number> {
  if (!schedule.active || !hasFixedWeeklySlot(schedule) || !schedule.timeLocal) {
    return 0;
  }

  const [hourStr, minuteStr] = schedule.timeLocal.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return 0;
  }

  const sql = getDb();
  // Include weekly shells AND detached one-offs assigned to this student
  const future = (await sql`
    SELECT m.id, m.description, m.scheduled_at
    FROM materials m
    INNER JOIN student_materials sm ON sm.material_id = m.id
    WHERE sm.user_id = ${schedule.studentUserId}::uuid
      AND m.scheduled_at >= now()
    ORDER BY m.scheduled_at ASC
  `) as FutureSessionRow[];

  const withHomework = future.filter((row) => Boolean(row.description?.trim()));
  const empty = future.filter((row) => !row.description?.trim());
  const occurrences = upcomingOccurrences(schedule);

  // Detach this student's future rows and any leftover weekly shells for the
  // schedule so unique (schedule_id, scheduled_at) cannot block reattach.
  await sql`
    UPDATE materials
    SET schedule_id = NULL
    WHERE schedule_id = ${schedule.id}::uuid
      AND scheduled_at >= now()
  `;
  for (const row of future) {
    await sql`
      UPDATE materials
      SET schedule_id = NULL
      WHERE id = ${row.id}::uuid
    `;
  }

  // Empty future classes are regenerated cleanly from the schedule
  for (const row of empty) {
    await deleteMaterial(row.id);
  }

  const pairCount = Math.min(withHomework.length, occurrences.length);
  for (let i = 0; i < pairCount; i += 1) {
    const row = withHomework[i];
    const occurrence = occurrences[i];
    const scheduledAt = occurrence.toISOString();
    const dateLabel = formatTitleDate(occurrence, locale, schedule.timezone);
    const title = `${schedule.titleTemplate} — ${dateLabel}`;
    // Drop empty shells that still claim this slot (orphans / races)
    await sql`
      DELETE FROM materials
      WHERE schedule_id = ${schedule.id}::uuid
        AND scheduled_at = ${scheduledAt}::timestamptz
        AND id <> ${row.id}::uuid
        AND (description IS NULL OR btrim(description) = '')
    `;
    await sql`
      UPDATE materials
      SET
        schedule_id = ${schedule.id}::uuid,
        scheduled_at = ${scheduledAt}::timestamptz,
        meet_url = ${schedule.meetUrl},
        title = ${title}
      WHERE id = ${row.id}::uuid
    `;
  }

  // Extra homework beyond the horizon: keep text, snap clock to new time on same day
  for (let i = pairCount; i < withHomework.length; i += 1) {
    const row = withHomework[i];
    const parts = partsInZone(new Date(row.scheduled_at), schedule.timezone);
    const occurrence = wallTimeInZoneToUtc(
      parts.year,
      parts.month,
      parts.day,
      hour,
      minute,
      schedule.timezone,
    );
    const dateLabel = formatTitleDate(occurrence, locale, schedule.timezone);
    const title = `${schedule.titleTemplate} — ${dateLabel}`;
    await sql`
      UPDATE materials
      SET
        schedule_id = NULL,
        scheduled_at = ${occurrence.toISOString()}::timestamptz,
        meet_url = COALESCE(meet_url, ${schedule.meetUrl}),
        title = ${title}
      WHERE id = ${row.id}::uuid
    `;
  }

  return generateSessionsForSchedule(schedule, locale);
}

export async function generateSessionsForSchedule(
  schedule: StudentClassSchedule,
  locale: Locale = "es",
): Promise<number> {
  if (!schedule.active || !hasFixedWeeklySlot(schedule)) {
    return 0;
  }

  let created = 0;
  for (const occurrence of upcomingOccurrences(schedule)) {
    const scheduledAt = occurrence.toISOString();
    if (await materialExistsForOccurrence(schedule.id, scheduledAt)) {
      continue;
    }

    const dateLabel = formatTitleDate(occurrence, locale, schedule.timezone);
    const title = `${schedule.titleTemplate} — ${dateLabel}`;
    const material = await createMaterial({
      title,
      description: null,
      url: null,
      locale,
      scheduledAt,
      meetUrl: schedule.meetUrl,
      scheduleId: schedule.id,
    });
    await assignMaterial(schedule.studentUserId, material.id);
    created += 1;
  }
  return created;
}

export async function generateSessionsForAllSchedules(
  locale: Locale = "es",
): Promise<number> {
  const schedules = await listClassSchedules();
  let total = 0;
  for (const schedule of schedules) {
    total += await generateSessionsForSchedule(schedule, locale);
  }
  return total;
}

/** Fill missing upcoming weekly shells for one student (no realign). */
export async function ensureHorizonForStudent(
  studentUserId: string,
  locale: Locale = "es",
): Promise<number> {
  const schedule = await getClassScheduleByStudentId(studentUserId);
  if (!schedule) return 0;
  return generateSessionsForSchedule(schedule, locale);
}

/** Create one class session for a student (weekly or class-by-class). */
export async function createClassSessionForStudent(input: {
  studentUserId: string;
  scheduledAt: Date;
  locale?: Locale;
}): Promise<Material> {
  const locale = input.locale ?? "es";
  const schedule = await getClassScheduleByStudentId(input.studentUserId);
  const timezone = schedule?.timezone ?? "Europe/Warsaw";
  const titleTemplate = schedule?.titleTemplate ?? "Clase";
  const meetUrl = schedule?.meetUrl ?? null;
  const dateLabel = formatTitleDate(input.scheduledAt, locale, timezone);

  const material = await createMaterial({
    title: `${titleTemplate} — ${dateLabel}`,
    description: null,
    url: null,
    locale,
    scheduledAt: input.scheduledAt.toISOString(),
    meetUrl,
    // Manual sessions stay outside the weekly unique (schedule_id, scheduled_at) index
    scheduleId: null,
  });
  await assignMaterial(input.studentUserId, material.id);
  return material;
}
