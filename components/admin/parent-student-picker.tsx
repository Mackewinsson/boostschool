"use client";

import type { StudentSummary } from "@/lib/materials/types";

type StudentOption = Pick<StudentSummary, "id" | "name" | "email"> &
  Partial<Pick<StudentSummary, "firstName" | "lastName">>;

type ParentStudentPickerProps = {
  label: string;
  hint: string;
  emptyLabel: string;
  students: StudentOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  inputName?: string;
};

function studentLabel(student: StudentOption): string {
  const name =
    student.name?.trim() ||
    [student.firstName, student.lastName].filter(Boolean).join(" ");
  return name ? `${name} (${student.email})` : student.email;
}

export function ParentStudentPicker({
  label,
  hint,
  emptyLabel,
  students,
  selectedIds,
  onChange,
  inputName = "studentIds",
}: ParentStudentPickerProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
      return;
    }
    onChange([...selectedIds, id]);
  }

  return (
    <fieldset
      className="admin-field"
      data-testid="user-student-link"
      style={{ border: 0, margin: 0, padding: 0 }}
    >
      <legend className="admin-label">{label}</legend>
      {students.length > 0 ? (
        <>
          <p className="admin-muted" style={{ margin: 0 }}>
            {hint}
          </p>
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-border bg-canvas p-3">
            {students.map((student) => (
              <label
                key={student.id}
                className="admin-check"
                style={{ marginBottom: 0 }}
              >
                <input
                  type="checkbox"
                  name={inputName}
                  value={student.id}
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggle(student.id)}
                />
                {studentLabel(student)}
              </label>
            ))}
          </div>
        </>
      ) : (
        <p className="admin-muted" style={{ margin: 0 }}>
          {emptyLabel}
        </p>
      )}
    </fieldset>
  );
}
