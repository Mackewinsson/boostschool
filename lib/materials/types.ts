import type { Locale } from "@/lib/locale";

export type Role = "teacher" | "student";

export type MaterialKind = "video" | "document" | "audio" | "link";

export type Material = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  locale: Locale;
  createdAt: string;
  assignedAt?: string;
  completedAt?: string | null;
};

export type StudentSummary = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type Assignment = {
  clerkUserId: string;
  materialId: string;
  assignedAt: string;
  completedAt: string | null;
};
