import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireAuth } from "@/lib/materials/auth";
import { listMaterialsForStudent } from "@/lib/materials/repository";

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
