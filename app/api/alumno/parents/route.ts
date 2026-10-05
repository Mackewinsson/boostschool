import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { createParentForStudent } from "@/lib/auth/parents";
import { findUserByEmail } from "@/lib/auth/users";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";

type CreateParentPayload = {
  name?: string;
  email?: string;
  password?: string;
  studentId?: string;
  studentIds?: string[];
};

function readStudentIds(body: CreateParentPayload): string[] {
  const fromList = Array.isArray(body.studentIds)
    ? body.studentIds.filter((id): id is string => typeof id === "string")
    : [];
  const single = typeof body.studentId === "string" ? [body.studentId] : [];
  return [...fromList, ...single].map((id) => id.trim()).filter(Boolean);
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as CreateParentPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const studentIds = readStudentIds(body);

    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (studentIds.length === 0) {
      return NextResponse.json({ error: "At least one student is required" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const parent = await createParentForStudent({
      name,
      email,
      password,
      studentIds,
    });

    return NextResponse.json({
      parent: {
        id: parent.id,
        email: parent.email,
        name: parent.name,
        studentIds,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "PARENT_STUDENT_REQUIRED") {
      return NextResponse.json({ error: "A valid student is required" }, { status: 400 });
    }
    return apiError(error);
  }
}
