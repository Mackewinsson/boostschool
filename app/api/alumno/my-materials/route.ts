import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  getEffectiveStudentId,
  getLinkedStudentName,
  requireAuth,
  requireStudent,
} from "@/lib/materials/auth";
import {
  listMaterialsForStudent,
  setStudentNotes,
} from "@/lib/materials/repository";
import { ensureHorizonForStudent } from "@/lib/materials/schedule-generate";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const context = await requireAuth();
    const studentId = await getEffectiveStudentId(context);
    if (!studentId) {
      if (context.role === "parent") {
        return NextResponse.json({
          materials: [],
          readOnly: true,
          linkedStudentName: null,
        });
      }
      return NextResponse.json({ error: "No linked student" }, { status: 403 });
    }

    await ensureHorizonForStudent(studentId, "es");
    const materials = await listMaterialsForStudent(studentId);
    const linkedStudentName = await getLinkedStudentName(context);

    return NextResponse.json({
      materials,
      readOnly: context.role === "parent",
      linkedStudentName,
    });
  } catch (error) {
    return apiError(error);
  }
}

type NotesPayload = {
  materialId?: string;
  notes?: string;
};

export async function PATCH(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const context = await requireStudent();
    const body = (await request.json()) as NotesPayload;
    const materialId = body.materialId?.trim() ?? "";
    const notes = body.notes ?? "";

    if (!materialId) {
      return NextResponse.json({ error: "materialId is required" }, { status: 400 });
    }

    const updated = await setStudentNotes(context.userId, materialId, notes);
    if (!updated) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const materials = await listMaterialsForStudent(context.userId);
    return NextResponse.json({ materials, readOnly: false, linkedStudentName: null });
  } catch (error) {
    return apiError(error);
  }
}
