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
};

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
    const studentId = body.studentId?.trim() ?? "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const parent = await createParentForStudent({
      name,
      email,
      password,
      studentId,
    });

    return NextResponse.json({
      parent: {
        id: parent.id,
        email: parent.email,
        name: parent.name,
        studentId,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
