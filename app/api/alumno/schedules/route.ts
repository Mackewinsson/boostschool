import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import {
  listClassSchedules,
  syncMeetUrlForSchedule,
  upsertClassSchedule,
} from "@/lib/materials/repository";
import { generateSessionsForSchedule, realignFutureSessionsForSchedule } from "@/lib/materials/schedule-generate";
import { parseHorizonWeeks } from "@/lib/materials/schedule-horizon";
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
  weekday?: number | null;
  timeLocal?: string | null;
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
    const meetUrl = body.meetUrl?.trim() ?? "";
    const timeLocalRaw = body.timeLocal?.trim() ?? "";
    const hasWeekday =
      body.weekday !== undefined && body.weekday !== null && body.weekday !== ("" as unknown);
    const weekday = hasWeekday ? Number(body.weekday) : null;

    if (!studentUserId) {
      return NextResponse.json({ error: "Student is required" }, { status: 400 });
    }

    const hasFixedSlot = weekday != null && Boolean(timeLocalRaw);
    if (hasFixedSlot) {
      if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
        return NextResponse.json({ error: "Invalid weekday" }, { status: 400 });
      }
      if (!/^\d{2}:\d{2}$/.test(timeLocalRaw)) {
        return NextResponse.json({ error: "Invalid time" }, { status: 400 });
      }
    } else if (weekday != null || timeLocalRaw) {
      return NextResponse.json(
        { error: "Weekday and time are both required for a fixed schedule" },
        { status: 400 },
      );
    }

    if (meetUrl && !isValidHttpsUrl(meetUrl)) {
      return NextResponse.json({ error: "Valid https Meet URL is required" }, { status: 400 });
    }

    const schedule = await upsertClassSchedule({
      studentUserId,
      weekday: hasFixedSlot ? weekday : null,
      timeLocal: hasFixedSlot ? timeLocalRaw : null,
      timezone: body.timezone?.trim() || "Europe/Warsaw",
      meetUrl: meetUrl || null,
      titleTemplate: body.titleTemplate?.trim() || "Clase",
      horizonWeeks: parseHorizonWeeks(body.horizonWeeks),
      active: body.active ?? true,
    });

    await syncMeetUrlForSchedule(schedule.id, schedule.meetUrl);
    if (hasFixedSlot) {
      await realignFutureSessionsForSchedule(schedule, "es");
    } else {
      await generateSessionsForSchedule(schedule, "es");
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    return apiError(error);
  }
}
