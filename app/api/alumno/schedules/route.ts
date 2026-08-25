import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import {
  listClassSchedules,
  upsertClassSchedule,
} from "@/lib/materials/repository";
import { generateSessionsForSchedule } from "@/lib/materials/schedule-generate";
import { isValidHttpsUrl } from "@/lib/materials/validation";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const schedules = await listClassSchedules();
    return NextResponse.json({ schedules });
  } catch (error) {
    return apiError(error);
  }
}

type UpsertPayload = {
  studentUserId?: string;
  weekday?: number;
  timeLocal?: string;
  timezone?: string;
  meetUrl?: string;
  titleTemplate?: string;
  horizonWeeks?: number;
  active?: boolean;
};

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as UpsertPayload;
    const studentUserId = body.studentUserId?.trim() ?? "";
    const weekday = Number(body.weekday);
    const timeLocal = body.timeLocal?.trim() ?? "";
    const meetUrl = body.meetUrl?.trim() ?? "";

    if (!studentUserId) {
      return NextResponse.json({ error: "Student is required" }, { status: 400 });
    }
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
      return NextResponse.json({ error: "Invalid weekday" }, { status: 400 });
    }
    if (!/^\d{2}:\d{2}$/.test(timeLocal)) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }
    if (meetUrl && !isValidHttpsUrl(meetUrl)) {
      return NextResponse.json({ error: "Valid https Meet URL is required" }, { status: 400 });
    }

    const schedule = await upsertClassSchedule({
      studentUserId,
      weekday,
      timeLocal,
      timezone: body.timezone?.trim() || "Europe/Warsaw",
      meetUrl: meetUrl || null,
      titleTemplate: body.titleTemplate?.trim() || "Clase",
      horizonWeeks: body.horizonWeeks ?? 6,
      active: body.active ?? true,
    });

    await generateSessionsForSchedule(schedule, "es");

    return NextResponse.json({ schedule });
  } catch (error) {
    return apiError(error);
  }
}
