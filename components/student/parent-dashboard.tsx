"use client";

import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import { summarizeParentHomework } from "@/lib/materials/parent-homework";
import { formatScheduledAt, splitSessionsAndExtras } from "@/lib/materials/schedule-groups";
import type { Material } from "@/lib/materials/types";
import type { StudentContent } from "@/lib/student-content/types";
import { ClassSessionTable } from "./class-session-table";
import { HomeworkStatusBadge } from "./homework-status-badge";
import { MaterialsGrid } from "./materials-grid";

type ParentDashboardProps = {
  copy: StudentContent["parent"];
  tableCopy: StudentContent["student"];
  locale: Locale;
  account?: Pick<
    StudentContent["portal"],
    "accountTitle" | "accountHint" | "accountNavLabel"
  >;
};

const statusLabels = (copy: StudentContent["student"]) => ({
  pending: copy.statusPending,
  done: copy.statusDone,
  notDone: copy.statusNotDone,
  partial: copy.statusPartial,
});

function barWidth(count: number, total: number): string {
  if (total <= 0 || count <= 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

function StatCard({
  testId,
  icon,
  value,
  label,
}: {
  testId: string;
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div
      data-testid={testId}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="text-accent">{icon}</div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-fg">{value}</p>
      <p className="mt-1 text-sm text-fg-muted">{label}</p>
    </div>
  );
}

export function ParentDashboard({
  copy,
  tableCopy,
  locale,
  account,
}: ParentDashboardProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkedStudentName, setLinkedStudentName] = useState<string | null>(null);
  const [linked, setLinked] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/alumno/my-materials");
        if (!response.ok) {
          setMaterials([]);
          setLinked(false);
          return;
        }
        const data = (await response.json()) as {
          materials?: Material[];
          linkedStudentName?: string | null;
        };
        setMaterials(data.materials ?? []);
        setLinkedStudentName(data.linkedStudentName ?? null);
        setLinked(data.linkedStudentName != null);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const { sessions, extras } = useMemo(
    () => splitSessionsAndExtras(materials),
    [materials],
  );
  const summary = useMemo(() => summarizeParentHomework(sessions), [sessions]);
  const labels = statusLabels(tableCopy);

  if (loading) {
    return (
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (!linked) {
    return (
      <section data-testid="parent-dashboard" className="mt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.titleFallback}
        </h1>
        <div className="mt-8 max-w-xl rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-fg">{copy.unlinkedTitle}</h2>
          <p className="mt-2 text-sm text-fg-muted">{copy.unlinkedBody}</p>
        </div>
      </section>
    );
  }

  const title = linkedStudentName
    ? copy.title.replace("{name}", linkedStudentName)
    : copy.titleFallback;

  return (
    <div data-testid="parent-dashboard">
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-fg-muted">{copy.subtitle}</p>
        </div>
        {linkedStudentName ? (
          <p
            data-testid="parent-linked-student"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-fg"
          >
            <UserRound size={16} className="text-accent" aria-hidden="true" />
            <span className="text-fg-muted">{copy.linkedLabel}</span>
            <span>{linkedStudentName}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          testId="parent-stat-upcoming"
          icon={<CalendarDays size={20} aria-hidden="true" />}
          value={summary.upcomingCount}
          label={copy.statUpcoming}
        />
        <StatCard
          testId="parent-stat-done"
          icon={<CircleCheck size={20} aria-hidden="true" />}
          value={summary.done}
          label={copy.statDone}
        />
        <StatCard
          testId="parent-stat-pending"
          icon={<Clock size={20} aria-hidden="true" />}
          value={summary.pending}
          label={copy.statPending}
        />
        <StatCard
          testId="parent-stat-overdue"
          icon={<TriangleAlert size={20} aria-hidden="true" />}
          value={summary.overdue}
          label={copy.statOverdue}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-fg">{copy.homeworkBarTitle}</h2>
          {summary.assigned === 0 ? (
            <p className="mt-3 text-sm text-fg-muted">{copy.homeworkBarEmpty}</p>
          ) : (
            <>
              <div
                className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-border"
                aria-hidden
              >
                <div
                  className="bg-accent"
                  style={{ width: barWidth(summary.done, summary.assigned) }}
                />
                <div
                  className="bg-accent-alt"
                  style={{ width: barWidth(summary.partial, summary.assigned) }}
                />
                <div
                  className="bg-fg-muted"
                  style={{ width: barWidth(summary.pending, summary.assigned) }}
                />
                <div
                  className="bg-fg-faint"
                  style={{ width: barWidth(summary.notDone, summary.assigned) }}
                />
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
                <li>
                  <span className="mr-1 inline-block size-2 rounded-full bg-accent" />
                  {tableCopy.statusDone} ({summary.done})
                </li>
                <li>
                  <span className="mr-1 inline-block size-2 rounded-full bg-accent-alt" />
                  {tableCopy.statusPartial} ({summary.partial})
                </li>
                <li>
                  <span className="mr-1 inline-block size-2 rounded-full bg-fg-muted" />
                  {tableCopy.statusPending} ({summary.pending})
                </li>
                <li>
                  <span className="mr-1 inline-block size-2 rounded-full bg-fg-faint" />
                  {tableCopy.statusNotDone} ({summary.notDone})
                </li>
              </ul>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold text-fg">{copy.nextClassTitle}</h2>
          {summary.nextClass ? (
            <p className="mt-3 text-base font-semibold text-accent">
              {formatScheduledAt(summary.nextClass.scheduledAt, locale)}
            </p>
          ) : (
            <p className="mt-3 text-sm text-fg-muted">{copy.nextClassEmpty}</p>
          )}
          {summary.nextClass ? (
            <p className="mt-2 text-sm text-fg-muted">
              {summary.nextClass.description?.trim() || copy.noHomework}
            </p>
          ) : null}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-bold text-fg">{copy.attentionTitle}</h2>
        {summary.attention.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">{copy.attentionEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {summary.attention.map((session) => (
              <li
                key={session.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-canvas/50 p-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-fg">
                    {formatScheduledAt(session.scheduledAt, locale)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-muted">
                    {session.description}
                  </p>
                </div>
                <HomeworkStatusBadge
                  status={session.completionStatus}
                  labels={labels}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ClassSessionTable
        sessions={sessions}
        locale={locale}
        mode="readonly"
        allowNotes={false}
        showMeetLink={false}
        showHomeworkStatus
        copy={{
          classesTitle: tableCopy.classesTitle,
          classesEmpty: tableCopy.emptyBody,
          upcomingTitle: tableCopy.upcomingTitle,
          pastTitle: tableCopy.pastTitle,
          homeworkLabel: tableCopy.homeworkLabel,
          homeworkEmpty: tableCopy.homeworkEmpty,
          joinMeetLabel: tableCopy.joinMeetLabel,
          statusLabel: tableCopy.statusLabel,
          statusPending: tableCopy.statusPending,
          statusDone: tableCopy.statusDone,
          statusNotDone: tableCopy.statusNotDone,
          statusPartial: tableCopy.statusPartial,
          sessionRescheduled: tableCopy.sessionRescheduled,
        }}
      />

      {extras.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-fg">{tableCopy.undatedTitle}</h2>
          <MaterialsGrid
            materials={extras}
            locale={locale}
            openLabel={tableCopy.openLabel}
            newBadge={tableCopy.newBadge}
            scheduledLabel={tableCopy.scheduledLabel}
            joinMeetLabel={tableCopy.joinMeetLabel}
            notesLabel={tableCopy.notesLabel}
            notesPlaceholder={tableCopy.notesPlaceholder}
            notesSaved={tableCopy.notesSaved}
            emptyTitle={tableCopy.emptyTitle}
            emptyBody={tableCopy.emptyBody}
            readOnly
          />
        </section>
      ) : null}

      {account ? (
        <section className="mt-12 max-w-xl rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-fg">{account.accountTitle}</h2>
          <p className="mt-2 text-sm text-fg-muted">{account.accountHint}</p>
          <Link
            href="/alumno/cuenta"
            className="mt-4 inline-flex text-sm font-semibold text-accent transition hover:text-accent-alt"
          >
            {account.accountNavLabel}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
