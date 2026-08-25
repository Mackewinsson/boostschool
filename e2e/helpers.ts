import { expect, type Page } from "@playwright/test";

export type PortalCreds = {
  email: string;
  password: string;
};

const DEFAULT_PASSWORD = "Prueba123!";

export const e2eCreds = {
  teacher: {
    email: process.env.E2E_TEACHER_EMAIL?.trim() || "profe@bilingualboost.test",
    password: process.env.E2E_PASSWORD?.trim() || DEFAULT_PASSWORD,
  } satisfies PortalCreds,
  student: {
    email: process.env.E2E_STUDENT_EMAIL?.trim() || "alumno@bilingualboost.test",
    password: process.env.E2E_PASSWORD?.trim() || DEFAULT_PASSWORD,
  } satisfies PortalCreds,
  parent: {
    email: process.env.E2E_PARENT_EMAIL?.trim() || "padre@bilingualboost.test",
    password: process.env.E2E_PASSWORD?.trim() || DEFAULT_PASSWORD,
  } satisfies PortalCreds,
};

export function uniqueTitle(prefix = "E2E deber") {
  return `${prefix} ${Date.now()}`;
}

/** datetime-local value ~2 days ahead so the material lands in "próximas". */
export function futureScheduledLocal(): string {
  const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T10:00`;
}

export async function login(
  page: Page,
  creds: PortalCreds,
  expectedPath: RegExp,
) {
  await page.goto("/sign-in");
  await page.locator('input[name="email"]').fill(creds.email);
  await page.locator('input[name="password"]').fill(creds.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(expectedPath, { timeout: 30_000 });
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Salir" }).click();
  await page.waitForURL(/\/sign-in/, { timeout: 30_000 });
}

export async function materialRow(page: Page, title: string) {
  const row = page.locator("li").filter({ hasText: title }).first();
  await expect(row).toBeVisible({ timeout: 30_000 });
  return row;
}

export async function materialCard(page: Page, title: string) {
  const card = page.locator("article").filter({ hasText: title }).first();
  await expect(card).toBeVisible({ timeout: 30_000 });
  return card;
}
