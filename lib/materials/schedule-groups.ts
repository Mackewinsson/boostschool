import { partsInZone } from "./schedule-time";
import type { CompletionStatus, Material } from "./types";

const DEFAULT_TZ = "Europe/Warsaw";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function civilKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function civilKey(iso: string, timeZone: string): string {
  const parts = partsInZone(new Date(iso), timeZone);
  return civilKeyFromParts(parts.year, parts.month, parts.day);
}

function sessionTime(material: Material): number {
  return new Date(material.scheduledAt ?? 0).getTime();
}

function byScheduledAt(a: Material, b: Material): number {
  return sessionTime(a) - sessionTime(b);
}

/**
 * Dated sessions in chronological order (invalid dates omitted).
 */
export function datedSessionsChronological(sessions: Material[]): Material[] {
  return sessions
    .filter((session) => {
      if (!session.scheduledAt) return false;
      const time = new Date(session.scheduledAt).getTime();
      return !Number.isNaN(time);
    })
    .slice()
    .sort(byScheduledAt);
}

/**
 * Maps a session id → the previous dated class (the one whose
 * “for the next class” homework belongs on this class).
 */
export function previousSessionById(
  sessions: Material[],
): Map<string, Material> {
  const dated = datedSessionsChronological(sessions);
  const map = new Map<string, Material>();
  for (let index = 1; index < dated.length; index += 1) {
    const current = dated[index];
    const previous = dated[index - 1];
    if (current && previous) {
      map.set(current.id, previous);
    }
  }
  return map;
}

export function homeworkFromPreviousClass(
  previous: Material | undefined,
): string {
  return (previous?.description ?? "").trim();
}

/**
 * Group dated classes for the table.
 * “Today” (civil day in `timeZone`) stays in the top section even after the
 * class time has passed, so clicking the calendar does not bury it in Past.
 */
export function groupMaterialsBySchedule(
  materials: Material[],
  options?: { timeZone?: string; now?: Date },
) {
  const timeZone = options?.timeZone ?? DEFAULT_TZ;
  const now = options?.now ?? new Date();
  const nowMs = now.getTime();
  const todayParts = partsInZone(now, timeZone);
  const todayKey = civilKeyFromParts(
    todayParts.year,
    todayParts.month,
    todayParts.day,
  );

  const today: Material[] = [];
  const upcoming: Material[] = [];
  const past: Material[] = [];
  const undated: Material[] = [];

  for (const material of materials) {
    if (!material.scheduledAt) {
      undated.push(material);
      continue;
    }
    const time = new Date(material.scheduledAt).getTime();
    if (Number.isNaN(time)) {
      undated.push(material);
      continue;
    }
    const dayKey = civilKey(material.scheduledAt, timeZone);
    if (dayKey === todayKey) {
      today.push(material);
    } else if (time >= nowMs) {
      upcoming.push(material);
    } else {
      past.push(material);
    }
  }

  today.sort(byScheduledAt);
  upcoming.sort(byScheduledAt);
  past.sort((a, b) => byScheduledAt(b, a));

  return { today, upcoming, past, undated };
}

/** Split assigned materials into dated class sessions vs undated extras. */
export function splitSessionsAndExtras(materials: Material[]) {
  const sessions: Material[] = [];
  const extras: Material[] = [];

  for (const material of materials) {
    if (material.scheduledAt) {
      sessions.push(material);
    } else {
      extras.push(material);
    }
  }

  sessions.sort((a, b) => {
    const aTime = new Date(a.scheduledAt ?? 0).getTime();
    const bTime = new Date(b.scheduledAt ?? 0).getTime();
    return aTime - bTime;
  });

  return { sessions, extras };
}

export function formatScheduledAt(
  value: string | null | undefined,
  locale: string,
  timeZone = "Europe/Warsaw",
) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
  }).format(new Date(value));
}

export function completionStatusLabel(
  status: CompletionStatus | null | undefined,
  labels: {
    pending: string;
    done: string;
    notDone: string;
    partial: string;
  },
) {
  if (status === "done") return labels.done;
  if (status === "not_done") return labels.notDone;
  if (status === "partial") return labels.partial;
  return labels.pending;
}

/** @deprecated Prefer toDatetimeLocalValueInZone from schedule-time for schedule TZ. */
export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
