import type { UserRole } from "@/lib/auth/constants";
import type { Locale } from "@/lib/locale";

export type Role = UserRole;

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
  name?: string;
  firstName: string | null;
  lastName: string | null;
};

export type Assignment = {
  userId: string;
  materialId: string;
  assignedAt: string;
  completedAt: string | null;
};
