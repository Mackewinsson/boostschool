"use client";

import { useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import {
  DEFAULT_SCHEDULE_HORIZON_WEEKS,
  SCHEDULE_HORIZON_OPTIONS,
  horizonMonths,
  parseHorizonWeeks,
} from "@/lib/materials/schedule-horizon";
import type { StudentClassSchedule } from "@/lib/materials/types";

type StudentSchedulePanelProps = {
  studentId: string;
  schedule?: StudentClassSchedule;
  saving: boolean;
  copy: StudentContent["teacher"];
  onSave: (input: {
    studentUserId: string;
    weekday: number | null;
    timeLocal: string | null;
    meetUrl: string;
    horizonWeeks: number;
    active: boolean;
  }) => Promise<void>;
};

const WEEKDAYS = [
  "weekdaySunday",
  "weekdayMonday",
  "weekdayTuesday",
  "weekdayWednesday",
  "weekdayThursday",
  "weekdayFriday",
  "weekdaySaturday",
] as const;

export function StudentSchedulePanel({
  studentId,
  schedule,
  saving,
  copy,
  onSave,
}: StudentSchedulePanelProps) {
  const initialWeekly =
    schedule?.weekday != null && Boolean(schedule.timeLocal);
  const [mode, setMode] = useState<"weekly" | "adhoc">(
    initialWeekly ? "weekly" : "adhoc",
  );

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-fg">{copy.scheduleSectionTitle}</h2>
      <p className="mt-2 text-sm text-fg-muted">{copy.scheduleSectionHint}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("weekly")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            mode === "weekly"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border text-fg-muted hover:border-accent/30"
          }`}
        >
          {copy.scheduleModeWeekly}
        </button>
        <button
          type="button"
          onClick={() => setMode("adhoc")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            mode === "adhoc"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border text-fg-muted hover:border-accent/30"
          }`}
        >
          {copy.scheduleModeAdhoc}
        </button>
      </div>

      <form
        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const activeInput = form.querySelector<HTMLInputElement>('input[name="active"]');
          void onSave({
            studentUserId: studentId,
            weekday: mode === "weekly" ? Number(data.get("weekday")) : null,
            timeLocal: mode === "weekly" ? String(data.get("timeLocal") ?? "") : null,
            meetUrl: String(data.get("meetUrl") ?? ""),
            horizonWeeks:
              mode === "weekly"
                ? parseHorizonWeeks(data.get("horizonWeeks"))
                : parseHorizonWeeks(schedule?.horizonWeeks),
            active: mode === "weekly" ? (activeInput?.checked ?? true) : false,
          });
        }}
      >
        {mode === "weekly" ? (
          <>
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.scheduleWeekdayLabel}</span>
              <select
                name="weekday"
                defaultValue={schedule?.weekday ?? 1}
                className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
              >
                {WEEKDAYS.map((key, index) => (
                  <option key={key} value={index}>
                    {copy[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.scheduleTimeLabel}</span>
              <input
                name="timeLocal"
                type="time"
                required
                defaultValue={schedule?.timeLocal ?? "18:00"}
                className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.scheduleHorizonLabel}</span>
              <select
                name="horizonWeeks"
                data-testid="schedule-horizon"
                defaultValue={parseHorizonWeeks(
                  schedule?.horizonWeeks,
                  DEFAULT_SCHEDULE_HORIZON_WEEKS,
                )}
                className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
              >
                {SCHEDULE_HORIZON_OPTIONS.map((weeks) => {
                  const months = horizonMonths(weeks);
                  const label =
                    months == null
                      ? copy.scheduleHorizonWeeks.replace("{weeks}", String(weeks))
                      : copy.scheduleHorizonMonths
                          .replace("{weeks}", String(weeks))
                          .replace("{months}", String(months));
                  return (
                    <option key={weeks} value={weeks}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          </>
        ) : null}

        <label className={`block text-sm ${mode === "weekly" ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2"}`}>
          <span className="font-medium text-fg">{copy.scheduleMeetLabel}</span>
          <input
            name="meetUrl"
            type="url"
            defaultValue={schedule?.meetUrl ?? ""}
            placeholder={copy.meetUrlPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
          />
        </label>

        {mode === "weekly" ? (
          <label className="flex items-center gap-2 text-sm text-fg-muted lg:pb-2">
            <input
              name="active"
              type="checkbox"
              // Ad-hoc saves store active=false; switching back to weekly must
              // start active so "Guardar horario" realigns class times.
              defaultChecked={
                schedule?.weekday != null && Boolean(schedule.timeLocal)
                  ? Boolean(schedule.active)
                  : true
              }
              className="rounded border-border"
            />
            {copy.scheduleActiveLabel}
          </label>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-60"
        >
          {copy.scheduleSaveLabel}
        </button>
      </form>
    </section>
  );
}
