import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/student/student-dashboard";
import { getAuthContext } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getStudentContent(locale);

  return {
    title: metadata.studentTitle,
    description: metadata.studentDescription,
    robots: { index: false, follow: false },
  };
}

export default async function AlumnoPage() {
  const locale = await getLocaleFromCookies();
  const context = await getAuthContext();

  if (context?.role === "teacher") {
    redirect("/alumno/profesor");
  }

  const { student } = getStudentContent(locale);
  return <StudentDashboard copy={student} />;
}
