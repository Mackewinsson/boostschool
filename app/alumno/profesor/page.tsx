import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/student/teacher-dashboard";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

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
  return (
    <TeacherDashboard
      copy={teacher}
      locale={locale}
      initialStudentId={initialStudentId}
    />
  );
}
