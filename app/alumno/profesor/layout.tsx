import { redirect } from "next/navigation";
import { TeacherNav } from "@/components/student/teacher-nav";
import { canAccessTeacherWorkspace, isAdminUser } from "@/lib/admin/auth";
import { getAuthContext } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export default async function TeacherWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAuthContext();

  if (!context) {
    redirect("/sign-in");
  }

  if (!canAccessTeacherWorkspace(context.role)) {
    redirect("/alumno");
  }

  const locale = await getLocaleFromCookies();
  const { teacher } = getStudentContent(locale);

  return (
    <>
      <TeacherNav copy={teacher} showUsersNav={isAdminUser(context.role)} />
      {children}
    </>
  );
}
