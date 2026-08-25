"use client";

import { Video } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/locale";
import type { CompletionStatus, Material } from "@/lib/materials/types";
import {
  completionStatusLabel,
  formatScheduledAt,
} from "@/lib/materials/schedule-groups";
import {
  datetimeLocalInZoneToUtcIso,
  toDatetimeLocalValueInZone,
} from "@/lib/materials/schedule-generate";
import { externalLinkProps } from "@/lib/site-links";

export type ClassSessionTableCopy = {
  classesTitle: string;
  classesEmpty: string;
  homeworkLabel: string;
  homeworkEmpty?: string;
  homeworkPlaceholder?: string;
  saveHomeworkButton?: string;
  scheduledAtLabel?: string;
  joinMeetLabel: string;
  statusLabel: string;
  statusPending: string;
  statusDone: string;
  statusNotDone: string;
  statusPartial: string;
  addClassLabel?: string;
  addClassButton?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  notesSaved?: string;
};

type ClassSessionTableProps = {
  sessions: Material[];
  locale: Locale;
  copy: ClassSessionTableCopy;
  mode: "teacher" | "readonly";
  saving?: boolean;
  timeZone?: string;
  onSaveHomework?: (sessionId: string, description: string, scheduledAt: string) => Promise<void>;
  onStatusChange?: (sessionId: string, status: CompletionStatus | null) => Promise<void>;
  onAddClass?: (scheduledAt: string) => Promise<void>;
  onSaveNotes?: (sessionId: string, notes: string) => Promise<void>;
  allowNotes?: boolean;
};

const DEFAULT_TZ = "Europe/Warsaw";

