import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { createUser, listStudents } from "@/lib/auth/users";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const students = await listStudents();
    return NextResponse.json({ students });
  } catch (error) {
    return apiError(error);
  }
}

type CreateStudentPayload = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as CreateStudentPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const student = await createUser({
      name,
      email,
      password,
      role: "student",
    });

    return NextResponse.json({
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
