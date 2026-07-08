import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { isDatabaseConfigured } from "@/lib/db/client";
import { requireTeacher } from "@/lib/materials/auth";
import { createMaterial, listMaterials } from "@/lib/materials/repository";
import { isValidHttpsUrl, parseLocale } from "@/lib/materials/validation";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();
    const materials = await listMaterials();
    return NextResponse.json({ materials });
  } catch (error) {
    return apiError(error);
  }
}

type CreatePayload = {
  title?: string;
  description?: string;
  url?: string;
  locale?: string;
};

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await requireTeacher();

    const body = (await request.json()) as CreatePayload;
    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const url = body.url?.trim() ?? "";

    if (title.length < 2) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!isValidHttpsUrl(url)) {
      return NextResponse.json({ error: "Valid https URL is required" }, { status: 400 });
    }

    const material = await createMaterial({
      title,
      description: description || undefined,
      url,
      locale: parseLocale(body.locale),
    });

    return NextResponse.json({ material });
  } catch (error) {
    return apiError(error);
  }
}
