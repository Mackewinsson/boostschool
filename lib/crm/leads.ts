import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/locale";
import type { Lead } from "./types";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  locale: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    locale: row.locale as Locale,
    source: row.source,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listLeads(): Promise<Lead[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, name, email, locale, source, notes, created_at, updated_at
    FROM leads
    ORDER BY created_at DESC
  `) as LeadRow[];
  return rows.map(mapLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, name, email, locale, source, notes, created_at, updated_at
    FROM leads
    WHERE id = ${id}
    LIMIT 1
  `) as LeadRow[];
  return rows[0] ? mapLead(rows[0]) : null;
}

export async function upsertLead(input: {
  name: string;
  email: string;
  locale: Locale;
  source?: string;
}): Promise<Lead> {
  const sql = getDb();
  const email = input.email.trim().toLowerCase();
  const rows = (await sql`
    INSERT INTO leads (name, email, locale, source)
    VALUES (
      ${input.name.trim()},
      ${email},
      ${input.locale},
      ${input.source ?? "lead_magnet"}
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      locale = EXCLUDED.locale,
      source = EXCLUDED.source,
      updated_at = now()
    RETURNING id, name, email, locale, source, notes, created_at, updated_at
  `) as LeadRow[];
  return mapLead(rows[0]);
}

export async function createLead(input: {
  name: string;
  email: string;
  locale: Locale;
  source?: string;
  notes?: string;
}): Promise<Lead> {
  const sql = getDb();
  const email = input.email.trim().toLowerCase();
  const rows = (await sql`
    INSERT INTO leads (name, email, locale, source, notes)
    VALUES (
      ${input.name.trim()},
      ${email},
      ${input.locale},
      ${input.source ?? "manual"},
      ${input.notes?.trim() || null}
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      locale = EXCLUDED.locale,
      notes = COALESCE(EXCLUDED.notes, leads.notes),
      updated_at = now()
    RETURNING id, name, email, locale, source, notes, created_at, updated_at
  `) as LeadRow[];
  return mapLead(rows[0]);
}

export async function updateLead(
  id: string,
  input: {
    name: string;
    locale: Locale;
    notes?: string;
  },
): Promise<Lead | null> {
  const sql = getDb();
  const rows = (await sql`
    UPDATE leads
    SET
      name = ${input.name.trim()},
      locale = ${input.locale},
      notes = ${input.notes?.trim() || null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, name, email, locale, source, notes, created_at, updated_at
  `) as LeadRow[];
  return rows[0] ? mapLead(rows[0]) : null;
}

export async function deleteLead(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    DELETE FROM leads WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

export async function countLeads(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`SELECT COUNT(*)::int AS count FROM leads`) as {
    count: number;
  }[];
  return rows[0]?.count ?? 0;
}

export async function countLeadsSince(sinceIso: string): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT COUNT(*)::int AS count
    FROM leads
    WHERE created_at >= ${sinceIso}
  `) as { count: number }[];
  return rows[0]?.count ?? 0;
}
