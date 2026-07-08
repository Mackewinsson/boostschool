"use client";

import { useEffect, useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import type { Material } from "@/lib/materials/types";
import { MaterialsGrid } from "./materials-grid";

type StudentDashboardProps = {
  copy: StudentContent["student"];
};

export function StudentDashboard({ copy }: StudentDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/alumno/my-materials");
        if (!response.ok) {
          setMaterials([]);
          return;
        }
        const data = (await response.json()) as { materials?: Material[] };
        setMaterials(data.materials ?? []);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleToggleDone(materialId: string, completed: boolean) {
    setTogglingId(materialId);
    try {
      const response = await fetch("/api/alumno/my-materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, completed }),
      });
      if (response.ok) {
        const data = (await response.json()) as { materials?: Material[] };
        setMaterials(data.materials ?? []);
      }
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) {
    return <p className="mt-10 text-sm text-fg-muted">…</p>;
  }

  return (
    <>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-2xl text-base text-fg-muted">{copy.subtitle}</p>
      <MaterialsGrid
        materials={materials}
        openLabel={copy.openLabel}
        newBadge={copy.newBadge}
        markDone={copy.markDone}
        markUndone={copy.markUndone}
        doneBadge={copy.doneBadge}
        emptyTitle={copy.emptyTitle}
        emptyBody={copy.emptyBody}
        onToggleDone={handleToggleDone}
        togglingId={togglingId}
      />
    </>
  );
}
