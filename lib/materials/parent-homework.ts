import type { CompletionStatus, Material } from "./types";

export type ParentHomeworkKind =
  | "done"
  | "not_done"
  | "partial"
  | "pending"
  | "none";

export function parentHomeworkKind(
  description: string | null | undefined,
  completion: CompletionStatus | null | undefined,
): ParentHomeworkKind {
  if (!description?.trim()) return "none";
  if (completion === "done") return "done";
  if (completion === "not_done") return "not_done";
  if (completion === "partial") return "partial";
  return "pending";
}

export type ParentHomeworkSummary = {
  upcomingCount: number;
  done: number;
  pending: number;
  notDone: number;
  partial: number;
  overdue: number;
  assigned: number;
  nextClass: Material | null;
  attention: Material[];
};

const ATTENTION_LIMIT = 5;

export function summarizeParentHomework(
  materials: Material[],
  now: number = Date.now(),
): ParentHomeworkSummary {
  const dated = materials.filter((material) => material.scheduledAt);
  const upcoming = dated
    .filter((material) => new Date(material.scheduledAt as string).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt as string).getTime() -
        new Date(b.scheduledAt as string).getTime(),
    );

  let done = 0;
  let pending = 0;
  let notDone = 0;
  let partial = 0;
  let overdue = 0;
  const attention: Material[] = [];

  for (const material of dated) {
    const kind = parentHomeworkKind(material.description, material.completionStatus);
    if (kind === "none") continue;
    if (kind === "done") done += 1;
    else if (kind === "not_done") notDone += 1;
    else if (kind === "partial") partial += 1;
    else pending += 1;

    const isPast = new Date(material.scheduledAt as string).getTime() < now;
    if (isPast && kind !== "done") {
      overdue += 1;
      attention.push(material);
    }
  }

  attention.sort(
    (a, b) =>
      new Date(b.scheduledAt as string).getTime() -
      new Date(a.scheduledAt as string).getTime(),
  );

  return {
    upcomingCount: upcoming.length,
    done,
    pending,
    notDone,
    partial,
    overdue,
    assigned: done + pending + notDone + partial,
    nextClass: upcoming[0] ?? null,
    attention: attention.slice(0, ATTENTION_LIMIT),
  };
}
