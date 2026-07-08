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
        emptyTitle={copy.emptyTitle}
        emptyBody={copy.emptyBody}
      />
    </>
  );
}
