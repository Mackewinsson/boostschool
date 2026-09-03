import dynamic from "next/dynamic";
import type { Locale } from "@/lib/locale";
import type { StudentContent } from "@/lib/student-content/types";
import type { TeacherCalendarSession } from "@/lib/teacher/calendar-sessions";

const ClassMonthCalendar = dynamic(
  () =>
    import("@/components/student/class-month-calendar").then(
      (mod) => mod.ClassMonthCalendar,
    ),
  {
    loading: () => (
      <section
        className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
        data-testid="teacher-overview-calendar-loading"
        aria-hidden
      >
        <div className="h-64 animate-pulse rounded-xl bg-border/40" />
      </section>
    ),
  },
);

type TeacherOverviewCalendarProps = {
  sessions: TeacherCalendarSession[];
  locale: Locale;
  timeZone: string;
  copy: Pick<
    StudentContent["teacher"],
    | "analyticsCalendarTitle"
    | "analyticsCalendarHint"
    | "calendarPrevMonth"
    | "calendarNextMonth"
    | "calendarToday"
    | "calendarEmptyMonth"
    | "calendarMore"
    | "calendarSessionOverviewAria"
  >;
};

export function TeacherOverviewCalendar({
  sessions,
  locale,
  timeZone,
  copy,
}: TeacherOverviewCalendarProps) {
  return (
    <ClassMonthCalendar
      sessions={sessions.map((session) => ({
        id: session.id,
        scheduledAt: session.scheduledAt,
        originalScheduledAt: session.originalScheduledAt,
        studentId: session.studentId,
        studentLabel: session.studentLabel,
      }))}
      locale={locale}
      timeZone={timeZone}
      variant="allStudents"
      copy={{
        calendarTitle: copy.analyticsCalendarTitle,
        calendarHint: copy.analyticsCalendarHint,
        calendarPrevMonth: copy.calendarPrevMonth,
        calendarNextMonth: copy.calendarNextMonth,
        calendarToday: copy.calendarToday,
        calendarEmptyMonth: copy.calendarEmptyMonth,
        calendarMore: copy.calendarMore,
        calendarSessionAria: copy.calendarSessionOverviewAria,
        calendarSessionOverviewAria: copy.calendarSessionOverviewAria,
      }}
    />
  );
}
