import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TeacherDashboard } from "@/components/student/teacher-dashboard";
import { getAuthContext } from "@/lib/materials/auth";
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

export default async function TeacherPage() {
  const locale = await getLocaleFromCookies();
  const context = await getAuthContext();

  if (!context || context.role !== "teacher") {
    redirect("/alumno");
  }

  const { teacher } = getStudentContent(locale);
  return <TeacherDashboard copy={teacher} />;
}
