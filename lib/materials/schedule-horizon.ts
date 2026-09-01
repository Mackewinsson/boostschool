export const SCHEDULE_HORIZON_OPTIONS = [6, 8, 12, 16] as const;

export type ScheduleHorizonWeeks = (typeof SCHEDULE_HORIZON_OPTIONS)[number];

/** Default for new weekly plans: about 3 months of class shells. */
export const DEFAULT_SCHEDULE_HORIZON_WEEKS: ScheduleHorizonWeeks = 12;

export function parseHorizonWeeks(
  value: unknown,
  fallback: ScheduleHorizonWeeks = DEFAULT_SCHEDULE_HORIZON_WEEKS,
): ScheduleHorizonWeeks {
  const weeks = Number(value);
  if (
    weeks === 6 ||
    weeks === 8 ||
    weeks === 12 ||
    weeks === 16
  ) {
    return weeks;
  }
  return fallback;
}

export function horizonMonths(weeks: number): number | null {
  if (weeks < 12) return null;
  return Math.round(weeks / 4);
}
