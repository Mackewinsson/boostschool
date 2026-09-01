import bcrypt from "bcryptjs";

const PASSWORD_ROUNDS = 12;

export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, PASSWORD_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
