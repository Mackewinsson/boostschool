"use client";

import { Check, ExternalLink, Video } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/locale";
import type { CompletionStatus, Material } from "@/lib/materials/types";
import {
  detectMaterialKind,
  isMaterialNew,
} from "@/lib/materials/material-kind";
import {
  completionStatusLabel,
  formatScheduledAt,
} from "@/lib/materials/schedule-groups";
import { externalLinkProps } from "@/lib/site-links";
import { MaterialKindIcon } from "./material-kind-icon";

type MaterialCardProps = {
  material: Material;
  locale: Locale;
  openLabel: string;
  newBadge: string;
  scheduledLabel: string;
  joinMeetLabel: string;
  statusLabel: string;
  statusPending: string;
  statusDone: string;
  statusNotDone: string;
  statusPartial: string;
  notesLabel: string;
  notesPlaceholder: string;
  notesSaved: string;
  readOnly: boolean;
  onSaveNotes?: (materialId: string, notes: string) => Promise<void>;
};

function statusBadgeClass(status: CompletionStatus | null | undefined) {
  if (status === "done") return "border-accent/30 text-accent bg-accent/10";
  if (status === "partial") return "border-amber-400/30 text-amber-200 bg-amber-400/10";
  if (status === "not_done") return "border-red-400/30 text-red-200 bg-red-400/10";
  return "border-border text-fg-muted bg-canvas";
}

export function MaterialCard({
  material,
  locale,
  openLabel,
  newBadge,
  scheduledLabel,
  joinMeetLabel,
  statusLabel,
  statusPending,
  statusDone,
  statusNotDone,
  statusPartial,
  notesLabel,
  notesPlaceholder,
  notesSaved,
  readOnly,
  onSaveNotes,
}: MaterialCardProps) {
  const kind = detectMaterialKind(material.url);
  const status = material.completionStatus ?? null;
  const isDone = status === "done";
  const isNew = isMaterialNew(material.assignedAt, status);
  const scheduledLabelText = formatScheduledAt(material.scheduledAt, locale);
  const [notes, setNotes] = useState(material.notes ?? "");
  const [notesMaterialId, setNotesMaterialId] = useState(material.id);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesJustSaved, setNotesJustSaved] = useState(false);

  if (material.id !== notesMaterialId) {
    setNotesMaterialId(material.id);
    setNotes(material.notes ?? "");
  }

  async function handleBlur() {
    if (readOnly || !onSaveNotes) {
      return;
    }
    if ((material.notes ?? "") === notes) {
      return;
    }
    setSavingNotes(true);
    try {
      await onSaveNotes(material.id, notes);
      setNotesJustSaved(true);
      window.setTimeout(() => setNotesJustSaved(false), 1500);
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card-hover ${
        isDone
          ? "border-accent/25 opacity-90"
          : "border-border hover:border-brand-from/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isDone ? "bg-accent/15 text-accent" : "bg-brand-from/20 text-accent"
          }`}
        >
          {isDone ? (
            <Check size={22} aria-hidden="true" />
          ) : (
            <MaterialKindIcon kind={kind} size={22} />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isNew ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
              {newBadge}
            </span>
          ) : null}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(status)}`}
          >
            {statusLabel}:{" "}
            {completionStatusLabel(status, {
              pending: statusPending,
              done: statusDone,
              notDone: statusNotDone,
              partial: statusPartial,
            })}
          </span>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-fg">{material.title}</h3>
      {scheduledLabelText ? (
        <p className="mt-2 text-sm font-medium text-accent">
          {scheduledLabel}: {scheduledLabelText}
        </p>
      ) : null}
      {material.description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
          {material.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <a
          href={material.url}
          className="btn-glow inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
          {...externalLinkProps(material.url)}
        >
          {openLabel}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
        {material.meetUrl ? (
          <a
            href={material.meetUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent"
            {...externalLinkProps(material.meetUrl)}
          >
            <Video size={16} aria-hidden="true" />
            {joinMeetLabel}
          </a>
        ) : null}
      </div>

      {!readOnly ? (
        <div className="mt-4">
          <label className="block text-sm font-medium text-fg" htmlFor={`notes-${material.id}`}>
            {notesLabel}
          </label>
          <textarea
            id={`notes-${material.id}`}
            data-testid="class-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onBlur={() => void handleBlur()}
            rows={3}
            placeholder={notesPlaceholder}
            className="mt-1.5 w-full resize-y rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
          />
          {savingNotes || notesJustSaved ? (
            <p className="mt-1 text-xs text-accent">
              {notesJustSaved ? notesSaved : "…"}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
