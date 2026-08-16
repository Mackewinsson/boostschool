import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TeacherNav } from "@/components/student/teacher-nav";
import { canAccessTeacherWorkspace } from "@/lib/admin/auth";
import { getAuthContext } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export default async function TeacherWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAuthContext();
  const user = await currentUser();

  if (!context) {
    redirect("/sign-in");
  }

  if (!canAccessTeacherWorkspace(user)) {
    redirect("/alumno");
  }

  const locale = await getLocaleFromCookies();
  const { teacher } = getStudentContent(locale);

  return (
    <>
      <TeacherNav copy={teacher} />
      {children}
    </>
  );
}
