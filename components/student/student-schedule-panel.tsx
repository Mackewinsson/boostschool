"use client";

import { useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
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
  const [weekday, setWeekday] = useState(schedule?.weekday ?? 1);
  const [timeLocal, setTimeLocal] = useState(schedule?.timeLocal ?? "18:00");
  const [meetUrl, setMeetUrl] = useState(schedule?.meetUrl ?? "");
  const [active, setActive] = useState(schedule?.active ?? true);

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
        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void onSave({
            studentUserId: studentId,
            weekday: mode === "weekly" ? weekday : null,
            timeLocal: mode === "weekly" ? timeLocal : null,
            meetUrl,
            active: mode === "weekly" ? active : false,
          });
        }}
      >
        {mode === "weekly" ? (
          <>
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.scheduleWeekdayLabel}</span>
              <select
                name="weekday"
                value={weekday}
                onChange={(event) => setWeekday(Number(event.target.value))}
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
                value={timeLocal}
                onChange={(event) => setTimeLocal(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
              />
            </label>
          </>
        ) : null}

        <label className={`block text-sm ${mode === "adhoc" ? "sm:col-span-2 lg:col-span-2" : ""}`}>
          <span className="font-medium text-fg">{copy.scheduleMeetLabel}</span>
          <input
            name="meetUrl"
            type="url"
            value={meetUrl}
            onChange={(event) => setMeetUrl(event.target.value)}
            placeholder={copy.meetUrlPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
          />
        </label>

        {mode === "weekly" ? (
          <label className="flex items-center gap-2 text-sm text-fg-muted lg:pb-2">
            <input
              name="active"
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
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
