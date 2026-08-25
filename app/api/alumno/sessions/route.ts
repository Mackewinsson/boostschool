import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import { createClassSessionForStudent } from "@/lib/materials/schedule-generate";

type CreatePayload = {
  studentUserId?: string;
  scheduledAt?: string;
};

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as CreatePayload;
    const studentUserId = body.studentUserId?.trim() ?? "";
    const scheduledAtRaw = body.scheduledAt?.trim() ?? "";

    if (!studentUserId) {
      return NextResponse.json({ error: "Student is required" }, { status: 400 });
    }
    if (!scheduledAtRaw) {
      return NextResponse.json({ error: "Class date is required" }, { status: 400 });
    }

    const scheduledAt = new Date(scheduledAtRaw);
    if (Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Invalid class date" }, { status: 400 });
    }

    const material = await createClassSessionForStudent({
      studentUserId,
      scheduledAt,
      locale: "es",
    });

    return NextResponse.json({ material });
  } catch (error) {
    return apiError(error);
  }
}
