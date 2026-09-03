import type { UserRole } from "@/lib/auth/constants";
import type { Locale } from "@/lib/locale";

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
  createdAt: string;
  assignedAt?: string;
  completionStatus?: CompletionStatus | null;
  reviewedAt?: string | null;
  notes?: string | null;
};

/**
 * weekday / timeLocal: first weekly slot (0 = Sunday … 6 = Saturday).
 * weekday2 / timeLocal2: optional second weekly slot (same Meet link).
 * Null weekday + time = class-by-class (Meet only).
 */
export type StudentClassSchedule = {
  id: string;
  studentUserId: string;
  weekday: number | null;
  timeLocal: string | null;
  weekday2: number | null;
  timeLocal2: string | null;
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
