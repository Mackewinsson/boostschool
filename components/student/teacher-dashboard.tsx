"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";
import { detectMaterialKind } from "@/lib/materials/material-kind";
import { splitSessionsAndExtras } from "@/lib/materials/schedule-groups";
import type {
  Assignment,
  CompletionStatus,
  Material,
  StudentClassSchedule,
  StudentSummary,
} from "@/lib/materials/types";
import { ClassMonthCalendar } from "./class-month-calendar";
import { ClassSessionTable } from "./class-session-table";
import { MaterialKindIcon } from "./material-kind-icon";
import { StudentSchedulePanel } from "./student-schedule-panel";

type TeacherDashboardProps = {
  copy: StudentContent["teacher"];
  locale: string;
  initialStudentId?: string;
  accountsHref?: string;
};

function studentDisplayName(student: StudentSummary): string {
  const name = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();
  return name || student.name || student.email;
}

function enrichForStudent(
  materials: Material[],
  assignments: Assignment[],
  studentId: string,
): Material[] {
  return materials
    .filter((material) =>
      assignments.some(
        (assignment) =>
          assignment.materialId === material.id && assignment.userId === studentId,
      ),
    )
    .map((material) => {
      const assignment = assignments.find(
        (item) => item.materialId === material.id && item.userId === studentId,
      );
      return {
        ...material,
        assignedAt: assignment?.assignedAt,
        completionStatus: assignment?.completionStatus ?? null,
        reviewedAt: assignment?.reviewedAt ?? null,
        notes: assignment?.notes ?? null,
      };
    });
}

