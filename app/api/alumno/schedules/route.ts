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
import { parseOptionalSlot, slotKey } from "@/lib/materials/schedule-slots";
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
  weekday2?: number | null;
  timeLocal2?: string | null;
  timezone?: string;
  meetUrl?: string;
  titleTemplate?: string;
  horizonWeeks?: number;
  active?: boolean;
};

function slotErrorResponse(error: "incomplete" | "invalid", slot: "first" | "second") {
  if (error === "incomplete") {
    return NextResponse.json(
      {
        error:
          slot === "second"
            ? "Second weekday and time are both required"
            : "Weekday and time are both required for a fixed schedule",
      },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { error: slot === "second" ? "Invalid second weekday or time" : "Invalid weekday or time" },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as UpsertPayload;
    const studentUserId = body.studentUserId?.trim() ?? "";
    const meetUrl = body.meetUrl?.trim() ?? "";

    if (!studentUserId) {
      return NextResponse.json({ error: "Student is required" }, { status: 400 });
    }

    const first = parseOptionalSlot(body.weekday, body.timeLocal?.trim() ?? "");
    if (!first.ok) {
      return slotErrorResponse(first.error, "first");
    }
    const second = parseOptionalSlot(body.weekday2, body.timeLocal2?.trim() ?? "");
    if (!second.ok) {
      return slotErrorResponse(second.error, "second");
    }
    if (second.slot && !first.slot) {
      return NextResponse.json(
        { error: "A first weekly slot is required before adding a second class" },
        { status: 400 },
      );
    }
    if (first.slot && second.slot && slotKey(first.slot) === slotKey(second.slot)) {
      return NextResponse.json(
        { error: "The two weekly classes must be on different days or times" },
        { status: 400 },
      );
    }

    if (meetUrl && !isValidHttpsUrl(meetUrl)) {
      return NextResponse.json({ error: "Valid https Meet URL is required" }, { status: 400 });
    }

    const hasFixedSlot = Boolean(first.slot);
    const schedule = await upsertClassSchedule({
      studentUserId,
      weekday: first.slot?.weekday ?? null,
      timeLocal: first.slot?.timeLocal ?? null,
      weekday2: second.slot?.weekday ?? null,
      timeLocal2: second.slot?.timeLocal ?? null,
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
