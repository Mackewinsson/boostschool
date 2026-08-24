"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import type { Material } from "@/lib/materials/types";
import { groupMaterialsBySchedule } from "@/lib/materials/schedule-groups";
import type { StudentContent } from "@/lib/student-content/types";
import { MaterialsGrid } from "./materials-grid";

type StudentDashboardProps = {
  copy: StudentContent["student"];
  locale: Locale;
};

export function StudentDashboard({ copy, locale }: StudentDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [linkedStudentName, setLinkedStudentName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/alumno/my-materials");
        if (!response.ok) {
          setMaterials([]);
          return;
        }
        const data = (await response.json()) as {
          materials?: Material[];
          readOnly?: boolean;
          linkedStudentName?: string | null;
        };
        setMaterials(data.materials ?? []);
        setReadOnly(Boolean(data.readOnly));
        setLinkedStudentName(data.linkedStudentName ?? null);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const groups = useMemo(() => groupMaterialsBySchedule(materials), [materials]);

  async function handleSaveNotes(materialId: string, notes: string) {
    const response = await fetch("/api/alumno/my-materials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId, notes }),
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { materials?: Material[] };
    setMaterials(data.materials ?? []);
  }

  if (loading) {
    return <p className="mt-10 text-sm text-fg-muted">…</p>;
  }

  const subtitle = readOnly && linkedStudentName
    ? copy.parentSubtitle.replace("{name}", linkedStudentName)
    : copy.subtitle;

  const sharedGridProps = {
    locale,
    openLabel: copy.openLabel,
    newBadge: copy.newBadge,
    scheduledLabel: copy.scheduledLabel,
    joinMeetLabel: copy.joinMeetLabel,
    statusLabel: copy.statusLabel,
    statusPending: copy.statusPending,
    statusDone: copy.statusDone,
    statusNotDone: copy.statusNotDone,
    statusPartial: copy.statusPartial,
    notesLabel: copy.notesLabel,
    notesPlaceholder: copy.notesPlaceholder,
    notesSaved: copy.notesSaved,
    emptyTitle: copy.emptyTitle,
    emptyBody: copy.emptyBody,
    readOnly,
    onSaveNotes: readOnly ? undefined : handleSaveNotes,
  };

  return (
    <>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-2xl text-base text-fg-muted">{subtitle}</p>

      {materials.length === 0 ? (
        <MaterialsGrid materials={[]} {...sharedGridProps} />
      ) : (
        <>
          {groups.upcoming.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-fg">{copy.upcomingTitle}</h2>
              <MaterialsGrid materials={groups.upcoming} {...sharedGridProps} />
            </section>
          ) : null}
          {groups.past.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-fg">{copy.pastTitle}</h2>
              <MaterialsGrid materials={groups.past} {...sharedGridProps} />
            </section>
          ) : null}
          {groups.undated.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-fg">{copy.undatedTitle}</h2>
              <MaterialsGrid materials={groups.undated} {...sharedGridProps} />
            </section>
          ) : null}
        </>
      )}
    </>
  );
}
