import type { Locale } from "@/lib/locale";

export type Lead = {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  source: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  locale: Locale;
  readAt: string | null;
  createdAt: string;
};

export type EmailTemplate = {
  id: string;
  subjectEs: string;
  subjectEn: string;
  subjectPl: string;
  bodyHtmlEs: string;
  bodyHtmlEn: string;
  bodyHtmlPl: string;
  updatedAt: string;
};

export type CrmDashboardStats = {
  leadsTotal: number;
  leadsLast7Days: number;
  contactsTotal: number;
  contactsUnread: number;
};
