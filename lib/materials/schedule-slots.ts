/** One weekly class slot (weekday 0 = Sunday … 6 = Saturday, JS Date.getDay). */
export type WeeklySlot = {
  weekday: number;
  timeLocal: string;
};

export const MAX_WEEKLY_SLOTS = 7;

export const SCHEDULE_ERROR = {
  duplicateSlot: "duplicate_slot",
  incompleteSlot: "incomplete_slot",
  invalidSlot: "invalid_slot",
  tooManySlots: "too_many_slots",
  sessionTimeConflict: "session_time_conflict",
} as const;

export type ScheduleErrorCode =
  (typeof SCHEDULE_ERROR)[keyof typeof SCHEDULE_ERROR];

type SlotFields = {
  weekday: number | null;
  timeLocal: string | null;
  weekday2?: number | null;
  timeLocal2?: string | null;
  slots?: WeeklySlot[] | null;
};

export type SlotParseResult =
  | { ok: true; slot: WeeklySlot | null }
  | { ok: false; error: "incomplete" | "invalid" };

/** Normalize a Postgres TIME / string to `HH:MM`, or null. */
export function formatTimeLocal(value: unknown): string | null {
  if (value == null || value === "") return null;
  const match = /^(\d{2}:\d{2})/.exec(String(value).trim());
  return match ? match[1] : null;
}

export function slotKey(slot: WeeklySlot): string {
  return `${slot.weekday}:${slot.timeLocal}`;
}

export function parseOptionalSlot(
  weekdayRaw: unknown,
  timeRaw: unknown,
): SlotParseResult {
  const hasWeekday =
    weekdayRaw !== undefined && weekdayRaw !== null && weekdayRaw !== "";
  const timeLocal = typeof timeRaw === "string" ? timeRaw.trim() : "";
  const hasTime = Boolean(timeLocal);

  if (!hasWeekday && !hasTime) {
    return { ok: true, slot: null };
  }
  if (!hasWeekday || !hasTime) {
    return { ok: false, error: "incomplete" };
  }

  const weekday = Number(weekdayRaw);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    return { ok: false, error: "invalid" };
  }
  const normalized = formatTimeLocal(timeLocal);
  if (!normalized) {
    return { ok: false, error: "invalid" };
  }
  return { ok: true, slot: { weekday, timeLocal: normalized } };
}

export function dedupeWeeklySlots(slots: WeeklySlot[]): WeeklySlot[] {
  const seen = new Set<string>();
  const result: WeeklySlot[] = [];
  for (const slot of slots) {
    const parsed = parseOptionalSlot(slot.weekday, slot.timeLocal);
    if (!parsed.ok || !parsed.slot) continue;
    const key = slotKey(parsed.slot);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(parsed.slot);
  }
  return result;
}

export function parseWeeklySlotsJson(value: unknown): WeeklySlot[] {
  if (value == null || value === "") return [];
  try {
    const raw = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(raw)) return [];
    return dedupeWeeklySlots(
      raw.map((item: { weekday?: unknown; timeLocal?: unknown; time_local?: unknown }) => ({
        weekday: Number(item?.weekday),
        timeLocal: String(item?.timeLocal ?? item?.time_local ?? ""),
      })),
    );
  } catch {
    return [];
  }
}

export function weeklySlotsOf(schedule: SlotFields): WeeklySlot[] {
  if (Array.isArray(schedule.slots) && schedule.slots.length > 0) {
    return dedupeWeeklySlots(schedule.slots);
  }
  const slots: WeeklySlot[] = [];
  const first = formatTimeLocal(schedule.timeLocal);
  if (schedule.weekday != null && first) {
    slots.push({ weekday: schedule.weekday, timeLocal: first });
  }
  const second = formatTimeLocal(schedule.timeLocal2);
  if (schedule.weekday2 != null && second) {
    const next: WeeklySlot = { weekday: schedule.weekday2, timeLocal: second };
    if (slots.every((slot) => slotKey(slot) !== slotKey(next))) {
      slots.push(next);
    }
  }
  return slots;
}

export function hasFixedWeeklySlot(schedule: SlotFields): boolean {
  return weeklySlotsOf(schedule).length > 0;
}

export function parseClock(
  timeLocal: string,
): { hour: number; minute: number } | null {
  const [hourStr, minuteStr] = timeLocal.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { hour, minute };
}

/** Prefer a slot on the same weekday; if several, the closest clock time. */
export function pickSlotForDay(
  slots: WeeklySlot[],
  weekday: number,
  hour: number,
  minute: number,
): WeeklySlot {
  const pool = slots.filter((slot) => slot.weekday === weekday);
  const candidates = pool.length > 0 ? pool : slots;
  const target = hour * 60 + minute;
  return candidates.reduce((best, slot) => {
    const clock = parseClock(slot.timeLocal);
    const bestClock = parseClock(best.timeLocal);
    if (!clock) return best;
    if (!bestClock) return slot;
    const diff = Math.abs(clock.hour * 60 + clock.minute - target);
    const bestDiff = Math.abs(bestClock.hour * 60 + bestClock.minute - target);
    return diff < bestDiff ? slot : best;
  });
}

export function nextDefaultSlot(slots: WeeklySlot[]): WeeklySlot {
  const usedDays = new Set(slots.map((slot) => slot.weekday));
  const timeLocal = slots[0]?.timeLocal ?? "18:00";
  for (const day of [4, 2, 3, 5, 1, 6, 0]) {
    if (!usedDays.has(day)) {
      return { weekday: day, timeLocal };
    }
  }
  return { weekday: ((slots[0]?.weekday ?? 0) + 1) % 7, timeLocal };
}

export function sameInstant(left: string | null | undefined, right: string | null | undefined): boolean {
  if (!left || !right) return left === right;
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) return left === right;
  return leftTime === rightTime;
}

/** Keep the first original occurrence; clear when the class is moved back there. */
export function nextOriginalScheduledAt(
  currentOriginal: string | null | undefined,
  previousIso: string | null | undefined,
  nextIso: string | null | undefined,
): string | null {
  if (!previousIso || !nextIso || sameInstant(previousIso, nextIso)) {
    return currentOriginal ?? null;
  }
  const original = currentOriginal ?? previousIso;
  if (sameInstant(nextIso, original)) {
    return null;
  }
  return original;
}

export function isUniqueViolation(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /duplicate key|unique constraint|23505/i.test(message);
}
