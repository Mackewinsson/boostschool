import type { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { getRoleFromMetadata } from "@/lib/materials/auth";

function getTeacherAllowlistEmails(): Set<string> {
  const raw = process.env.CLERK_TEACHER_EMAILS?.trim();
  if (!raw) {
    return new Set();
  }
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await request.text();
  const webhook = new Webhook(secret);

  let event: WebhookEvent;
  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const userId = event.data.id;
    const email =
      event.data.email_addresses?.[0]?.email_address?.toLowerCase() ?? "";
    const teacherEmails = getTeacherAllowlistEmails();
    const teacherIds = process.env.CLERK_TEACHER_USER_IDS?.split(",").map((id) => id.trim()) ?? [];

    const isTeacher =
      teacherEmails.has(email) ||
      teacherIds.includes(userId) ||
      getRoleFromMetadata(userId, event.data.public_metadata as Record<string, unknown>) ===
        "teacher";

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: isTeacher ? "teacher" : "student",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
