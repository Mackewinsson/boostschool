"use client";

import { Check, ExternalLink } from "lucide-react";
import type { Material } from "@/lib/materials/types";
import {
  detectMaterialKind,
  isMaterialNew,
} from "@/lib/materials/material-kind";
import { externalLinkProps } from "@/lib/site-links";
import { MaterialKindIcon } from "./material-kind-icon";

type MaterialCardProps = {
  material: Material;
  openLabel: string;
  newBadge: string;
  markDone: string;
  markUndone: string;
  doneBadge: string;
  onToggleDone?: (materialId: string, completed: boolean) => void;
  toggling?: boolean;
};

export function MaterialCard({
  material,
  openLabel,
  newBadge,
  markDone,
  markUndone,
  doneBadge,
  onToggleDone,
  toggling = false,
}: MaterialCardProps) {
  const kind = detectMaterialKind(material.url);
  const isDone = Boolean(material.completedAt);
  const isNew = isMaterialNew(material.assignedAt, material.completedAt);

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
          {isDone ? (
            <span className="rounded-full border border-accent/30 px-2.5 py-0.5 text-xs font-medium text-accent">
              {doneBadge}
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-fg">{material.title}</h3>
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
        {onToggleDone ? (
          <button
            type="button"
            disabled={toggling}
            onClick={() => onToggleDone(material.id, !isDone)}
            className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-60"
          >
            {isDone ? markUndone : markDone}
          </button>
        ) : null}
      </div>
    </article>
  );
}
