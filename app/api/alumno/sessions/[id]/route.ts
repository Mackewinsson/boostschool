import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import { getMaterial, setMaterialCanceled } from "@/lib/materials/repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CancelPayload = {
  canceled?: boolean;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const { id } = await context.params;
    const body = (await request.json()) as CancelPayload;
    if (typeof body.canceled !== "boolean") {
      return NextResponse.json({ error: "canceled is required" }, { status: 400 });
    }

    const current = await getMaterial(id);
    if (!current) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    if (!current.scheduledAt) {
      return NextResponse.json({ error: "Not a class session" }, { status: 400 });
    }

    const material = await setMaterialCanceled(id, body.canceled);
    if (!material) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ material });
  } catch (error) {
    return apiError(error);
  }
}
