import { NextResponse } from "next/server";
import { isContactConfigured, sendContactMessage } from "@/lib/contact/send";
import { isLocale, type Locale } from "@/lib/locale";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  locale?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!isContactConfigured()) {
    return NextResponse.json(
      { error: "Contact form is not configured" },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const message = body.message?.trim() ?? "";
  const locale: Locale =
    body.locale && isLocale(body.locale) ? body.locale : "es";

  if (name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    await sendContactMessage({ name, email, message, locale });
  } catch (error) {
    console.error("Contact form delivery failed:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
