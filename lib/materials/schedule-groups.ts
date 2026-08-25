import type { CompletionStatus, Material } from "./types";

export function groupMaterialsBySchedule(materials: Material[]) {
  const now = Date.now();
  const upcoming: Material[] = [];
  const past: Material[] = [];
  const undated: Material[] = [];

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

/** Split assigned materials into dated class sessions vs undated extras. */
export function splitSessionsAndExtras(materials: Material[]) {
  const sessions: Material[] = [];
  const extras: Material[] = [];

  for (const material of materials) {
    if (material.scheduledAt) {
      sessions.push(material);
    } else {
      extras.push(material);
    }
  }

  sessions.sort((a, b) => {
    const aTime = new Date(a.scheduledAt ?? 0).getTime();
    const bTime = new Date(b.scheduledAt ?? 0).getTime();
    return aTime - bTime;
  });

  return { sessions, extras };
}

export function formatScheduledAt(
  value: string | null | undefined,
  locale: string,
  timeZone = "Europe/Warsaw",
) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
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

/** @deprecated Prefer toDatetimeLocalValueInZone from schedule-generate for schedule TZ. */
export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
