import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/lib/locale";
import {
  LEAD_MAGNET_FILE_PATH,
} from "@/lib/lead-magnet/constants";
import {
  buildDownloadUrl,
  createTokenForEmail,
  subscribeLeadMagnet,
} from "@/lib/lead-magnet/subscribe";
import { isLeadMagnetConfigured } from "@/lib/lead-magnet/token";

type LeadMagnetPayload = {
  name?: string;
  email?: string;
  locale?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!isLeadMagnetConfigured()) {
    return NextResponse.json(
      { error: "Lead magnet is not configured" },
      { status: 503 },
    );
  }

  let body: LeadMagnetPayload;
  try {
    body = (await request.json()) as LeadMagnetPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const locale: Locale =
    body.locale && isLocale(body.locale) ? body.locale : "es";

  if (name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  try {
    await readFile(LEAD_MAGNET_FILE_PATH);
  } catch {
    return NextResponse.json({ error: "Lead magnet file missing" }, { status: 503 });
  }

  const token = createTokenForEmail(email);

  try {
    await subscribeLeadMagnet({ name, email, locale, downloadToken: token });
  } catch (error) {
    console.error("Lead magnet subscription failed:", error);
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: buildDownloadUrl(token),
  });
}
