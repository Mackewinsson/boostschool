/** One weekly class slot (weekday 0 = Sunday … 6 = Saturday, JS Date.getDay). */
export type WeeklySlot = {
  weekday: number;
  timeLocal: string;
};

type SlotFields = {
  weekday: number | null;
  timeLocal: string | null;
  weekday2?: number | null;
  timeLocal2?: string | null;
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

export function weeklySlotsOf(schedule: SlotFields): WeeklySlot[] {
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
