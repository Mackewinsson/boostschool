import type { CompletionStatus } from "./types";

export function groupMaterialsBySchedule(materials: import("./types").Material[]) {
  const now = Date.now();
  const upcoming: import("./types").Material[] = [];
  const past: import("./types").Material[] = [];
  const undated: import("./types").Material[] = [];

  for (const material of materials) {
    if (!material.scheduledAt) {
      undated.push(material);
      continue;
    }
    const time = new Date(material.scheduledAt).getTime();
    if (time >= now) {
      upcoming.push(material);
    } else {
      past.push(material);
    }
  }

  return { upcoming, past, undated };
}

export function formatScheduledAt(value: string | null | undefined, locale: string) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function completionStatusLabel(
  status: CompletionStatus | null | undefined,
  labels: {
    pending: string;
    done: string;
    notDone: string;
    partial: string;
  },
) {
  if (status === "done") return labels.done;
  if (status === "not_done") return labels.notDone;
  if (status === "partial") return labels.partial;
  return labels.pending;
}
