export const SESSION_COOKIE = "bb_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type UserRole = "admin" | "teacher" | "student" | "parent";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};
