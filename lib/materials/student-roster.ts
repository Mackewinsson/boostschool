import { getDb } from "@/lib/db/client";
import { formatTimeLocal } from "./schedule-slots";

export type StudentRosterRow = {
  id: string;
  name: string;
  email: string;
  parentEmails: string[];
  weekday: number | null;
  timeLocal: string | null;
  weekday2: number | null;
  timeLocal2: string | null;
  scheduleActive: boolean;
  meetUrl: string | null;
};

type RosterDbRow = {
  id: string;
  name: string;
  email: string;
  parent_emails: string | null;
  weekday: number | null;
  time_local: string | null;
  weekday_2: number | null;
  time_local_2: string | null;
  schedule_active: boolean | null;
  meet_url: string | null;
};

/** Active students with linked parent emails and weekly class slot (for teacher roster). */
export async function listStudentRoster(): Promise<StudentRosterRow[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      s.id,
      s.name,
      s.email,
      (
        SELECT string_agg(p.email, ', ' ORDER BY p.email)
        FROM parent_students ps
        INNER JOIN users p ON p.id = ps.parent_user_id
        WHERE ps.student_user_id = s.id AND p.active = true
      ) AS parent_emails,
      sc.weekday,
      sc.time_local::text AS time_local,
      sc.weekday_2,
      sc.time_local_2::text AS time_local_2,
      sc.active AS schedule_active,
      sc.meet_url
    FROM users s
    LEFT JOIN student_class_schedules sc ON sc.student_user_id = s.id
    WHERE s.role = 'student' AND s.active = true
    ORDER BY s.name ASC, s.email ASC
  `) as RosterDbRow[];

  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      parentEmails: row.parent_emails
        ? row.parent_emails.split(", ").filter(Boolean)
        : [],
      weekday: row.weekday == null ? null : Number(row.weekday),
      timeLocal: formatTimeLocal(row.time_local),
      weekday2: row.weekday_2 == null ? null : Number(row.weekday_2),
      timeLocal2: formatTimeLocal(row.time_local_2),
      scheduleActive: Boolean(row.schedule_active),
      meetUrl: row.meet_url,
    };
  });
}
