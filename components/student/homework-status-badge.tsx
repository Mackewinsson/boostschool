import { completionStatusLabel } from "@/lib/materials/schedule-groups";
import type { CompletionStatus } from "@/lib/materials/types";

export type HomeworkStatusLabels = {
  pending: string;
  done: string;
  notDone: string;
  partial: string;
};

const BADGE_CLASS: Record<"pending" | CompletionStatus, string> = {
  done: "bg-accent/15 text-accent",
  partial: "bg-accent-alt/15 text-accent-alt",
  pending: "bg-canvas text-fg-muted",
  not_done: "border border-border-strong bg-canvas text-fg-soft",
};

export function HomeworkStatusBadge({
  status,
  labels,
}: {
  status: CompletionStatus | null | undefined;
  labels: HomeworkStatusLabels;
}) {
  const kind = status ?? "pending";

  return (
    <span
      data-testid="homework-status-badge"
      data-status={kind}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_CLASS[kind]}`}
    >
      {completionStatusLabel(status, labels)}
    </span>
  );
}
