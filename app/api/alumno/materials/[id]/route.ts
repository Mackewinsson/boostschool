import { after, NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { notifyHomeworkSaved } from "@/lib/mail/assignment-notify";
import { requireTeacher } from "@/lib/materials/auth";
import {
  deleteMaterial,
  getClassScheduleById,
  getMaterial,
  updateMaterial,
} from "@/lib/materials/repository";
import { formatClassTitle } from "@/lib/materials/schedule-time";
import {
  isUniqueViolation,
  nextOriginalScheduledAt,
  SCHEDULE_ERROR,
} from "@/lib/materials/schedule-slots";
import { isValidHttpsUrl } from "@/lib/materials/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdatePayload = {
  title?: string;
  description?: string;
  url?: string;
  scheduledAt?: string | null;
  meetUrl?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const { id } = await context.params;
    const current = await getMaterial(id);
    if (!current) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdatePayload;

    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const url = body.url?.trim() ?? "";
    const meetUrl = body.meetUrl?.trim() ?? "";
    const scheduledAtRaw =
      body.scheduledAt === null || body.scheduledAt === undefined
        ? ""
        : String(body.scheduledAt).trim();

    if (title.length < 2) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (url && !isValidHttpsUrl(url)) {
      return NextResponse.json({ error: "Valid https URL is required" }, { status: 400 });
    }
    if (meetUrl && !isValidHttpsUrl(meetUrl)) {
      return NextResponse.json({ error: "Valid https Meet URL is required" }, { status: 400 });
    }

    let scheduledAt: string | null = null;
    if (scheduledAtRaw) {
      const parsed = new Date(scheduledAtRaw);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid scheduled date" }, { status: 400 });
      }
      scheduledAt = parsed.toISOString();
    }

    const originalScheduledAt = nextOriginalScheduledAt(
      current.originalScheduledAt,
      current.scheduledAt,
      scheduledAt,
    );

    let nextTitle = title;
    if (scheduledAt) {
      const schedule = current.scheduleId
        ? await getClassScheduleById(current.scheduleId)
        : null;
      const timezone = schedule?.timezone ?? "Europe/Warsaw";
      const template = schedule?.titleTemplate ?? "Clase";
      nextTitle = formatClassTitle(template, new Date(scheduledAt), current.locale, timezone);
    }

    try {
      const material = await updateMaterial(id, {
        title: nextTitle,
        description: description || null,
        url: url || null,
        scheduledAt,
        meetUrl: meetUrl || null,
        originalScheduledAt,
      });
      if (!material) {
        return NextResponse.json({ error: "Material not found" }, { status: 404 });
      }
      const previousHomework = (current.description ?? "").trim();
      if (description && description !== previousHomework) {
        after(() => notifyHomeworkSaved({ materialId: id }));
      }
      return NextResponse.json({ material });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return NextResponse.json(
          { error: SCHEDULE_ERROR.sessionTimeConflict },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const { id } = await context.params;
    const deleted = await deleteMaterial(id);
    if (!deleted) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
