"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import {
  addMonths,
  buildMonthGrid,
  chunkWeeks,
  initialVisibleMonth,
  monthTitle,
  sessionRowDomId,
  sessionsByDateKey,
  weekdayLabels,
  type CalendarSessionSource,
} from "@/lib/materials/class-calendar";
import { partsInZone } from "@/lib/materials/schedule-time";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";

const DEFAULT_TZ = "Europe/Warsaw";
const MAX_CHIPS = 3;

type ClassMonthCalendarProps = {
  sessions: CalendarSessionSource[];
  locale: Locale;
  timeZone?: string;
  variant?: "student" | "allStudents";
  copy: Pick<
    StudentContent["teacher"],
    | "calendarTitle"
    | "calendarHint"
    | "calendarPrevMonth"
    | "calendarNextMonth"
    | "calendarToday"
    | "calendarEmptyMonth"
    | "calendarMore"
    | "calendarSessionAria"
    | "calendarSessionOverviewAria"
  >;
};

function scrollToSession(sessionId: string) {
  const row = document.getElementById(sessionRowDomId(sessionId));
  if (!row) return;
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  row.setAttribute("data-calendar-focus", "true");
  window.setTimeout(() => {
    row.removeAttribute("data-calendar-focus");
  }, 1600);
}

function chipLabel(chip: { timeLabel: string; studentLabel?: string }): string {
  if (chip.studentLabel) {
    return `${chip.timeLabel} · ${chip.studentLabel}`;
  }
  return chip.timeLabel;
}

function chipClassName(
  chip: { isRescheduled: boolean; isPast: boolean },
  interactive: boolean,
): string {
  const base =
    "block w-full truncate rounded-md px-1 py-0.5 text-left text-[11px] font-semibold tabular-nums transition sm:px-1.5";
  const tone = chip.isRescheduled
    ? chip.isPast
      ? "bg-warn/10 text-warn/80 hover:bg-warn/20"
      : "bg-warn/20 text-warn hover:bg-warn/30"
    : chip.isPast
      ? "bg-border/80 text-fg-muted hover:bg-border"
      : "bg-accent/15 text-accent hover:bg-accent/25";
  return interactive ? `${base} ${tone}` : base;
}

export function ClassMonthCalendar({
  sessions,
  locale,
  timeZone = DEFAULT_TZ,
  variant = "student",
  copy,
}: ClassMonthCalendarProps) {
  const isOverview = variant === "allStudents";
  const [visible, setVisible] = useState(() =>
    initialVisibleMonth(sessions, timeZone),
  );

  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const days = useMemo(
    () => buildMonthGrid(visible.year, visible.month, timeZone),
    [visible.year, visible.month, timeZone],
  );
  const byDate = useMemo(
    () => sessionsByDateKey(sessions, timeZone),
    [sessions, timeZone],
  );

  const monthHasClasses = days.some(
    (day) => day.inCurrentMonth && (byDate.get(day.isoDate)?.length ?? 0) > 0,
  );

  function goToToday() {
    const today = partsInZone(new Date(), timeZone);
    setVisible({ year: today.year, month: today.month });
  }

  function sessionAriaLabel(chip: {
    timeLabel: string;
    studentLabel?: string;
  }): string {
    if (isOverview && chip.studentLabel) {
      return copy.calendarSessionOverviewAria
        .replace("{time}", chip.timeLabel)
        .replace("{student}", chip.studentLabel);
    }
    return copy.calendarSessionAria.replace("{time}", chip.timeLabel);
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      data-testid="class-month-calendar"
      data-calendar-variant={variant}
      aria-labelledby="class-month-calendar-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="class-month-calendar-title"
            className="text-xl font-bold text-fg"
          >
            {copy.calendarTitle}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">{copy.calendarHint}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-[9.5rem] text-sm font-semibold text-fg sm:text-right">
            {monthTitle(visible.year, visible.month, locale)}
          </p>
          <div className="flex items-center rounded-full border border-border bg-canvas p-0.5">
            <button
              type="button"
              onClick={() => setVisible((current) => addMonths(current.year, current.month, -1))}
              className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition hover:bg-accent/10 hover:text-accent"
              aria-label={copy.calendarPrevMonth}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:bg-accent/10 hover:text-accent"
            >
              {copy.calendarToday}
            </button>
            <button
              type="button"
              onClick={() => setVisible((current) => addMonths(current.year, current.month, 1))}
              className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition hover:bg-accent/10 hover:text-accent"
              aria-label={copy.calendarNextMonth}
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-border"
        role="grid"
        aria-label={monthTitle(visible.year, visible.month, locale)}
      >
        <div role="row" className="contents">
          {weekdays.map((label) => (
            <div
              key={label}
              role="columnheader"
              className="bg-canvas-up px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-fg-muted sm:text-xs"
            >
              {label}
            </div>
          ))}
        </div>

        {chunkWeeks(days).map((week) => (
          <div key={week[0]?.isoDate} role="row" className="contents">
            {week.map((day) => {
              const chips = byDate.get(day.isoDate) ?? [];
              const visibleChips = chips.slice(0, MAX_CHIPS);
              const extra = chips.length - visibleChips.length;
              const hasClass = chips.length > 0;
              const cellBg = day.isToday
                ? "bg-accent/10 ring-1 ring-inset ring-accent/40"
                : hasClass && day.inCurrentMonth
                  ? "bg-canvas-up"
                  : "bg-card";

              return (
                <div
                  key={day.isoDate}
                  role="gridcell"
                  aria-current={day.isToday ? "date" : undefined}
                  data-date={day.isoDate}
                  className={`min-h-[4.75rem] px-1 py-1.5 sm:min-h-[6.25rem] sm:px-1.5 sm:py-2 ${cellBg} ${
                    day.inCurrentMonth ? "" : "opacity-40"
                  }`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums sm:size-7 sm:text-sm ${
                      day.isToday
                        ? "bg-accent text-canvas"
                        : hasClass
                          ? "text-fg"
                          : "text-fg-muted"
                    }`}
                  >
                    {day.day}
                  </span>
                  {hasClass ? (
                    <ul className="mt-1 space-y-0.5">
                      {visibleChips.map((chip) => (
                        <li key={`${chip.id}-${chip.studentId ?? "student"}`}>
                          {isOverview && chip.studentId ? (
                            <Link
                              href={`${teacherPaths.home}?student=${chip.studentId}#${sessionRowDomId(chip.id)}`}
                              data-testid="calendar-session-chip"
                              data-session-id={chip.id}
                              data-student-id={chip.studentId}
                              data-rescheduled={chip.isRescheduled ? "true" : "false"}
                              aria-label={sessionAriaLabel(chip)}
                              className={chipClassName(chip, true)}
                            >
                              {chipLabel(chip)}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              data-testid="calendar-session-chip"
                              data-session-id={chip.id}
                              data-rescheduled={chip.isRescheduled ? "true" : "false"}
                              onClick={() => scrollToSession(chip.id)}
                              aria-label={sessionAriaLabel(chip)}
                              className={chipClassName(chip, true)}
                            >
                              {chipLabel(chip)}
                            </button>
                          )}
                        </li>
                      ))}
                      {extra > 0 ? (
                        <li className="px-1 text-[10px] font-medium text-fg-muted sm:px-1.5">
                          {copy.calendarMore.replace("{count}", String(extra))}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {!monthHasClasses ? (
        <p className="mt-4 text-sm text-fg-muted">{copy.calendarEmptyMonth}</p>
      ) : null}
    </section>
  );
}
