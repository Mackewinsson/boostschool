import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/locale";
import type { ContactMessage } from "./types";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  locale: string;
  read_at: string | null;
  created_at: string;
};

function mapContact(row: ContactRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    locale: row.locale as Locale,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, name, email, message, locale, read_at, created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `) as ContactRow[];
  return rows.map(mapContact);
}

export async function getContactMessageById(
  id: string,
): Promise<ContactMessage | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, name, email, message, locale, read_at, created_at
    FROM contact_messages
    WHERE id = ${id}
    LIMIT 1
  `) as ContactRow[];
  return rows[0] ? mapContact(rows[0]) : null;
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
  locale: Locale;
}): Promise<ContactMessage> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO contact_messages (name, email, message, locale)
    VALUES (
      ${input.name.trim()},
      ${input.email.trim().toLowerCase()},
      ${input.message.trim()},
      ${input.locale}
    )
    RETURNING id, name, email, message, locale, read_at, created_at
  `) as ContactRow[];
  return mapContact(rows[0]);
}

export async function markContactMessageRead(
  id: string,
): Promise<ContactMessage | null> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE contact_messages
    SET read_at = COALESCE(read_at, now())
    WHERE id = ${id}
    RETURNING id, name, email, message, locale, read_at, created_at
  `) as ContactRow[];
  return rows[0] ? mapContact(rows[0]) : null;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    DELETE FROM contact_messages WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

export async function countContactMessages(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT COUNT(*)::int AS count FROM contact_messages
  `) as { count: number }[];
  return rows[0]?.count ?? 0;
}

export async function countUnreadContactMessages(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT COUNT(*)::int AS count
    FROM contact_messages
    WHERE read_at IS NULL
  `) as { count: number }[];
  return rows[0]?.count ?? 0;
}
