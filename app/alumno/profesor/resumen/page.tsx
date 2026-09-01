import type { Metadata } from "next";
import { TeacherAnalyticsDashboard } from "@/components/student/teacher-analytics";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { getStudentContent } from "@/lib/student-content";
import { getTeacherAnalytics } from "@/lib/teacher/analytics";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { teacher } = getStudentContent(locale);

  return {
    title: teacher.analyticsTitle,
    robots: { index: false, follow: false },
  };
}

export default async function TeacherAnalyticsPage() {
  const locale = await getLocaleFromCookies();
  const { teacher: copy } = getStudentContent(locale);

  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.analyticsTitle}
        </h1>
        <p className="mt-3 text-base text-fg-muted">
          DATABASE_URL no esta configurada.
        </p>
      </div>
    );
  }

  const data = await getTeacherAnalytics();

  return (
    <TeacherAnalyticsDashboard data={data} copy={copy} locale={locale} />
  );
}
