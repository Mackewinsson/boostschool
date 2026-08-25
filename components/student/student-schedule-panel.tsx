"use client";

import type { StudentContent } from "@/lib/student-content/types";
import type { StudentClassSchedule, StudentSummary } from "@/lib/materials/types";

type StudentSchedulePanelProps = {
  students: StudentSummary[];
  schedules: StudentClassSchedule[];
  saving: boolean;
  copy: StudentContent["teacher"];
  onSave: (input: {
    studentUserId: string;
    weekday: number;
    timeLocal: string;
    meetUrl: string;
    active: boolean;
  }) => Promise<void>;
};

function studentDisplayName(student: StudentSummary): string {
  const name = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();
  return name || student.email;
}

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
  students,
  schedules,
  saving,
  copy,
  onSave,
}: StudentSchedulePanelProps) {
  if (students.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-fg">{copy.scheduleSectionTitle}</h2>
      <p className="mt-2 text-sm text-fg-muted">{copy.scheduleSectionHint}</p>

      <ul className="mt-6 space-y-4">
        {students.map((student) => {
          const existing = schedules.find((s) => s.studentUserId === student.id);
          return (
            <li
              key={student.id}
              className="rounded-xl border border-border bg-canvas p-4"
            >
              <p className="font-medium text-fg">{studentDisplayName(student)}</p>
              <p className="text-xs text-fg-faint">{student.email}</p>
              <ScheduleRowForm
                studentId={student.id}
                initial={existing}
                saving={saving}
                copy={copy}
                onSave={onSave}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ScheduleRowForm({
  studentId,
  initial,
  saving,
  copy,
  onSave,
}: {
  studentId: string;
  initial?: StudentClassSchedule;
  saving: boolean;
  copy: StudentContent["teacher"];
  onSave: StudentSchedulePanelProps["onSave"];
}) {
  return (
    <form
      className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const activeInput = form.querySelector<HTMLInputElement>('input[name="active"]');
        void onSave({
          studentUserId: studentId,
          weekday: Number(data.get("weekday")),
          timeLocal: String(data.get("timeLocal") ?? ""),
          meetUrl: String(data.get("meetUrl") ?? ""),
          active: activeInput?.checked ?? true,
        });
      }}
    >
      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.scheduleWeekdayLabel}</span>
        <select
          name="weekday"
          defaultValue={initial?.weekday ?? 1}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
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
          defaultValue={initial?.timeLocal ?? "18:00"}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
        />
      </label>
      <label className="block text-sm sm:col-span-2 lg:col-span-1">
        <span className="font-medium text-fg">{copy.scheduleMeetLabel}</span>
        <input
          name="meetUrl"
          type="url"
          defaultValue={initial?.meetUrl ?? ""}
          placeholder={copy.meetUrlPlaceholder}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-fg-muted lg:pb-2">
        <input
          name="active"
          type="checkbox"
          defaultChecked={initial?.active ?? true}
          className="rounded border-border"
        />
        {copy.scheduleActiveLabel}
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-60"
      >
        {copy.scheduleSaveLabel}
      </button>
    </form>
  );
}
