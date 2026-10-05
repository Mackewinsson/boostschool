"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminButton } from "@/components/admin/admin-button";
import { ParentStudentPicker } from "@/components/admin/parent-student-picker";
import type { StudentContent } from "@/lib/student-content/types";

type RosterStudent = {
  id: string;
  name: string;
  email: string;
};

type CreateStudentParentPanelProps = {
  copy: StudentContent["teacher"];
  students: RosterStudent[];
  onCreated?: () => void;
};

export function CreateStudentParentPanel({
  copy,
  students,
  onCreated,
}: CreateStudentParentPanelProps) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");
  const [parentStudentIds, setParentStudentIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"student" | "parent" | null>(null);
  const router = useRouter();

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

    setBusy("student");
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
      onCreated?.();
      router.refresh();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusy(null);
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
    if (parentStudentIds.length === 0) {
      setError(copy.errorParentStudent);
      return;
    }

    setBusy("parent");
    try {
      const response = await fetch("/api/alumno/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parentName,
          email: parentEmail,
          password: parentPassword,
          studentIds: parentStudentIds,
        }),
      });
      if (!response.ok) {
        setError(copy.errorGeneric);
        return;
      }
      setParentName("");
      setParentEmail("");
      setParentPassword("");
      setParentStudentIds([]);
      setMessage(copy.successParentCreated);
      onCreated?.();
      router.refresh();
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="admin-card">
        <h2 className="admin-section-title">{copy.createStudentTitle}</h2>
        <form onSubmit={handleCreateStudent} className="admin-form">
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-student-name">
              {copy.studentNameLabel}
            </label>
            <input
              id="roster-student-name"
              className="admin-input"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder={copy.studentNamePlaceholder}
              required
              minLength={2}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-student-email">
              {copy.studentEmailLabel}
            </label>
            <input
              id="roster-student-email"
              className="admin-input"
              type="email"
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
              placeholder={copy.studentEmailPlaceholder}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-student-password">
              {copy.studentPasswordLabel}
            </label>
            <input
              id="roster-student-password"
              className="admin-input"
              type="password"
              value={studentPassword}
              onChange={(event) => setStudentPassword(event.target.value)}
              placeholder={copy.studentPasswordPlaceholder}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <AdminButton type="submit" disabled={busy !== null}>
            {copy.createStudentButton}
          </AdminButton>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title">{copy.createParentTitle}</h2>
        <form onSubmit={handleCreateParent} className="admin-form">
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-parent-name">
              {copy.parentNameLabel}
            </label>
            <input
              id="roster-parent-name"
              className="admin-input"
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              placeholder={copy.parentNamePlaceholder}
              required
              minLength={2}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-parent-email">
              {copy.parentEmailLabel}
            </label>
            <input
              id="roster-parent-email"
              className="admin-input"
              type="email"
              value={parentEmail}
              onChange={(event) => setParentEmail(event.target.value)}
              placeholder={copy.parentEmailPlaceholder}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="roster-parent-password">
              {copy.parentPasswordLabel}
            </label>
            <input
              id="roster-parent-password"
              className="admin-input"
              type="password"
              value={parentPassword}
              onChange={(event) => setParentPassword(event.target.value)}
              placeholder={copy.parentPasswordPlaceholder}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <ParentStudentPicker
            label={copy.parentStudentLabel}
            hint={copy.usersStudentLinkHint}
            emptyLabel={copy.usersStudentLinkEmpty}
            students={students}
            selectedIds={parentStudentIds}
            onChange={setParentStudentIds}
          />
          <AdminButton type="submit" disabled={busy !== null || students.length === 0}>
            {copy.createParentButton}
          </AdminButton>
        </form>
      </section>

      {message ? <p className="text-sm text-accent lg:col-span-2">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-400 lg:col-span-2" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
