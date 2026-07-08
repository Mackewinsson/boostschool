import { NextResponse } from "next/server";

export function apiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error.message === "DATABASE_URL is not configured") {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
