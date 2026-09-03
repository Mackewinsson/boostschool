"use client";

import { useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import {
  DEFAULT_SCHEDULE_HORIZON_WEEKS,
  SCHEDULE_HORIZON_OPTIONS,
  horizonMonths,
  parseHorizonWeeks,
} from "@/lib/materials/schedule-horizon";
import {
  MAX_WEEKLY_SLOTS,
  formatTimeLocal,
  nextDefaultSlot,
  slotKey,
  weeklySlotsOf,
  type WeeklySlot,
} from "@/lib/materials/schedule-slots";
import type { StudentClassSchedule } from "@/lib/materials/types";

type StudentSchedulePanelProps = {
  studentId: string;
  schedule?: StudentClassSchedule;
  saving: boolean;
  copy: StudentContent["teacher"];
  onSave: (input: {
    studentUserId: string;
    slots: WeeklySlot[];
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
  const initialSlots = weeklySlotsOf(schedule ?? { weekday: null, timeLocal: null });
  const initialWeekly = initialSlots.length > 0;
  const [mode, setMode] = useState<"weekly" | "adhoc">(
    initialWeekly ? "weekly" : "adhoc",
  );
  const [slots, setSlots] = useState<WeeklySlot[]>(
    initialWeekly ? initialSlots : [{ weekday: 1, timeLocal: "18:00" }],
  );
  const [localError, setLocalError] = useState<string | null>(null);

  function updateSlot(index: number, patch: Partial<WeeklySlot>) {
    setLocalError(null);
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );
  }

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
          const weekly = mode === "weekly";
          const keys = slots.map((slot) =>
            slotKey({
              weekday: slot.weekday,
              timeLocal: formatTimeLocal(slot.timeLocal) ?? slot.timeLocal,
            }),
          );
          if (weekly && new Set(keys).size !== keys.length) {
            setLocalError(copy.scheduleErrorDuplicateSlot);
            return;
          }
          setLocalError(null);
          void onSave({
            studentUserId: studentId,
            slots: weekly ? slots : [],
            meetUrl: String(data.get("meetUrl") ?? ""),
            horizonWeeks:
              weekly
                ? parseHorizonWeeks(data.get("horizonWeeks"))
                : parseHorizonWeeks(schedule?.horizonWeeks),
            active: weekly ? (activeInput?.checked ?? true) : false,
          });
        }}
      >
        {mode === "weekly" ? (
          <>
            {slots.map((slot, index) => (
              <div
                key={`slot-${index}`}
                data-testid={`schedule-slot-${index}`}
                className="sm:col-span-2 lg:col-span-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end"
              >
                <label className="block text-sm">
                  <span className="font-medium text-fg">
                    {copy.scheduleSlotHeading.replace("{n}", String(index + 1))}
                    {" · "}
                    {copy.scheduleWeekdayLabel}
                  </span>
                  <select
                    name={`weekday-${index}`}
                    value={slot.weekday}
                    onChange={(event) =>
                      updateSlot(index, { weekday: Number(event.target.value) })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
                  >
                    {WEEKDAYS.map((key, dayIndex) => (
                      <option key={key} value={dayIndex}>
                        {copy[key]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-fg">{copy.scheduleTimeLabel}</span>
                  <input
                    name={`timeLocal-${index}`}
                    type="time"
                    required
                    value={slot.timeLocal}
                    onChange={(event) =>
                      updateSlot(index, {
                        timeLocal:
                          formatTimeLocal(event.target.value) ?? event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
                  />
                </label>
                {slots.length > 1 ? (
                  <button
                    type="button"
                    data-testid={`schedule-remove-slot-${index}`}
                    onClick={() => {
                      setLocalError(null);
                      setSlots((current) =>
                        current.filter((_, slotIndex) => slotIndex !== index),
                      );
                    }}
                    className="rounded-xl border border-border px-3 py-2 text-sm text-fg-muted transition hover:border-accent/30 hover:text-accent"
                  >
                    {copy.scheduleRemoveSlot}
                  </button>
                ) : null}
              </div>
            ))}
            {slots.length < MAX_WEEKLY_SLOTS ? (
              <button
                type="button"
                data-testid="schedule-add-slot"
                onClick={() => {
                  setLocalError(null);
                  setSlots((current) => [...current, nextDefaultSlot(current)]);
                }}
                className="sm:col-span-2 lg:col-span-3 justify-self-start rounded-xl border border-dashed border-border px-3 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent"
              >
                {copy.scheduleAddSlot}
              </button>
            ) : null}
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
              defaultChecked={initialWeekly ? Boolean(schedule?.active) : true}
              className="rounded border-border"
            />
            {copy.scheduleActiveLabel}
          </label>
        ) : null}

        {localError ? (
          <p
            className="sm:col-span-2 lg:col-span-3 text-sm text-red-400"
            role="alert"
            data-testid="schedule-form-error"
          >
            {localError}
          </p>
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
