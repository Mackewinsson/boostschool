import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { formatScheduledAt } from "@/lib/materials/schedule-groups";
import type { StudentContent } from "@/lib/student-content/types";
import type {
  AnalyticsHomeworkStatus,
  TeacherAnalytics,
} from "@/lib/teacher/analytics";
import type { TeacherCalendarSession } from "@/lib/teacher/calendar-sessions";
import { teacherPaths } from "@/lib/teacher/paths";
import { TeacherOverviewCalendar } from "./teacher-overview-calendar";

type TeacherAnalyticsProps = {
  data: TeacherAnalytics;
  calendarSessions: TeacherCalendarSession[];
  copy: StudentContent["teacher"];
  locale: Locale;
};

function homeworkLabel(
  status: AnalyticsHomeworkStatus,
  copy: StudentContent["teacher"],
): string {
  if (status === "none") return copy.analyticsHomeworkNone;
  if (status === "done") return copy.statusDone;
  if (status === "not_done") return copy.statusNotDone;
  if (status === "partial") return copy.statusPartial;
  return copy.statusPending;
}

function homeworkBadgeClass(status: AnalyticsHomeworkStatus): string {
  if (status === "done") return "admin-badge admin-badge--active";
  return "admin-badge admin-badge--muted";
}

function formatDay(iso: string, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

function barWidth(count: number, total: number): string {
  if (total <= 0 || count <= 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

export function TeacherAnalyticsDashboard({
  data,
  calendarSessions,
  copy,
  locale,
}: TeacherAnalyticsProps) {
  const weekLabel = copy.analyticsWeekRange
    .replace("{start}", formatDay(data.weekStart, locale, data.timeZone))
    .replace(
      "{end}",
      formatDay(
        new Date(new Date(data.weekEnd).getTime() - 1).toISOString(),
        locale,
        data.timeZone,
      ),
    );

  const homeworkTracked =
    data.homeworkDone +
    data.homeworkPending +
    data.homeworkNotDone +
    data.homeworkPartial;

  const stats = [
    { value: data.classesThisWeek, label: copy.analyticsStatClassesWeek },
    { value: data.classesToday, label: copy.analyticsStatClassesToday },
    { value: data.homeworkDone, label: copy.analyticsStatHomeworkDone },
    { value: data.homeworkPending, label: copy.analyticsStatHomeworkPending },
    { value: data.homeworkOverdue, label: copy.analyticsStatHomeworkOverdue },
    { value: data.studentsActive, label: copy.analyticsStatStudents },
    { value: data.studentsNoUpcoming, label: copy.analyticsStatNoUpcoming },
    { value: data.studentsNoParent, label: copy.analyticsStatNoParent },
    { value: data.unreadContacts, label: copy.analyticsStatUnread },
    { value: data.leadsThisWeek, label: copy.analyticsStatLeadsWeek },
  ];

  return (
    <div data-testid="teacher-analytics">
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {copy.analyticsTitle}
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">
        {copy.analyticsSubtitle}
      </p>
      <p className="mt-2 text-sm font-medium text-fg-soft">{weekLabel}</p>

      <div className="admin-stats mt-8">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat">
            <p className="admin-stat__value">{stat.value}</p>
            <p className="admin-stat__label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="admin-section-title">{copy.analyticsHomeworkBarTitle}</h2>
        {homeworkTracked === 0 ? (
          <p className="admin-muted" style={{ margin: 0 }}>
            {copy.analyticsHomeworkBarEmpty}
          </p>
        ) : (
          <>
            <div
              className="flex h-2.5 overflow-hidden rounded-full bg-border"
              aria-hidden
            >
              <div
                className="bg-accent"
                style={{ width: barWidth(data.homeworkDone, homeworkTracked) }}
              />
              <div
                className="bg-accent-alt"
                style={{ width: barWidth(data.homeworkPartial, homeworkTracked) }}
              />
              <div
                className="bg-fg-muted"
                style={{ width: barWidth(data.homeworkPending, homeworkTracked) }}
              />
              <div
                className="bg-fg-faint"
                style={{ width: barWidth(data.homeworkNotDone, homeworkTracked) }}
              />
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
              <li>
                <span className="mr-1 inline-block size-2 rounded-full bg-accent" />
                {copy.statusDone} ({data.homeworkDone})
              </li>
              <li>
                <span className="mr-1 inline-block size-2 rounded-full bg-accent-alt" />
                {copy.statusPartial} ({data.homeworkPartial})
              </li>
              <li>
                <span className="mr-1 inline-block size-2 rounded-full bg-fg-muted" />
                {copy.statusPending} ({data.homeworkPending})
              </li>
              <li>
                <span className="mr-1 inline-block size-2 rounded-full bg-fg-faint" />
                {copy.statusNotDone} ({data.homeworkNotDone})
              </li>
            </ul>
          </>
        )}
      </div>

      <TeacherOverviewCalendar
        sessions={calendarSessions}
        locale={locale}
        timeZone={data.timeZone}
        copy={copy}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="admin-card admin-card--flush">
          <div className="px-5 py-4">
            <h2 className="admin-section-title" style={{ marginBottom: 0 }}>
              {copy.analyticsAgendaTitle}
            </h2>
          </div>
          {data.weekClasses.length === 0 ? (
            <p className="admin-muted px-5 pb-5">{copy.analyticsAgendaEmpty}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{copy.analyticsColWhen}</th>
                  <th>{copy.analyticsColStudent}</th>
                  <th>{copy.analyticsColHomework}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.weekClasses.map((row) => (
                  <tr key={`${row.materialId}-${row.studentId}`}>
                    <td className="whitespace-nowrap text-fg-muted">
                      {formatScheduledAt(row.scheduledAt, locale, data.timeZone)}
                    </td>
                    <td className="font-semibold text-fg">{row.studentName}</td>
                    <td>
                      <span className={homeworkBadgeClass(row.homeworkStatus)}>
                        {homeworkLabel(row.homeworkStatus, copy)}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`${teacherPaths.home}?student=${row.studentId}`}
                        className="admin-btn admin-btn--secondary"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                      >
                        {copy.analyticsOpenLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card admin-card--flush">
          <div className="px-5 py-4">
            <h2 className="admin-section-title" style={{ marginBottom: 0 }}>
              {copy.analyticsAttentionTitle}
            </h2>
          </div>
          {data.attention.length === 0 ? (
            <p className="admin-muted px-5 pb-5">{copy.analyticsAttentionEmpty}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{copy.analyticsColStudent}</th>
                  <th>{copy.analyticsColNeed}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.attention.map((row) => (
                  <tr key={`${row.kind}-${row.studentId}-${row.scheduledAt ?? "none"}`}>
                    <td className="font-semibold text-fg">{row.studentName}</td>
                    <td className="text-fg-muted">
                      {row.kind === "overdue"
                        ? copy.analyticsNeedsOverdue.replace(
                            "{when}",
                            formatScheduledAt(
                              row.scheduledAt,
                              locale,
                              data.timeZone,
                            ) ?? "",
                          )
                        : copy.analyticsNeedsNoClass}
                    </td>
                    <td>
                      <Link
                        href={`${teacherPaths.home}?student=${row.studentId}`}
                        className="admin-btn admin-btn--secondary"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                      >
                        {copy.analyticsOpenLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
