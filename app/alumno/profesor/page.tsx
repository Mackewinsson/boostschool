import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/student/teacher-dashboard";
import { isAdminUser } from "@/lib/admin/auth";
import { getAuthContext } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { teacherPaths } from "@/lib/teacher/paths";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getStudentContent(locale);

  return {
    title: metadata.teacherTitle,
    description: metadata.teacherDescription,
    robots: { index: false, follow: false },
  };
}

type PageProps = {
  searchParams: Promise<{ student?: string }>;
};

export default async function TeacherPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromCookies();
  const { teacher } = getStudentContent(locale);
  const params = await searchParams;
  const initialStudentId = params.student?.trim() || undefined;
  const context = await getAuthContext();
  const accountsHref = isAdminUser(context?.role)
    ? teacherPaths.users
    : teacherPaths.students;
  return (
    <TeacherDashboard
      copy={teacher}
      locale={locale}
      initialStudentId={initialStudentId}
      accountsHref={accountsHref}
    />
  );
}
