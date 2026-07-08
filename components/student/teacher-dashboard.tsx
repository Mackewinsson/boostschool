"use client";

import { ChevronDown, Search, UserPlus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import { detectMaterialKind } from "@/lib/materials/material-kind";
import type { Assignment, Material, StudentSummary } from "@/lib/materials/types";
import { MaterialAssignPanel } from "./material-assign-panel";
import { MaterialKindIcon } from "./material-kind-icon";

type TeacherDashboardProps = {
  copy: StudentContent["teacher"];
};

export function TeacherDashboard({ copy }: TeacherDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredMaterials = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return materials;
    }
    return materials.filter(
      (material) =>
        material.title.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query) ||
        material.url.toLowerCase().includes(query),
    );
  }, [materials, searchQuery]);

  async function refreshAssignments() {
    const response = await fetch("/api/alumno/assignments");
    if (response.ok) {
      const data = (await response.json()) as { assignments?: Assignment[] };
      setAssignments(data.assignments ?? []);
    }
  }

  async function loadData() {
    const [materialsRes, studentsRes, assignmentsRes] = await Promise.all([
      fetch("/api/alumno/materials"),
      fetch("/api/alumno/students"),
      fetch("/api/alumno/assignments"),
    ]);

    if (materialsRes.ok) {
      const data = (await materialsRes.json()) as { materials?: Material[] };
      setMaterials(data.materials ?? []);
    }
    if (studentsRes.ok) {
      const data = (await studentsRes.json()) as { students?: StudentSummary[] };
      setStudents(data.students ?? []);
    }
    if (assignmentsRes.ok) {
      const data = (await assignmentsRes.json()) as { assignments?: Assignment[] };
      setAssignments(data.assignments ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [materialsRes, studentsRes, assignmentsRes] = await Promise.all([
        fetch("/api/alumno/materials"),
        fetch("/api/alumno/students"),
        fetch("/api/alumno/assignments"),
      ]);

      if (cancelled) {
        return;
      }

      if (materialsRes.ok) {
        const data = (await materialsRes.json()) as { materials?: Material[] };
        setMaterials(data.materials ?? []);
      }
      if (studentsRes.ok) {
        const data = (await studentsRes.json()) as { students?: StudentSummary[] };
        setStudents(data.students ?? []);
      }
      if (assignmentsRes.ok) {
        const data = (await assignmentsRes.json()) as { assignments?: Assignment[] };
        setAssignments(data.assignments ?? []);
      }
      setLoading(false);
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddMaterial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (title.trim().length < 2) {
      setError(copy.errorTitle);
      return;
    }
    if (!url.trim().startsWith("https://")) {
      setError(copy.errorUrl);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/alumno/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      const data = (await response.json()) as { material?: Material };
      setTitle("");
      setDescription("");
      setUrl("");
      setSearchQuery("");
      setMessage(copy.successAdded);
      await loadData();
      // Open the assignment panel of the just-created material so the next
      // step (assigning it) is obvious.
      if (data.material) {
        setExpandedMaterialId(data.material.id);
        requestAnimationFrame(() => {
          listRef.current
            ?.querySelector(`[data-material-id="${data.material?.id}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMaterial(id: string) {
    setSaving(true);
    setError(null);
    try {
      await fetch(`/api/alumno/materials/${id}`, { method: "DELETE" });
      if (expandedMaterialId === id) {
        setExpandedMaterialId(null);
      }
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function toggleAssignment(materialId: string, studentId: string, assigned: boolean) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/alumno/assignments", {
        method: assigned ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, materialId }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setMessage(copy.successAssigned);
      await refreshAssignments();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function assignToAll(materialId: string) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const unassigned = students.filter(
        (student) =>
          !assignments.some(
            (assignment) =>
              assignment.materialId === materialId &&
              assignment.clerkUserId === student.id,
          ),
      );
      await Promise.all(
        unassigned.map((student) =>
          fetch("/api/alumno/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: student.id, materialId }),
          }),
        ),
      );
      setMessage(copy.successAssigned);
      await refreshAssignments();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  function assignedCount(materialId: string): number {
    return assignments.filter((assignment) => assignment.materialId === materialId).length;
  }

  if (loading) {
    return <p className="mt-10 text-sm text-fg-muted">…</p>;
  }

  return (
    <>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.subtitle}</p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-fg">{copy.addTitle}</h2>
        <form onSubmit={handleAddMaterial} className="mt-5 space-y-4">
          <div>
            <label htmlFor="material-title" className="block text-sm font-medium text-fg">
              {copy.titleLabel}
            </label>
            <input
              id="material-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={copy.titlePlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="material-description" className="block text-sm font-medium text-fg">
              {copy.descriptionLabel}
            </label>
            <textarea
              id="material-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder={copy.descriptionPlaceholder}
              className="mt-1.5 w-full resize-y rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="material-url" className="block text-sm font-medium text-fg">
              {copy.urlLabel}
            </label>
            <input
              id="material-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={copy.urlPlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
          >
            {copy.addButton}
          </button>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-fg">{copy.materialsTitle}</h2>
          {materials.length > 0 ? (
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
              />
            </div>
          ) : null}
        </div>

        {materials.length === 0 ? (
          <p className="mt-4 text-sm text-fg-muted">{copy.materialsEmpty}</p>
        ) : filteredMaterials.length === 0 ? (
          <p className="mt-4 text-sm text-fg-muted">{copy.searchEmpty}</p>
        ) : (
          <ul ref={listRef} className="mt-4 space-y-3">
            {filteredMaterials.map((material) => {
              const expanded = expandedMaterialId === material.id;
              const count = assignedCount(material.id);
              return (
                <li
                  key={material.id}
                  data-material-id={material.id}
                  className={`rounded-2xl border bg-card p-4 transition ${
                    expanded ? "border-accent/40" : "border-border"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-from/20 text-accent">
                        <MaterialKindIcon kind={detectMaterialKind(material.url)} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-fg">{material.title}</p>
                        {material.description ? (
                          <p className="mt-1 text-sm text-fg-muted">{material.description}</p>
                        ) : null}
                        <p className="mt-1 truncate text-xs text-fg-faint">{material.url}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMaterialId(expanded ? null : material.id)
                        }
                        aria-expanded={expanded}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                          expanded
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border text-fg-muted hover:border-accent/30 hover:text-accent"
                        }`}
                      >
                        <UserPlus size={15} aria-hidden="true" />
                        {copy.assignButton}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                            count > 0 ? "bg-accent/15 text-accent" : "bg-canvas text-fg-faint"
                          }`}
                        >
                          {count}/{students.length}
                        </span>
                        <ChevronDown
                          size={14}
                          aria-hidden="true"
                          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteMaterial(material.id)}
                        disabled={saving}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-60"
                      >
                        {copy.deleteLabel}
                      </button>
                    </div>
                  </div>

                  {expanded ? (
                    <MaterialAssignPanel
                      materialId={material.id}
                      students={students}
                      assignments={assignments}
                      saving={saving}
                      copy={copy}
                      onToggle={(materialId, studentId, assigned) =>
                        void toggleAssignment(materialId, studentId, assigned)
                      }
                      onAssignAll={(materialId) => void assignToAll(materialId)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {message ? <p className="mt-6 text-sm text-accent">{message}</p> : null}
      {error ? (
        <p className="mt-6 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
