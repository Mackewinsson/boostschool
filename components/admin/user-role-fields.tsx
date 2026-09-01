"use client";

import { useState } from "react";
import type { UserRole } from "@/lib/auth/constants";
import type { StudentSummary } from "@/lib/materials/types";
import type { StudentContent } from "@/lib/student-content/types";

type UserRoleFieldsProps = {
  copy: StudentContent["teacher"];
  roleFieldId: string;
  studentFieldId: string;
  defaultRole: UserRole;
  defaultStudentId?: string;
  roleDisabled?: boolean;
  lockedRole?: UserRole;
  students: StudentSummary[];
};

function studentLabel(student: StudentSummary): string {
  const name = student.name?.trim() || [student.firstName, student.lastName].filter(Boolean).join(" ");
  return name ? `${name} (${student.email})` : student.email;
}

export function UserRoleFields({
  copy,
  roleFieldId,
  studentFieldId,
  defaultRole,
  defaultStudentId = "",
  roleDisabled = false,
  lockedRole,
  students,
}: UserRoleFieldsProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const showStudentLink = role === "parent";

  return (
    <>
      <div className="admin-field">
        <label className="admin-label" htmlFor={roleFieldId}>
          {copy.usersRoleLabel}
        </label>
        <select
          id={roleFieldId}
          className="admin-input"
          name="role"
          value={role}
          disabled={roleDisabled}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          <option value="admin">{copy.usersRoleAdmin}</option>
          <option value="teacher">{copy.usersRoleTeacher}</option>
          <option value="student">{copy.usersRoleStudent}</option>
          <option value="parent">{copy.usersRoleParent}</option>
        </select>
        {roleDisabled && lockedRole ? (
          <input type="hidden" name="role" value={lockedRole} />
        ) : null}
      </div>

      {showStudentLink ? (
        <div className="admin-field" data-testid="user-student-link">
          <label className="admin-label" htmlFor={studentFieldId}>
            {copy.usersStudentLinkLabel}
          </label>
          {students.length > 0 ? (
            <select
              id={studentFieldId}
              className="admin-input"
              name="studentId"
              required
              defaultValue={defaultStudentId}
            >
              <option value="">—</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {studentLabel(student)}
                </option>
              ))}
            </select>
          ) : (
            <p className="admin-muted" style={{ margin: 0 }}>
              {copy.usersStudentLinkEmpty}
            </p>
          )}
        </div>
      ) : null}
    </>
  );
}
