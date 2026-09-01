import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { isAdminUser, requireAdminUser } from "@/lib/admin/auth";
import { listStudents, listUsers } from "@/lib/auth/users";
import type { UserRole } from "@/lib/auth/constants";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getAuthContext } from "@/lib/materials/auth";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { getStudentContent } from "@/lib/student-content";
import { teacherPaths } from "@/lib/teacher/paths";
import { UserRoleFields } from "@/components/admin/user-role-fields";
import { createManagedUserAction } from "./actions";
import { managedUserFormError } from "./form-errors";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

function roleLabel(
  role: UserRole,
  copy: ReturnType<typeof getStudentContent>["teacher"],
): string {
  if (role === "admin") return copy.usersRoleAdmin;
  if (role === "teacher") return copy.usersRoleTeacher;
  if (role === "parent") return copy.usersRoleParent;
  return copy.usersRoleStudent;
}

export default async function TeacherUsersPage({ searchParams }: PageProps) {
  const context = await getAuthContext();
  if (!context || !isAdminUser(context.role)) {
    redirect(teacherPaths.home);
  }
  await requireAdminUser();

  const locale = await getLocaleFromCookies();
  const { teacher: copy } = getStudentContent(locale);
  const params = await searchParams;

  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.usersTitle}
        </h1>
        <p className="mt-3 text-base text-fg-muted">DATABASE_URL no esta configurada.</p>
      </div>
    );
  }

  const [users, students] = await Promise.all([listUsers(), listStudents()]);

  const errorMessage = managedUserFormError(params.error, copy);

  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {copy.usersTitle}
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.usersSubtitle}</p>

      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="admin-grid mt-8">
        <div className="admin-card admin-card--flush">
          <div style={{ padding: "1.25rem 1.5rem" }}>
            <h2 className="admin-section-title" style={{ marginBottom: 0 }}>
              {copy.usersTitle} ({users.length})
            </h2>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>{copy.usersNameLabel}</th>
                <th>{copy.usersEmailLabel}</th>
                <th>{copy.usersRoleLabel}</th>
                <th>{copy.usersActiveLabel}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--fg-muted)" }}>
                    {copy.usersEmpty}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="admin-row-clickable">
                    <td colSpan={4} style={{ padding: 0 }}>
                      <Link
                        href={teacherPaths.user(user.id)}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 1.4fr 0.8fr 0.7fr",
                          padding: 0,
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                          {user.name}
                        </span>
                        <span
                          style={{
                            padding: "0.85rem 1rem",
                            color: "var(--fg-muted)",
                          }}
                        >
                          {user.email}
                        </span>
                        <span style={{ padding: "0.85rem 1rem" }}>
                          {roleLabel(user.role, copy)}
                        </span>
                        <span style={{ padding: "0.85rem 1rem" }}>
                          <span
                            className={
                              user.active
                                ? "admin-badge admin-badge--active"
                                : "admin-badge"
                            }
                          >
                            {user.active
                              ? copy.usersStatusActive
                              : copy.usersStatusInactive}
                          </span>
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card admin-sticky-sidebar">
          <h2 className="admin-section-title">{copy.usersCreateTitle}</h2>
          <form
            action={createManagedUserAction}
            className="admin-form"
            data-testid="user-create-form"
          >
            <div className="admin-field">
              <label className="admin-label" htmlFor="user-name">
                {copy.usersNameLabel}
              </label>
              <input
                id="user-name"
                className="admin-input"
                name="name"
                required
                minLength={2}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="user-email">
                {copy.usersEmailLabel}
              </label>
              <input
                id="user-email"
                className="admin-input"
                name="email"
                type="email"
                required
              />
            </div>
            <UserRoleFields
              copy={copy}
              roleFieldId="user-role"
              studentFieldId="user-student"
              defaultRole="student"
              students={students}
            />
            <div className="admin-field">
              <label className="admin-label" htmlFor="user-password">
                {copy.usersPasswordLabel}
              </label>
              <input
                id="user-password"
                className="admin-input"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="admin-muted" style={{ margin: "0.35rem 0 0" }}>
                {copy.usersPasswordHint}
              </p>
            </div>
            <label className="admin-check">
              <input type="checkbox" name="active" defaultChecked />
              {copy.usersActiveLabel}
            </label>
            <AdminButton type="submit">{copy.usersCreateButton}</AdminButton>
          </form>
        </div>
      </div>
    </div>
  );
}
