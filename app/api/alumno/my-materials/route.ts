import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireAuth } from "@/lib/materials/auth";
import {
  listMaterialsForStudent,
  setCompletion,
} from "@/lib/materials/repository";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { userId } = await requireAuth();
    const materials = await listMaterialsForStudent(userId);
    return NextResponse.json({ materials });
  } catch (error) {
    return apiError(error);
  }
}

type CompletionPayload = {
  materialId?: string;
  completed?: boolean;
};

export async function PATCH(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { userId } = await requireAuth();
    const body = (await request.json()) as CompletionPayload;
    const materialId = body.materialId?.trim() ?? "";

    if (!materialId) {
      return NextResponse.json({ error: "materialId is required" }, { status: 400 });
    }

    const updated = await setCompletion(userId, materialId, Boolean(body.completed));
    if (!updated) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const materials = await listMaterialsForStudent(userId);
    return NextResponse.json({ materials });
  } catch (error) {
    return apiError(error);
  }
}
