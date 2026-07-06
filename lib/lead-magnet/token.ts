import { createHmac, timingSafeEqual } from "node:crypto";
import { LEAD_MAGNET_TOKEN_TTL_MS } from "./constants";

function getSecret(): string {
  const secret = process.env.LEAD_MAGNET_SECRET?.trim();
  if (!secret) {
    throw new Error("LEAD_MAGNET_SECRET is not configured");
  }
  return secret;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createLeadMagnetToken(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + LEAD_MAGNET_TOKEN_TTL_MS;
  const payload = `${normalizedEmail}|${expiresAt}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifyLeadMagnetToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastPipe = decoded.lastIndexOf("|");
    if (lastPipe === -1) {
      return null;
    }

    const payload = decoded.slice(0, lastPipe);
    const signature = decoded.slice(lastPipe + 1);
    const expected = signPayload(payload);

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null;
    }

    const [email, expiresAtRaw] = payload.split("|");
    const expiresAt = Number(expiresAtRaw);
    if (!email || !Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return null;
    }

    return email;
  } catch {
    return null;
  }
}

export function isLeadMagnetConfigured(): boolean {
  return Boolean(process.env.LEAD_MAGNET_SECRET?.trim());
}
