import { countUnreadContactMessages, countContactMessages } from "./contacts";
import { countLeads, countLeadsSince } from "./leads";
import type { CrmDashboardStats } from "./types";

export async function getCrmDashboardStats(): Promise<CrmDashboardStats> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [leadsTotal, leadsLast7Days, contactsTotal, contactsUnread] =
    await Promise.all([
      countLeads(),
      countLeadsSince(weekAgo.toISOString()),
      countContactMessages(),
      countUnreadContactMessages(),
    ]);

  return {
    leadsTotal,
    leadsLast7Days,
    contactsTotal,
    contactsUnread,
  };
}
