"use client";

import { useEffect, useMemo, useState } from "react";
import type { StudentContent } from "@/lib/student-content/types";
import { detectMaterialKind } from "@/lib/materials/material-kind";
import { splitSessionsAndExtras } from "@/lib/materials/schedule-groups";
import type {
  Assignment,
  CompletionStatus,
  Material,
  StudentClassSchedule,
  StudentSummary,
} from "@/lib/materials/types";
import { ClassSessionTable } from "./class-session-table";
import { MaterialKindIcon } from "./material-kind-icon";
import { StudentSchedulePanel } from "./student-schedule-panel";

type TeacherDashboardProps = {
  copy: StudentContent["teacher"];
  locale: string;
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

export function TeacherDashboard({ copy, locale }: TeacherDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [schedules, setSchedules] = useState<StudentClassSchedule[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");
  const [parentStudentId, setParentStudentId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  async function loadData() {
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
    if (studentsRes.ok) {
      const data = (await studentsRes.json()) as { students?: StudentSummary[] };
      const nextStudents = data.students ?? [];
      setStudents(nextStudents);
      setSelectedStudentId((current) => {
        if (current && nextStudents.some((student) => student.id === current)) {
          return current;
        }
        return nextStudents[0]?.id ?? "";
      });
    }
    if (assignmentsRes.ok) {
      const data = (await assignmentsRes.json()) as { assignments?: Assignment[] };
      setAssignments(data.assignments ?? []);
    }
    if (schedulesRes.ok) {
      const data = (await schedulesRes.json()) as { schedules?: StudentClassSchedule[] };
      setSchedules(data.schedules ?? []);
    }
    setLoading(false);
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

  async function handleCreateStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (studentName.trim().length < 2) {
      setError(copy.errorStudentName);
      return;
    }
    if (!studentEmail.trim() || !studentEmail.includes("@")) {
      setError(copy.errorStudentEmail);
      return;
    }
    if (studentPassword.length < 8) {
      setError(copy.errorStudentPassword);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/alumno/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
      setMessage(copy.successStudentCreated);
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateParent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (parentName.trim().length < 2) {
      setError(copy.errorParentName);
      return;
    }
    if (!parentEmail.trim() || !parentEmail.includes("@")) {
      setError(copy.errorParentEmail);
      return;
    }
    if (parentPassword.length < 8) {
      setError(copy.errorParentPassword);
      return;
    }
    if (!parentStudentId) {
      setError(copy.errorParentStudent);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/alumno/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parentName,
          email: parentEmail,
          password: parentPassword,
          studentId: parentStudentId,
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setParentName("");
      setParentEmail("");
      setParentPassword("");
      setParentStudentId("");
      setMessage(copy.successParentCreated);
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSchedule(input: {
    studentUserId: string;
    weekday: number | null;
    timeLocal: string | null;
    meetUrl: string;
    active: boolean;
  }) {
    setError(null);
    setMessage(null);
    setSaving(true);
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
      setMessage(copy.scheduleSaved);
      await loadData();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddClass(scheduledAt: string) {
    if (!selectedStudentId) return;
    setError(null);
    setMessage(null);
    if (!scheduledAt) {
      setError(copy.errorClassDate);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/alumno/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentUserId: selectedStudentId,
          scheduledAt: new Date(scheduledAt).toISOString(),
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
      setSaving(false);
    }
  }

  async function handleSaveHomework(
    sessionId: string,
    homework: string,
    scheduledAtLocal: string,
  ) {
    const session = materials.find((item) => item.id === sessionId);
    if (!session) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const scheduledAt = scheduledAtLocal
        ? new Date(scheduledAtLocal).toISOString()
        : session.scheduledAt;
      const response = await fetch(`/api/alumno/materials/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: session.title,
          description: homework,
          url: session.url ?? "",
          scheduledAt,
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
      setSaving(false);
    }
  }

  async function handleStatusChange(
    sessionId: string,
    status: CompletionStatus | null,
  ) {
    if (!selectedStudentId) return;
    setError(null);
    setMessage(null);
    setSaving(true);
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
      setSaving(false);
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

    setSaving(true);
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
      setSaving(false);
    }
  }

  async function handleDeleteExtra(id: string) {
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

  if (loading) {
    return <p className="mt-10 text-sm text-fg-muted">…</p>;
  }

  return (
    <>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.subtitle}</p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-fg">{copy.createStudentTitle}</h2>
        <form onSubmit={handleCreateStudent} className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="student-name" className="block text-sm font-medium text-fg">
              {copy.studentNameLabel}
            </label>
            <input
              id="student-name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder={copy.studentNamePlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="student-email" className="block text-sm font-medium text-fg">
              {copy.studentEmailLabel}
            </label>
            <input
              id="student-email"
              type="email"
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
              placeholder={copy.studentEmailPlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="student-password" className="block text-sm font-medium text-fg">
              {copy.studentPasswordLabel}
            </label>
            <input
              id="student-password"
              type="password"
              value={studentPassword}
              onChange={(event) => setStudentPassword(event.target.value)}
              placeholder={copy.studentPasswordPlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
            >
              {copy.createStudentButton}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-fg">{copy.createParentTitle}</h2>
        <form onSubmit={handleCreateParent} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="parent-name" className="block text-sm font-medium text-fg">
              {copy.parentNameLabel}
            </label>
            <input
              id="parent-name"
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              placeholder={copy.parentNamePlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="parent-email" className="block text-sm font-medium text-fg">
              {copy.parentEmailLabel}
            </label>
            <input
              id="parent-email"
              type="email"
              value={parentEmail}
              onChange={(event) => setParentEmail(event.target.value)}
              placeholder={copy.parentEmailPlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="parent-password" className="block text-sm font-medium text-fg">
              {copy.parentPasswordLabel}
            </label>
            <input
              id="parent-password"
              type="password"
              value={parentPassword}
              onChange={(event) => setParentPassword(event.target.value)}
              placeholder={copy.parentPasswordPlaceholder}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="parent-student" className="block text-sm font-medium text-fg">
              {copy.parentStudentLabel}
            </label>
            <select
              id="parent-student"
              value={parentStudentId}
              onChange={(event) => setParentStudentId(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
            >
              <option value="">{copy.parentStudentLabel}</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {studentDisplayName(student)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving || students.length === 0}
              className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
            >
              {copy.createParentButton}
            </button>
          </div>
        </form>
      </section>

      {students.length === 0 ? (
        <p className="mt-10 text-sm text-fg-muted">{copy.noStudents}</p>
      ) : (
        <>
          <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <label htmlFor="selected-student" className="block text-sm font-medium text-fg">
              {copy.selectStudentLabel}
            </label>
            <select
              id="selected-student"
              data-testid="selected-student"
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="mt-1.5 w-full max-w-md rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {studentDisplayName(student)}
                </option>
              ))}
            </select>
          </section>

          {selectedStudentId ? (
            <>
              <StudentSchedulePanel
                key={selectedStudentId}
                studentId={selectedStudentId}
                schedule={selectedSchedule}
                saving={saving}
                copy={copy}
                onSave={handleSaveSchedule}
              />

              <ClassSessionTable
                sessions={sessions}
                locale={locale as "es" | "en" | "pl"}
                mode="teacher"
                saving={saving}
                copy={{
                  classesTitle: copy.classesTableTitle,
                  classesEmpty: copy.classesEmpty,
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

              <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
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
                    disabled={saving}
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
            </>
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
