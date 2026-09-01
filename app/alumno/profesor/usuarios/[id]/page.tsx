import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { isAdminUser, requireAdminUser } from "@/lib/admin/auth";
import { UserRoleFields } from "@/components/admin/user-role-fields";
import { findUserById, getManagedUserById, listStudents } from "@/lib/auth/users";
import type { StudentSummary } from "@/lib/materials/types";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getAuthContext } from "@/lib/materials/auth";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { getStudentContent } from "@/lib/student-content";
import { teacherPaths } from "@/lib/teacher/paths";
import {
  activateManagedUserAction,
  deactivateManagedUserAction,
  updateManagedUserAction,
  updateManagedUserPasswordAction,
} from "../actions";
import { DeleteUserButton } from "../delete-user-button";
import { managedUserFormError } from "../form-errors";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function TeacherUserDetailPage({
  params,
  searchParams,
}: PageProps) {
  const context = await getAuthContext();
  if (!context || !isAdminUser(context.role)) {
    redirect(teacherPaths.home);
  }
  await requireAdminUser();

  const { id } = await params;
  const query = await searchParams;
  const locale = await getLocaleFromCookies();
  const { teacher: copy } = getStudentContent(locale);

  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.usersEditTitle}
        </h1>
        <p className="mt-3 text-base text-fg-muted">DATABASE_URL no esta configurada.</p>
      </div>
    );
  }

  const [user, students] = await Promise.all([
    getManagedUserById(id),
    listStudents(),
  ]);

  if (!user) {
    redirect(teacherPaths.users);
  }

  const studentOptions: StudentSummary[] = students.filter(
    (student) => student.id !== user.id,
  );
  if (
    user.linkedStudentId &&
    user.linkedStudentId !== user.id &&
    !studentOptions.some((student) => student.id === user.linkedStudentId)
  ) {
    const linked = await findUserById(user.linkedStudentId);
    if (linked) {
      studentOptions.unshift({
        id: linked.id,
        email: linked.email,
        name: linked.name,
        firstName: null,
        lastName: null,
      });
    }
  }

  const isSelf = user.id === context.userId;

  const errorMessage = managedUserFormError(query.error, copy);
  const savedMessage =
    query.saved === "password"
      ? copy.usersPasswordUpdated
      : query.saved
        ? copy.successUpdated
        : null;

  return (
    <div>
      <Link
        href={teacherPaths.users}
        className="mt-6 inline-flex text-sm font-medium text-fg-muted transition hover:text-accent"
      >
        ← {copy.usersBackLabel}
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {copy.usersEditTitle}
      </h1>
      <p className="mt-2 text-base text-fg-muted">{user.email}</p>

      {savedMessage ? (
        <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {savedMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="admin-card mt-8 max-w-xl">
        <form action={updateManagedUserAction} className="admin-form">
          <input type="hidden" name="id" value={user.id} />
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-name">
              {copy.usersNameLabel}
            </label>
            <input
              id="edit-name"
              className="admin-input"
              name="name"
              required
              minLength={2}
              defaultValue={user.name}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-email">
              {copy.usersEmailLabel}
            </label>
            <input
              id="edit-email"
              className="admin-input"
              name="email"
              type="email"
              required
              defaultValue={user.email}
            />
          </div>
          <UserRoleFields
            copy={copy}
            roleFieldId="edit-role"
            studentFieldId="edit-student"
            defaultRole={user.role}
            defaultStudentId={user.linkedStudentId ?? ""}
            roleDisabled={isSelf}
            lockedRole={isSelf ? "admin" : undefined}
            students={studentOptions}
          />
          <label className="admin-check">
            <input
              type="checkbox"
              name="active"
              defaultChecked={user.active}
              disabled={isSelf}
            />
            {copy.usersActiveLabel}
          </label>
          {isSelf ? <input type="hidden" name="active" value="on" /> : null}
          <AdminButton type="submit">{copy.usersSaveButton}</AdminButton>
        </form>

        {!isSelf ? (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            {user.active ? (
              <form action={deactivateManagedUserAction}>
                <input type="hidden" name="id" value={user.id} />
                <AdminButton type="submit" variant="secondary">
                  {copy.usersDeactivateButton}
                </AdminButton>
              </form>
            ) : (
              <form action={activateManagedUserAction}>
                <input type="hidden" name="id" value={user.id} />
                <AdminButton type="submit" variant="secondary">
                  {copy.usersActivateButton}
                </AdminButton>
              </form>
            )}
            <DeleteUserButton
              userId={user.id}
              label={copy.usersDeleteButton}
              confirmMessage={copy.usersDeleteConfirm}
            />
          </div>
        ) : null}

        {!isSelf ? (
          <p className="admin-muted mt-3 text-xs">{copy.usersDeleteConfirm}</p>
        ) : null}
      </div>

      <div className="admin-card mt-6 max-w-xl">
        <h2 className="admin-section-title">{copy.usersPasswordSectionTitle}</h2>
        <form
          action={updateManagedUserPasswordAction}
          className="admin-form"
          data-testid="user-password-form"
        >
          <input type="hidden" name="id" value={user.id} />
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-new-password">
              {copy.usersNewPasswordLabel}
            </label>
            <input
              id="edit-new-password"
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
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-password-confirm">
              {copy.usersPasswordConfirmLabel}
            </label>
            <input
              id="edit-password-confirm"
              className="admin-input"
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <AdminButton type="submit">{copy.usersPasswordSaveButton}</AdminButton>
        </form>
      </div>
    </div>
  );
}
