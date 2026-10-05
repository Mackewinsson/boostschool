"use client";

import { useState } from "react";
import type { UserRole } from "@/lib/auth/constants";
import type { StudentSummary } from "@/lib/materials/types";
import type { StudentContent } from "@/lib/student-content/types";
import { ParentStudentPicker } from "./parent-student-picker";

type UserRoleFieldsProps = {
  copy: StudentContent["teacher"];
  roleFieldId: string;
  defaultRole: UserRole;
  defaultStudentIds?: string[];
  roleDisabled?: boolean;
  lockedRole?: UserRole;
  students: StudentSummary[];
};

export function UserRoleFields({
  copy,
  roleFieldId,
  defaultRole,
  defaultStudentIds = [],
  roleDisabled = false,
  lockedRole,
  students,
}: UserRoleFieldsProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [selectedStudentIds, setSelectedStudentIds] = useState(defaultStudentIds);
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
        <ParentStudentPicker
          label={copy.usersStudentLinkLabel}
          hint={copy.usersStudentLinkHint}
          emptyLabel={copy.usersStudentLinkEmpty}
          students={students}
          selectedIds={selectedStudentIds}
          onChange={setSelectedStudentIds}
        />
      ) : null}
    </>
  );
}
