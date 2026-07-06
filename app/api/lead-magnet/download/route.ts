import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  LEAD_MAGNET_FILE_PATH,
  LEAD_MAGNET_FILENAME,
} from "@/lib/lead-magnet/constants";
import { verifyLeadMagnetToken } from "@/lib/lead-magnet/token";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const email = verifyLeadMagnetToken(token);
  if (!email) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  try {
    const file = await readFile(LEAD_MAGNET_FILE_PATH);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${LEAD_MAGNET_FILENAME}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
