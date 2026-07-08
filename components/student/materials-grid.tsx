import type { Material } from "@/lib/materials/types";
import { MaterialCard } from "./material-card";

type MaterialsGridProps = {
  materials: Material[];
  openLabel: string;
  newBadge: string;
  markDone: string;
  markUndone: string;
  doneBadge: string;
  emptyTitle: string;
  emptyBody: string;
  onToggleDone?: (materialId: string, completed: boolean) => void;
  togglingId?: string | null;
};

export function MaterialsGrid({
  materials,
  openLabel,
  newBadge,
  markDone,
  markUndone,
  doneBadge,
  emptyTitle,
  emptyBody,
  onToggleDone,
  togglingId = null,
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
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          openLabel={openLabel}
          newBadge={newBadge}
          markDone={markDone}
          markUndone={markUndone}
          doneBadge={doneBadge}
          onToggleDone={onToggleDone}
          toggling={togglingId === material.id}
        />
      ))}
    </div>
  );
}
