import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import { ensureHorizonForStudent } from "@/lib/materials/schedule-generate";

type EnsurePayload = {
  studentUserId?: string;
};

/** Fill missing weekly class shells for one student (read path stays side-effect free). */
export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as EnsurePayload;
    const studentUserId = body.studentUserId?.trim() ?? "";
    if (!studentUserId) {
      return NextResponse.json({ error: "Student is required" }, { status: 400 });
    }

    const created = await ensureHorizonForStudent(studentUserId, "es");
    return NextResponse.json({ created });
  } catch (error) {
    return apiError(error);
  }
}
