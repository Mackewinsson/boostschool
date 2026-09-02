import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ParentDashboard } from "@/components/student/parent-dashboard";
import { StudentDashboard } from "@/components/student/student-dashboard";
import { canAccessTeacherRole, getAuthContext } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getStudentContent(locale);
  const context = await getAuthContext();
  const isParent = context?.role === "parent";

  return {
    title: isParent ? metadata.parentTitle : metadata.studentTitle,
    description: isParent ? metadata.parentDescription : metadata.studentDescription,
    robots: { index: false, follow: false },
  };
}

export default async function AlumnoPage() {
  const locale = await getLocaleFromCookies();
  const context = await getAuthContext();

  if (context && canAccessTeacherRole(context.role)) {
    redirect("/alumno/profesor");
  }

  const { student, parent, portal } = getStudentContent(locale);
  const account = {
    accountTitle: portal.accountTitle,
    accountHint: portal.accountHint,
    accountNavLabel: portal.accountNavLabel,
  };

  if (context?.role === "parent") {
    return (
      <ParentDashboard
        copy={parent}
        tableCopy={student}
        locale={locale}
        account={account}
      />
    );
  }

  return <StudentDashboard copy={student} locale={locale} account={account} />;
}
