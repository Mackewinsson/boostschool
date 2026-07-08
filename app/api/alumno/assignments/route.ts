import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import {
  assignMaterial,
  listAssignments,
  unassignMaterial,
} from "@/lib/materials/repository";

export async function GET(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const userId = new URL(request.url).searchParams.get("userId") ?? undefined;
    const assignments = await listAssignments(userId);
    return NextResponse.json({ assignments });
  } catch (error) {
    return apiError(error);
  }
}

type AssignmentPayload = {
  userId?: string;
  materialId?: string;
};

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const body = (await request.json()) as AssignmentPayload;
    const userId = body.userId?.trim() ?? "";
    const materialId = body.materialId?.trim() ?? "";

    if (!userId || !materialId) {
      return NextResponse.json({ error: "userId and materialId are required" }, { status: 400 });
    }

    await assignMaterial(userId, materialId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const body = (await request.json()) as AssignmentPayload;
    const userId = body.userId?.trim() ?? "";
    const materialId = body.materialId?.trim() ?? "";

    if (!userId || !materialId) {
      return NextResponse.json({ error: "userId and materialId are required" }, { status: 400 });
    }

    const removed = await unassignMaterial(userId, materialId);
    if (!removed) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
