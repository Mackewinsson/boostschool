import type { Material } from "./types";
import { partsInZone } from "./schedule-time";

export type CivilMonth = {
  year: number;
  month: number;
};

export type CalendarDay = {
  isoDate: string;
  year: number;
  month: number;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarSessionChip = {
  id: string;
  timeLabel: string;
  iso: string;
  isPast: boolean;
  isRescheduled: boolean;
};

const DEFAULT_TZ = "Europe/Warsaw";

export function sessionRowDomId(sessionId: string): string {
  return `session-${sessionId}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function civilDateKeyFromParts(
  year: number,
  month: number,
  day: number,
): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function civilDateKey(iso: string, timeZone: string = DEFAULT_TZ): string {
  const parts = partsInZone(new Date(iso), timeZone);
  return civilDateKeyFromParts(parts.year, parts.month, parts.day);
}

export function addMonths(year: number, month: number, delta: number): CivilMonth {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function timeLabelInZone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

/** Monday-first weekday labels in the UI locale. */
export function weekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2024-01-01 is a Monday.
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(2024, 0, 1 + index)),
  );
}

export function monthTitle(year: number, month: number, locale: string): string {
  const label = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function weekdayMondayFirst(year: number, month: number, day: number): number {
  const jsWeekday = new Date(year, month - 1, day).getDay();
  return jsWeekday === 0 ? 6 : jsWeekday - 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function buildMonthGrid(
  year: number,
  month: number,
  timeZone: string = DEFAULT_TZ,
  now: Date = new Date(),
): CalendarDay[] {
  const today = partsInZone(now, timeZone);
  const todayKey = civilDateKeyFromParts(today.year, today.month, today.day);
  const leading = weekdayMondayFirst(year, month, 1);
  const currentCount = daysInMonth(year, month);
  const prev = addMonths(year, month, -1);
  const prevCount = daysInMonth(prev.year, prev.month);

  const cells: CalendarDay[] = [];

  for (let i = leading - 1; i >= 0; i -= 1) {
    cells.push(
      makeDay(prev.year, prev.month, prevCount - i, false, todayKey),
    );
  }

  for (let day = 1; day <= currentCount; day += 1) {
    cells.push(makeDay(year, month, day, true, todayKey));
  }

  const next = addMonths(year, month, 1);
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push(makeDay(next.year, next.month, nextDay, false, todayKey));
    nextDay += 1;
  }

  return cells;
}

function makeDay(
  year: number,
  month: number,
  day: number,
  inCurrentMonth: boolean,
  todayKey: string,
): CalendarDay {
  const isoDate = civilDateKeyFromParts(year, month, day);
  return {
    isoDate,
    year,
    month,
    day,
    inCurrentMonth,
    isToday: isoDate === todayKey,
  };
}

export function sessionsByDateKey(
  sessions: Material[],
  timeZone: string = DEFAULT_TZ,
  now: Date = new Date(),
): Map<string, CalendarSessionChip[]> {
  const grouped = new Map<string, CalendarSessionChip[]>();
  const nowMs = now.getTime();

  for (const session of sessions) {
    if (!session.scheduledAt) continue;
    const date = new Date(session.scheduledAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = civilDateKey(session.scheduledAt, timeZone);
    const list = grouped.get(key) ?? [];
    list.push({
      id: session.id,
      timeLabel: timeLabelInZone(session.scheduledAt, timeZone),
      iso: session.scheduledAt,
      isPast: date.getTime() < nowMs,
      isRescheduled: Boolean(session.originalScheduledAt),
    });
    grouped.set(key, list);
  }

  for (const list of grouped.values()) {
    list.sort((a, b) => a.iso.localeCompare(b.iso));
  }

  return grouped;
}

/** Month of the next upcoming class, else current month in `timeZone`. */
export function initialVisibleMonth(
  sessions: Material[],
  timeZone: string = DEFAULT_TZ,
  now: Date = new Date(),
): CivilMonth {
  const today = partsInZone(now, timeZone);
  const upcoming = sessions
    .filter((session) => {
      if (!session.scheduledAt) return false;
      const date = new Date(session.scheduledAt);
      return !Number.isNaN(date.getTime()) && date.getTime() >= now.getTime();
    })
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));

  const target = upcoming[0];
  if (!target?.scheduledAt) {
    return { year: today.year, month: today.month };
  }

  const parts = partsInZone(new Date(target.scheduledAt), timeZone);
  return { year: parts.year, month: parts.month };
}

export function chunkWeeks<T>(days: T[]): T[][] {
  const weeks: T[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
}
