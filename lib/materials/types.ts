import type { UserRole } from "@/lib/auth/constants";
import type { Locale } from "@/lib/locale";

export type Role = UserRole;

export type MaterialKind = "video" | "document" | "audio" | "link";

export type CompletionStatus = "done" | "not_done" | "partial";

export type Material = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  locale: Locale;
  scheduledAt: string | null;
  meetUrl: string | null;
  createdAt: string;
  assignedAt?: string;
  completionStatus?: CompletionStatus | null;
  reviewedAt?: string | null;
  notes?: string | null;
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
