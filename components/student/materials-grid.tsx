import type { Locale } from "@/lib/locale";
import type { Material } from "@/lib/materials/types";
import { MaterialCard } from "./material-card";

type MaterialsGridProps = {
  materials: Material[];
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
  emptyTitle: string;
  emptyBody: string;
  readOnly: boolean;
  onSaveNotes?: (materialId: string, notes: string) => Promise<void>;
};

export function MaterialsGrid({
  materials,
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
  emptyTitle,
  emptyBody,
  readOnly,
  onSaveNotes,
}: MaterialsGridProps) {
  if (materials.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
        <p className="text-lg font-semibold text-fg">{emptyTitle}</p>
        <p className="mt-2 text-sm text-fg-muted">{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          locale={locale}
          openLabel={openLabel}
          newBadge={newBadge}
          scheduledLabel={scheduledLabel}
          joinMeetLabel={joinMeetLabel}
          statusLabel={statusLabel}
          statusPending={statusPending}
          statusDone={statusDone}
          statusNotDone={statusNotDone}
          statusPartial={statusPartial}
          notesLabel={notesLabel}
          notesPlaceholder={notesPlaceholder}
          notesSaved={notesSaved}
          readOnly={readOnly}
          onSaveNotes={onSaveNotes}
        />
      ))}
    </div>
  );
}
