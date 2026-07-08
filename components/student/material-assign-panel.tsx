"use client";

import { Check, Users } from "lucide-react";
import type { StudentContent } from "@/lib/student-content/types";
import type { Assignment, StudentSummary } from "@/lib/materials/types";

type MaterialAssignPanelProps = {
  materialId: string;
  students: StudentSummary[];
  assignments: Assignment[];
  saving: boolean;
  copy: Pick<
    StudentContent["teacher"],
    "assignHint" | "assignAllLabel" | "completedLabel" | "noStudents"
  >;
  onToggle: (materialId: string, studentId: string, assigned: boolean) => void;
  onAssignAll: (materialId: string) => void;
};

function studentDisplayName(student: StudentSummary): string {
  const name = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();
  return name || student.email;
}

export function MaterialAssignPanel({
  materialId,
  students,
  assignments,
  saving,
  copy,
  onToggle,
  onAssignAll,
}: MaterialAssignPanelProps) {
  if (students.length === 0) {
    return (
      <div className="mt-3 rounded-xl border border-border bg-canvas p-4 text-sm text-fg-muted">
        {copy.noStudents}
      </div>
    );
  }

  const allAssigned = students.every((student) =>
    assignments.some(
      (assignment) =>
        assignment.materialId === materialId && assignment.clerkUserId === student.id,
    ),
  );

  return (
    <div className="mt-3 rounded-xl border border-border bg-canvas p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg-muted">{copy.assignHint}</p>
        {!allAssigned ? (
          <button
            type="button"
            onClick={() => onAssignAll(materialId)}
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-60"
          >
            <Users size={13} aria-hidden="true" />
            {copy.assignAllLabel}
          </button>
        ) : null}
      </div>

      <ul className="mt-3 space-y-1.5">
        {students.map((student) => {
          const assignment = assignments.find(
            (item) => item.materialId === materialId && item.clerkUserId === student.id,
          );
          const assigned = Boolean(assignment);
          const completed = Boolean(assignment?.completedAt);
          const name = studentDisplayName(student);

          return (
            <li key={student.id}>
              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(materialId, student.id, assigned)}
                aria-pressed={assigned}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition disabled:opacity-60 ${
                  assigned
                    ? "border-accent/40 bg-accent/10 text-fg"
                    : "border-border text-fg-muted hover:border-brand-from/30"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    assigned
                      ? "border-accent bg-accent text-canvas"
                      : "border-border bg-transparent"
                  }`}
                >
                  {assigned ? <Check size={13} strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{name}</span>
                  {name !== student.email ? (
                    <span className="block truncate text-xs text-fg-faint">
                      {student.email}
                    </span>
                  ) : null}
                </span>
                {completed ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent">
                    <Check size={13} aria-hidden="true" />
                    {copy.completedLabel}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
