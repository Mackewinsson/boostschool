import { SignJWT, jwtVerify } from "jose";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  type SessionPayload,
  type UserRole,
} from "./constants";

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };
export type { SessionPayload, UserRole };

function getSecretKey() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

function parseRole(value: unknown): UserRole {
  if (
    value === "admin" ||
    value === "teacher" ||
    value === "student" ||
    value === "parent"
  ) {
    return value;
  }
  return "student";
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const name = typeof payload.name === "string" ? payload.name : null;

    if (!sub || !email || !name) {
      return null;
    }

    return {
      sub,
      email,
      name,
      role: parseRole(payload.role),
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
