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
import {
  MAX_WEEKLY_SLOTS,
  SCHEDULE_ERROR,
  parseOptionalSlot,
  slotKey,
  type WeeklySlot,
} from "@/lib/materials/schedule-slots";
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

type SlotInput = {
  weekday?: number | null;
  timeLocal?: string | null;
};

type UpsertPayload = {
  studentUserId?: string;
  slots?: SlotInput[];
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

function parseSlotList(body: UpsertPayload):
  | { ok: true; slots: WeeklySlot[] }
  | { ok: false; error: string } {
  const rawSlots = Array.isArray(body.slots) ? body.slots : null;
  const sources: SlotInput[] = rawSlots
    ? rawSlots
    : [
        { weekday: body.weekday, timeLocal: body.timeLocal },
        { weekday: body.weekday2, timeLocal: body.timeLocal2 },
      ];

  const slots: WeeklySlot[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const parsed = parseOptionalSlot(source.weekday, source.timeLocal?.trim() ?? "");
    if (!parsed.ok) {
      return {
        ok: false,
        error:
          parsed.error === "incomplete"
            ? SCHEDULE_ERROR.incompleteSlot
            : SCHEDULE_ERROR.invalidSlot,
      };
    }
    if (!parsed.slot) continue;
    const key = slotKey(parsed.slot);
    if (seen.has(key)) {
      return { ok: false, error: SCHEDULE_ERROR.duplicateSlot };
    }
    seen.add(key);
    slots.push(parsed.slot);
  }
  if (slots.length > MAX_WEEKLY_SLOTS) {
    return { ok: false, error: SCHEDULE_ERROR.tooManySlots };
  }
  return { ok: true, slots };
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

    const parsed = parseSlotList(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (meetUrl && !isValidHttpsUrl(meetUrl)) {
      return NextResponse.json({ error: "Valid https Meet URL is required" }, { status: 400 });
    }

    const hasFixedSlot = parsed.slots.length > 0;
    const schedule = await upsertClassSchedule({
      studentUserId,
      slots: parsed.slots,
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