export function TeacherDashboard({
  copy,
  locale,
  initialStudentId,
  accountsHref = teacherPaths.students,
}: TeacherDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [schedules, setSchedules] = useState<StudentClassSchedule[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  /** Keys: sessionId | "schedule" | "add-class" | "extra" | "delete:{id}" | form ids */
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [dashTab, setDashTab] = useState<"classes" | "extras">("classes");

  const selectedSchedule = useMemo(
    () => schedules.find((item) => item.studentUserId === selectedStudentId),
    [schedules, selectedStudentId],
  );

  const studentMaterials = useMemo(
    () =>
      selectedStudentId
        ? enrichForStudent(materials, assignments, selectedStudentId)
        : [],
    [materials, assignments, selectedStudentId],
  );

  const { sessions, extras } = useMemo(
    () => splitSessionsAndExtras(studentMaterials),
    [studentMaterials],
  );

  async function loadData(options?: { ensureStudentId?: string }) {
    const [materialsRes, studentsRes, assignmentsRes, schedulesRes] = await Promise.all([
      fetch("/api/alumno/materials"),
      fetch("/api/alumno/students"),
      fetch("/api/alumno/assignments"),
      fetch("/api/alumno/schedules"),
    ]);

    if (materialsRes.ok) {
      const data = (await materialsRes.json()) as { materials?: Material[] };
      setMaterials(data.materials ?? []);
    }

    let resolvedSelected = selectedStudentId || initialStudentId || "";
    if (studentsRes.ok) {
      const data = (await studentsRes.json()) as { students?: StudentSummary[] };
      const nextStudents = data.students ?? [];
      setStudents(nextStudents);
      if (
        !resolvedSelected ||
        !nextStudents.some((student) => student.id === resolvedSelected)
      ) {
        resolvedSelected = nextStudents[0]?.id ?? "";
      }
      setSelectedStudentId(resolvedSelected);
    }
    if (assignmentsRes.ok) {
      const data = (await assignmentsRes.json()) as { assignments?: Assignment[] };
      setAssignments(data.assignments ?? []);
    }
    if (schedulesRes.ok) {
      const data = (await schedulesRes.json()) as { schedules?: StudentClassSchedule[] };
      setSchedules(data.schedules ?? []);
    }

    const horizonStudentId = options?.ensureStudentId ?? resolvedSelected;
    if (horizonStudentId) {
      await fetch("/api/alumno/horizon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUserId: horizonStudentId }),
      });
      const refreshed = await fetch("/api/alumno/materials");
      if (refreshed.ok) {
        const data = (await refreshed.json()) as { materials?: Material[] };
        setMaterials(data.materials ?? []);
      }
    }
    setLoading(false);
  }

  async function selectStudent(studentId: string) {
    setSelectedStudentId(studentId);
    if (!studentId) return;
    await fetch("/api/alumno/horizon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentUserId: studentId }),
    });
    const refreshed = await fetch("/api/alumno/materials");
    if (refreshed.ok) {
      const data = (await refreshed.json()) as { materials?: Material[] };
      setMaterials(data.materials ?? []);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadData();
      if (cancelled) {
        return;
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSaveSchedule(input: {
    studentUserId: string;
    weekday: number | null;
    timeLocal: string | null;
    meetUrl: string;
    horizonWeeks: number;
    active: boolean;
  }) {
    setError(null);
    setMessage(null);
    setBusyKey("schedule");
    try {
      const response = await fetch("/api/alumno/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      // Refresh before toast so class times match the new schedule when the
      // success message appears (e2e and teachers both wait on that message).
      await loadData();
      setMessage(copy.scheduleSaved);
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleAddClass(scheduledAtIso: string) {
    if (!selectedStudentId) return;
    setError(null);
    setMessage(null);
    if (!scheduledAtIso) {
      setError(copy.errorClassDate);
      return;
    }
    setBusyKey("add-class");
    try {
      const response = await fetch("/api/alumno/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentUserId: selectedStudentId,
          scheduledAt: scheduledAtIso,
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setMessage(copy.successClassAdded);
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleSaveHomework(
    sessionId: string,
    homework: string,
    scheduledAtIso: string,
  ) {
    const session = materials.find((item) => item.id === sessionId);
    if (!session) return;
    setError(null);
    setMessage(null);
    setBusyKey(sessionId);
    try {
      const response = await fetch(`/api/alumno/materials/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: session.title,
          description: homework,
          url: session.url ?? "",
          scheduledAt: scheduledAtIso || session.scheduledAt,
          meetUrl: session.meetUrl ?? "",
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setMessage(copy.successUpdated);
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleStatusChange(
    sessionId: string,
    status: CompletionStatus | null,
  ) {
    if (!selectedStudentId) return;
    setError(null);
    setMessage(null);
    setBusyKey(sessionId);
    try {
      const response = await fetch("/api/alumno/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedStudentId,
          materialId: sessionId,
          completionStatus: status,
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      const data = (await response.json()) as { assignments?: Assignment[] };
      if (data.assignments) {
        setAssignments(data.assignments);
      }
      setMessage(copy.successAssigned);
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleAddExtra(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStudentId) return;
    setError(null);
    setMessage(null);

    if (title.trim().length < 2) {
      setError(copy.errorTitle);
      return;
    }
    if (!description.trim() && !url.trim()) {
      setError(copy.errorContent);
      return;
    }
    if (url.trim() && !url.trim().startsWith("https://")) {
      setError(copy.errorUrl);
      return;
    }

    setBusyKey("extra");
    try {
      const createRes = await fetch("/api/alumno/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          url: url.trim() || undefined,
        }),
      });
      if (!createRes.ok) {
        setError(copy.errorGeneric);
        return;
      }
      const created = (await createRes.json()) as { material?: Material };
      if (!created.material) {
        setError(copy.errorGeneric);
        return;
      }
      const assignRes = await fetch("/api/alumno/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedStudentId,
          materialId: created.material.id,
        }),
      });
      if (!assignRes.ok) {
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
      setBusyKey(null);
    }
  }

  async function handleDeleteExtra(id: string) {
    setBusyKey(`delete:${id}`);
    setError(null);
    try {
      await fetch(`/api/alumno/materials/${id}`, { method: "DELETE" });
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return <p className="mt-10 text-sm text-fg-muted">…</p>;
  }

  return (
    <>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.subtitle}</p>

      <div
        className="admin-nav__secondary mt-8"
        role="tablist"
        aria-label={copy.title}
      >
        <button
          type="button"
          role="tab"
          aria-selected={dashTab === "classes"}
          className={
            dashTab === "classes"
              ? "admin-nav__chip admin-nav__chip--active"
              : "admin-nav__chip"
          }
          onClick={() => setDashTab("classes")}
        >
          {copy.navGroupClasses}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={dashTab === "extras"}
          className={
            dashTab === "extras"
              ? "admin-nav__chip admin-nav__chip--active"
              : "admin-nav__chip"
          }
          onClick={() => setDashTab("extras")}
        >
          {copy.extrasTitle}
        </button>
      </div>

      {students.length === 0 ? (
        <p className="mt-10 text-sm text-fg-muted">
          {copy.noStudents}{" "}
          <Link href={accountsHref} className="font-medium text-accent hover:underline">
            {copy.studentsCreateCta}
          </Link>
        </p>
      ) : (
        <>
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <label htmlFor="selected-student" className="block text-sm font-medium text-fg">
              {copy.selectStudentLabel}
            </label>
            <select
              id="selected-student"
              data-testid="selected-student"
              value={selectedStudentId}
              onChange={(event) => {
                void selectStudent(event.target.value);
              }}
              className="mt-1.5 w-full max-w-md rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {studentDisplayName(student)}
                </option>
              ))}
            </select>
          </section>

          {selectedStudentId && dashTab === "classes" ? (
            <>
              <StudentSchedulePanel
                key={`${selectedStudentId}-${selectedSchedule?.weekday ?? "x"}-${selectedSchedule?.timeLocal ?? "none"}-${selectedSchedule?.horizonWeeks ?? "h"}-${selectedSchedule?.active ? "1" : "0"}`}
                studentId={selectedStudentId}
                schedule={selectedSchedule}
                saving={busyKey === "schedule"}
                copy={copy}
                onSave={handleSaveSchedule}
              />

              <ClassMonthCalendar
                key={selectedStudentId}
                sessions={sessions}
                locale={locale as "es" | "en" | "pl"}
                timeZone={selectedSchedule?.timezone ?? "Europe/Warsaw"}
                copy={copy}
              />

              <ClassSessionTable
                sessions={sessions}
                locale={locale as "es" | "en" | "pl"}
                mode="teacher"
                savingSessionId={
                  busyKey &&
                  !["schedule", "add-class", "extra"].includes(busyKey) &&
                  !busyKey.startsWith("delete:")
                    ? busyKey
                    : null
                }
                addingClass={busyKey === "add-class"}
                timeZone={selectedSchedule?.timezone ?? "Europe/Warsaw"}
                copy={{
                  classesTitle: copy.classesTableTitle,
                  classesEmpty: copy.classesEmpty,
                  upcomingTitle: copy.upcomingTitle,
                  pastTitle: copy.pastTitle,
                  homeworkLabel: copy.homeworkLabel,
                  homeworkPlaceholder: copy.homeworkPlaceholder,
                  saveHomeworkButton: copy.saveHomeworkButton,
                  scheduledAtLabel: copy.scheduledAtLabel,
                  joinMeetLabel: copy.meetUrlLabel,
                  statusLabel: copy.homeworkStatusLabel,
                  statusPending: copy.statusPending,
                  statusDone: copy.statusDone,
                  statusNotDone: copy.statusNotDone,
                  statusPartial: copy.statusPartial,
                  addClassLabel: copy.addClassLabel,
                  addClassButton: copy.addClassButton,
                }}
                onSaveHomework={handleSaveHomework}
                onStatusChange={handleStatusChange}
                onAddClass={handleAddClass}
              />
            </>
          ) : null}

          {selectedStudentId && dashTab === "extras" ? (
              <section className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-fg">{copy.extrasTitle}</h2>
                <p className="mt-2 text-sm text-fg-muted">{copy.extrasHint}</p>
                <form onSubmit={handleAddExtra} className="mt-5 space-y-4">
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
                    <label
                      htmlFor="material-description"
                      className="block text-sm font-medium text-fg"
                    >
                      {copy.descriptionLabel}
                    </label>
                    <textarea
                      id="material-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={4}
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
                    <p className="mt-1 text-xs text-fg-faint">{copy.urlOptionalHint}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={busyKey !== null}
                    className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
                  >
                    {copy.addButton}
                  </button>
                </form>

                {extras.length === 0 ? (
                  <p className="mt-6 text-sm text-fg-muted">{copy.extrasEmpty}</p>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {extras.map((material) => (
                      <li
                        key={material.id}
                        className="flex flex-col gap-3 rounded-xl border border-border bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-from/20 text-accent">
                            <MaterialKindIcon
                              kind={detectMaterialKind(material.url)}
                              size={18}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-fg">{material.title}</p>
                            {material.description ? (
                              <p className="mt-1 whitespace-pre-wrap text-sm text-fg-muted">
                                {material.description}
                              </p>
                            ) : null}
                            {material.url ? (
                              <p className="mt-1 truncate text-xs text-fg-faint">
                                {material.url}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteExtra(material.id)}
                          disabled={busyKey !== null}
                          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-60"
                        >
                          {copy.deleteLabel}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
          ) : null}
        </>
      )}

      {message ? <p className="mt-6 text-sm text-accent">{message}</p> : null}
      {error ? (
        <p className="mt-6 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
