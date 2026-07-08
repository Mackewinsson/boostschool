"use client";

import { useEffect, useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import type { Assignment, Material, StudentSummary } from "@/lib/materials/types";

type TeacherDashboardProps = {
  copy: StudentContent["teacher"];
};

export function TeacherDashboard({ copy }: TeacherDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeStudentId = selectedStudentId || students[0]?.id || "";

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
      setTitle("");
      setDescription("");
      setUrl("");
      setMessage(copy.successAdded);
      await loadData();
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
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  function isAssigned(materialId: string): boolean {
    return assignments.some(
      (assignment) =>
        assignment.clerkUserId === activeStudentId &&
        assignment.materialId === materialId,
    );
  }

  async function toggleAssignment(materialId: string) {
    if (!activeStudentId) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    const assigned = isAssigned(materialId);

    try {
      const response = await fetch("/api/alumno/assignments", {
        method: assigned ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeStudentId, materialId }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setMessage(copy.successAssigned);
      const assignmentsRes = await fetch("/api/alumno/assignments");
      if (assignmentsRes.ok) {
        const data = (await assignmentsRes.json()) as { assignments?: Assignment[] };
        setAssignments(data.assignments ?? []);
      }
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-xl font-bold text-fg">{copy.materialsTitle}</h2>
        {materials.length === 0 ? (
          <p className="mt-4 text-sm text-fg-muted">{copy.materialsEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {materials.map((material) => (
              <li
                key={material.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-fg">{material.title}</p>
                  {material.description ? (
                    <p className="mt-1 text-sm text-fg-muted">{material.description}</p>
                  ) : null}
                  <p className="mt-1 truncate text-xs text-fg-faint">{material.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeleteMaterial(material.id)}
                  disabled={saving}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-60"
                >
                  {copy.deleteLabel}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-fg">{copy.assignTitle}</h2>
        <p className="mt-2 text-sm text-fg-muted">{copy.assignHint}</p>

        <div className="mt-5">
          <label htmlFor="student-select" className="block text-sm font-medium text-fg">
            {copy.studentLabel}
          </label>
          <select
            id="student-select"
            value={activeStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
          >
            <option value="">{copy.studentPlaceholder}</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName || student.lastName
                  ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim()
                  : student.email}
                {student.email ? ` (${student.email})` : ""}
              </option>
            ))}
          </select>
        </div>

        {activeStudentId && materials.length > 0 ? (
          <ul className="mt-5 space-y-2">
            {materials.map((material) => {
              const assigned = isAssigned(material.id);
              return (
                <li key={material.id}>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void toggleAssignment(material.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                      assigned
                        ? "border-accent/40 bg-accent/10 text-fg"
                        : "border-border bg-canvas text-fg-muted hover:border-brand-from/30"
                    }`}
                  >
                    <span>{material.title}</span>
                    <span className="text-xs font-medium">
                      {assigned ? copy.assigned : copy.notAssigned}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
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
