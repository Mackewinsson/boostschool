import Link from "next/link";
import { AdminButton } from "@/components/admin/admin-button";
import { CreateStudentParentPanel } from "@/components/admin/create-student-parent-panel";
import { isAdminUser } from "@/lib/admin/auth";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getAuthContext } from "@/lib/materials/auth";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { listStudentRoster } from "@/lib/materials/student-roster";
import { getStudentContent } from "@/lib/student-content";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";

export const dynamic = "force-dynamic";

function weekdayLabel(
  weekday: number | null,
  copy: StudentContent["teacher"],
): string {
  if (weekday === 0) return copy.weekdaySunday;
  if (weekday === 1) return copy.weekdayMonday;
  if (weekday === 2) return copy.weekdayTuesday;
  if (weekday === 3) return copy.weekdayWednesday;
  if (weekday === 4) return copy.weekdayThursday;
  if (weekday === 5) return copy.weekdayFriday;
  if (weekday === 6) return copy.weekdaySaturday;
  return "";
}

function formatSchedule(
  weekday: number | null,
  timeLocal: string | null,
  scheduleActive: boolean,
  copy: StudentContent["teacher"],
): string {
  if (weekday == null || !timeLocal) {
    return copy.studentsNoSchedule;
  }
  const day = weekdayLabel(weekday, copy);
  const base = `${day} ${timeLocal}`;
  return scheduleActive ? base : `${base} (${copy.usersStatusInactive})`;
}

export default async function TeacherStudentsPage() {
  const locale = await getLocaleFromCookies();
  const { teacher: copy } = getStudentContent(locale);
  const context = await getAuthContext();
  const isAdmin = isAdminUser(context?.role);

  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.studentsTitle}
        </h1>
        <p className="mt-3 text-base text-fg-muted">DATABASE_URL no esta configurada.</p>
      </div>
    );
  }

  const students = await listStudentRoster();

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {copy.studentsTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.studentsSubtitle}</p>
        </div>
        {isAdmin ? (
          <AdminButton href={teacherPaths.users}>{copy.studentsCreateCta}</AdminButton>
        ) : null}
      </div>

      {!isAdmin ? (
        <CreateStudentParentPanel
          copy={copy}
          students={students.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
          }))}
        />
      ) : null}

      <div className="admin-card admin-card--flush mt-8">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.studentsNameLabel}</th>
              <th>{copy.studentsEmailLabel}</th>
              <th>{copy.studentsParentEmailLabel}</th>
              <th>{copy.studentsScheduleLabel}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--fg-muted)" }}>
                  {copy.studentsEmpty}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td style={{ color: "var(--fg-muted)" }}>{student.email}</td>
                  <td style={{ color: "var(--fg-muted)" }}>
                    {student.parentEmails.length > 0
                      ? student.parentEmails.join(", ")
                      : copy.studentsNoParent}
                  </td>
                  <td>
                    {formatSchedule(
                      student.weekday,
                      student.timeLocal,
                      student.scheduleActive,
                      copy,
                    )}
                  </td>
                  <td>
                    <Link
                      href={`${teacherPaths.home}?student=${student.id}`}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                    >
                      {copy.studentsOpenHomework}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