export function ClassSessionTable({
  sessions,
  locale,
  copy,
  mode,
  saving = false,
  timeZone = DEFAULT_TZ,
  onSaveHomework,
  onStatusChange,
  onAddClass,
  onSaveNotes,
  allowNotes = false,
}: ClassSessionTableProps) {
  const [newClassAt, setNewClassAt] = useState("");

  return (
    <section className="mt-10" data-testid="class-session-table">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-bold text-fg">{copy.classesTitle}</h2>
        {mode === "teacher" && onAddClass ? (
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newClassAt) return;
              const iso = datetimeLocalInZoneToUtcIso(newClassAt, timeZone);
              if (!iso) return;
              void onAddClass(iso).then(() => setNewClassAt(""));
            }}
          >
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.addClassLabel}</span>
              <input
                type="datetime-local"
                value={newClassAt}
                onChange={(event) => setNewClassAt(event.target.value)}
                data-testid="add-class-datetime"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none sm:min-w-[14rem]"
              />
            </label>
            <button
              type="submit"
              disabled={saving || !newClassAt}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-60"
            >
              {copy.addClassButton}
            </button>
          </form>
        ) : null}
      </div>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-fg-muted">{copy.classesEmpty}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              locale={locale}
              copy={copy}
              mode={mode}
              saving={saving}
              timeZone={timeZone}
              onSaveHomework={onSaveHomework}
              onStatusChange={onStatusChange}
              onSaveNotes={onSaveNotes}
              allowNotes={allowNotes}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function SessionRow({
  session,
  locale,
  copy,
  mode,
  saving,
  timeZone,
  onSaveHomework,
  onStatusChange,
  onSaveNotes,
  allowNotes,
}: {
  session: Material;
  locale: Locale;
  copy: ClassSessionTableCopy;
  mode: "teacher" | "readonly";
  saving: boolean;
  timeZone: string;
  onSaveHomework?: ClassSessionTableProps["onSaveHomework"];
  onStatusChange?: ClassSessionTableProps["onStatusChange"];
  onSaveNotes?: ClassSessionTableProps["onSaveNotes"];
  allowNotes: boolean;
}) {
  const [homework, setHomework] = useState(session.description ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValueInZone(session.scheduledAt, timeZone),
  );
  const [notes, setNotes] = useState(session.notes ?? "");
  const [notesJustSaved, setNotesJustSaved] = useState(false);
  const [syncedKey, setSyncedKey] = useState(`${session.id}:${session.scheduledAt}`);

  const nextKey = `${session.id}:${session.scheduledAt}`;
  if (nextKey !== syncedKey) {
    setSyncedKey(nextKey);
    setHomework(session.description ?? "");
    setScheduledAt(toDatetimeLocalValueInZone(session.scheduledAt, timeZone));
    setNotes(session.notes ?? "");
  }

  const dateLabel = formatScheduledAt(session.scheduledAt, locale, timeZone);
  const status = session.completionStatus ?? null;
  const homeworkText = (session.description ?? "").trim();
  const hasHomework = Boolean(homeworkText);

  async function handleNotesBlur() {
    if (!allowNotes || !onSaveNotes) return;
    if ((session.notes ?? "") === notes) return;
    await onSaveNotes(session.id, notes);
    setNotesJustSaved(true);
    window.setTimeout(() => setNotesJustSaved(false), 1500);
  }

  return (
    <li
      data-testid="class-session-row"
      data-session-id={session.id}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {mode === "teacher" ? (
            <label className="block text-sm">
              <span className="font-medium text-fg">{copy.scheduledAtLabel}</span>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                data-testid="session-datetime"
                className="mt-1.5 w-full max-w-xs rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-accent/50 focus:outline-none"
              />
            </label>
          ) : (
            <p className="text-base font-semibold text-accent">{dateLabel}</p>
          )}
          {session.meetUrl ? (
            <a
              href={session.meetUrl}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-accent"
              {...externalLinkProps(session.meetUrl)}
            >
              <Video size={14} aria-hidden="true" />
              {copy.joinMeetLabel}
            </a>
          ) : null}
        </div>

        {mode === "teacher" || hasHomework ? (
          <div className="sm:text-right">
            <p className="text-xs font-medium text-fg-faint">{copy.statusLabel}</p>
            {mode === "teacher" && onStatusChange ? (
              <select
                data-testid="homework-status"
                value={status ?? ""}
                disabled={saving}
                onChange={(event) => {
                  const value = event.target.value;
                  const next = value === "" ? null : (value as CompletionStatus);
                  void onStatusChange(session.id, next);
                }}
                className="mt-1 rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
              >
                <option value="">{copy.statusPending}</option>
                <option value="done">{copy.statusDone}</option>
                <option value="not_done">{copy.statusNotDone}</option>
                <option value="partial">{copy.statusPartial}</option>
              </select>
            ) : (
              <p
                data-testid="homework-status-badge"
                className="mt-1 text-sm font-medium text-fg"
              >
                {completionStatusLabel(status, {
                  pending: copy.statusPending,
                  done: copy.statusDone,
                  notDone: copy.statusNotDone,
                  partial: copy.statusPartial,
                })}
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-fg">{copy.homeworkLabel}</p>
        {mode === "teacher" && onSaveHomework ? (
          <>
            <textarea
              data-testid="session-homework"
              value={homework}
              onChange={(event) => setHomework(event.target.value)}
              rows={5}
              placeholder={copy.homeworkPlaceholder}
              className="mt-1.5 w-full resize-y rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                const iso =
                  datetimeLocalInZoneToUtcIso(scheduledAt, timeZone) ?? scheduledAt;
                void onSaveHomework(session.id, homework, iso);
              }}
              className="mt-2 rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {copy.saveHomeworkButton}
            </button>
          </>
        ) : hasHomework ? (
          <p
            data-testid="session-homework-text"
            className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-fg-muted"
          >
            {homeworkText}
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-fg-faint">{copy.homeworkEmpty}</p>
        )}
      </div>

      {allowNotes && onSaveNotes ? (
        <div className="mt-4">
          <label className="block text-sm font-medium text-fg" htmlFor={`notes-${session.id}`}>
            {copy.notesLabel}
          </label>
          <textarea
            id={`notes-${session.id}`}
            data-testid="class-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onBlur={() => void handleNotesBlur()}
            rows={3}
            placeholder={copy.notesPlaceholder}
            className="mt-1.5 w-full resize-y rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
          />
          {notesJustSaved ? (
            <p className="mt-1 text-xs text-accent">{copy.notesSaved}</p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
