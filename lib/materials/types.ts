import type { UserRole } from "@/lib/auth/constants";
import type { Locale } from "@/lib/locale";
import type { WeeklySlot } from "./schedule-slots";

export type Role = UserRole;

export type MaterialKind = "video" | "document" | "audio" | "link" | "text";

export type CompletionStatus = "done" | "not_done" | "partial";

export type Material = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  locale: Locale;
  scheduledAt: string | null;
  meetUrl: string | null;
  scheduleId?: string | null;
  originalScheduledAt?: string | null;
  createdAt: string;
  assignedAt?: string;
  completionStatus?: CompletionStatus | null;
  reviewedAt?: string | null;
  notes?: string | null;
};

/**
 * slots: weekly class times (same Meet). Empty = class-by-class.
 * weekday / timeLocal / weekday2 / timeLocal2 mirror the first two slots.
 */
export type StudentClassSchedule = {
  id: string;
  studentUserId: string;
  weekday: number | null;
  timeLocal: string | null;
  weekday2: number | null;
  timeLocal2: string | null;
  slots: WeeklySlot[];
  timezone: string;
  meetUrl: string | null;
  titleTemplate: string;
  horizonWeeks: number;
  active: boolean;
};

export type StudentSummary = {
  id: string;
  email: string;
  name?: string;
  firstName: string | null;
  lastName: string | null;
};

export type Assignment = {
  userId: string;
  materialId: string;
  assignedAt: string;
  completionStatus: CompletionStatus | null;
  reviewedAt: string | null;
  notes: string | null;
};
