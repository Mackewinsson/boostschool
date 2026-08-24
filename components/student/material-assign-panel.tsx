"use client";

import { Check, Users } from "lucide-react";
import type { StudentContent } from "@/lib/student-content/types";
import type { Assignment, CompletionStatus, StudentSummary } from "@/lib/materials/types";

type MaterialAssignPanelProps = {
  materialId: string;
  students: StudentSummary[];
  assignments: Assignment[];
  saving: boolean;
  copy: Pick<
    StudentContent["teacher"],
    | "assignHint"
    | "assignAllLabel"
    | "homeworkStatusLabel"
    | "statusPending"
    | "statusDone"
    | "statusNotDone"
    | "statusPartial"
    | "noStudents"
  >;
  onToggle: (materialId: string, studentId: string, assigned: boolean) => void;
  onAssignAll: (materialId: string) => void;
  onStatusChange: (
    materialId: string,
    studentId: string,
    status: CompletionStatus | null,
  ) => void;
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
  onStatusChange,
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
        assignment.materialId === materialId && assignment.userId === student.id,
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

      <ul className="mt-3 space-y-2">
        {students.map((student) => {
          const assignment = assignments.find(
            (item) => item.materialId === materialId && item.userId === student.id,
          );
          const assigned = Boolean(assignment);
          const name = studentDisplayName(student);

          return (
            <li
              key={student.id}
              className={`rounded-lg border px-3 py-2.5 ${
                assigned
                  ? "border-accent/40 bg-accent/10"
                  : "border-border"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onToggle(materialId, student.id, assigned)}
                  aria-pressed={assigned}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm transition disabled:opacity-60"
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
                    <span className="block truncate font-medium text-fg">{name}</span>
                    {name !== student.email ? (
                      <span className="block truncate text-xs text-fg-faint">
                        {student.email}
                      </span>
                    ) : null}
                  </span>
                </button>

                {assigned ? (
                  <label className="flex items-center gap-2 text-xs text-fg-muted">
                    <span className="whitespace-nowrap">{copy.homeworkStatusLabel}</span>
                    <select
                      value={assignment?.completionStatus ?? ""}
                      disabled={saving}
                      onChange={(event) => {
                        const value = event.target.value;
                        const status =
                          value === ""
                            ? null
                            : (value as CompletionStatus);
                        onStatusChange(materialId, student.id, status);
                      }}
                      className="rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs text-fg focus:border-accent/50 focus:outline-none"
                    >
                      <option value="">{copy.statusPending}</option>
                      <option value="done">{copy.statusDone}</option>
                      <option value="not_done">{copy.statusNotDone}</option>
                      <option value="partial">{copy.statusPartial}</option>
                    </select>
                  </label>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
