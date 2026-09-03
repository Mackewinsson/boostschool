import { expect, type Page } from "@playwright/test";

export type PortalCreds = {
  email: string;
  password: string;
};

const DEFAULT_PASSWORD = "Prueba123!";

export const e2eCreds = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL?.trim() || "admin@bilingualboost.test",
    password: process.env.E2E_PASSWORD?.trim() || DEFAULT_PASSWORD,
  } satisfies PortalCreds,
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

export const STUDENT_LABEL = /Ana Alumna|alumno@bilingualboost\.test/;
export const MEET_URL = "https://meet.google.com/e2e-test-room";

export function uniqueTitle(prefix = "E2E deber") {
  return `${prefix} ${Date.now()}`;
}

export function uniqueMarker(prefix = "e2e") {
  return `${prefix}-${Date.now()}`;
}

/** datetime-local value ~2 days ahead so the material lands in "próximas". */
export function futureScheduledLocal(): string {
  const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const minute = date.getMinutes() % 60;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(minute)}`;
}

/** Unique datetime-local a few days ahead (avoids duplicate class sessions across runs). */
export function uniqueFutureScheduledLocal(): string {
  const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + (Date.now() % 50_000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

export async function selectStudent(page: Page, label: RegExp = STUDENT_LABEL) {
  const select = page.getByTestId("selected-student");
  const option = select.locator("option").filter({ hasText: label }).first();
  const value = await option.getAttribute("value");
  expect(value).toBeTruthy();
  await select.selectOption(value!);
}

export async function saveWeeklySchedule(
  page: Page,
  input: {
    weekday: string;
    timeLocal: string;
    weekday2?: string;
    timeLocal2?: string;
    meetUrl?: string;
    horizonWeeks?: string;
  },
) {
  await page.getByRole("button", { name: "Horario fijo (cada semana)" }).click();
  await page.locator('select[name="weekday"]').selectOption(input.weekday);

  const timeInput = page.locator('input[name="timeLocal"]');
  await timeInput.click();
  await timeInput.fill(input.timeLocal);
  await expect(timeInput).toHaveValue(input.timeLocal);

  const secondToggle = page.getByTestId("schedule-second-slot");
  if (input.weekday2 != null && input.timeLocal2) {
    await secondToggle.check();
    await expect(secondToggle).toBeChecked();
    await page.locator('select[name="weekday2"]').selectOption(input.weekday2);
    const time2 = page.locator('input[name="timeLocal2"]');
    await time2.click();
    await time2.fill(input.timeLocal2);
    await expect(time2).toHaveValue(input.timeLocal2);
  } else {
    await secondToggle.uncheck();
    await expect(secondToggle).not.toBeChecked();
  }

  const meetInput = page.locator('input[name="meetUrl"]');
  await meetInput.fill(input.meetUrl ?? MEET_URL);

  if (input.horizonWeeks) {
    await page.getByTestId("schedule-horizon").selectOption(input.horizonWeeks);
  }

  const activeInput = page.locator('input[name="active"]');
  await activeInput.check();
  await expect(activeInput).toBeChecked();

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/alumno/schedules") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Guardar horario" }).click();
  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as {
    schedule?: {
      timeLocal?: string | null;
      weekday?: number | null;
      timeLocal2?: string | null;
      weekday2?: number | null;
      active?: boolean;
      horizonWeeks?: number;
      meetUrl?: string | null;
    };
  };
  expect(body.schedule?.timeLocal).toBe(input.timeLocal);
  expect(body.schedule?.weekday).toBe(Number(input.weekday));
  expect(body.schedule?.active).toBe(true);
  if (input.weekday2 != null && input.timeLocal2) {
    expect(body.schedule?.weekday2).toBe(Number(input.weekday2));
    expect(body.schedule?.timeLocal2).toBe(input.timeLocal2);
  } else {
    expect(body.schedule?.weekday2 ?? null).toBeNull();
    expect(body.schedule?.timeLocal2 ?? null).toBeNull();
  }
  if (input.horizonWeeks) {
    expect(body.schedule?.horizonWeeks).toBe(Number(input.horizonWeeks));
  }

  await expect(page.getByText(/Horario guardado/)).toBeVisible({
    timeout: 15_000,
  });

  // At least one class row should show the new weekly time (adhoc one-offs may differ).
  await expect
    .poll(
      async () => {
        const values = await classRows(page)
          .locator('[data-testid="session-datetime"]')
          .evaluateAll((inputs) =>
            inputs.map((el) => (el as HTMLInputElement).value).filter(Boolean),
          );
        const hasFirst = values.some((value) => value.endsWith(`T${input.timeLocal}`));
        if (!input.timeLocal2) return hasFirst;
        return (
          hasFirst && values.some((value) => value.endsWith(`T${input.timeLocal2}`))
        );
      },
      { timeout: 15_000 },
    )
    .toBe(true);
}

export async function saveAdhocMeet(page: Page, meetUrl = MEET_URL) {
  await page.getByRole("button", { name: "Clase a clase" }).click();
  await page.locator('input[name="meetUrl"]').fill(meetUrl);
  await page.getByRole("button", { name: "Guardar horario" }).click();
  await expect(page.getByText(/Horario guardado/)).toBeVisible({
    timeout: 15_000,
  });
}

/** JS weekday (0=Sun) from a datetime-local date part, timezone-safe. */
export function weekdayFromDatetimeLocal(value: string): number {
  const datePart = value.split("T")[0] ?? "";
  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function classTable(page: Page) {
  return page.getByTestId("class-session-table");
}

export function classRows(page: Page) {
  return classTable(page).getByTestId("class-session-row");
}

export async function rowWithMeet(page: Page) {
  const row = classRows(page)
    .filter({ has: page.getByRole("link", { name: /Meet|Google Meet/i }) })
    .first();
  await expect(row).toBeVisible({ timeout: 15_000 });
  return row;
}

export async function rowWithDatetimeEnding(page: Page, timeSuffix: string) {
  const rows = classRows(page);
  await expect(rows.first()).toBeVisible({ timeout: 15_000 });
  const count = await rows.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = rows.nth(i);
    const value = await candidate.getByTestId("session-datetime").inputValue();
    if (value.endsWith(timeSuffix)) {
      return candidate;
    }
  }
  throw new Error(`No class row with datetime ending in ${timeSuffix}`);
}

export async function rowWithText(page: Page, text: string | RegExp) {
  const row = classRows(page).filter({ hasText: text }).first();
  await expect(row).toBeVisible({ timeout: 15_000 });
  return row;
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
