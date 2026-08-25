import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout } from "./helpers";

test.describe("portal auth by role", () => {
  test("teacher lands on /alumno/profesor", async ({ page }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await expect(page).toHaveURL(/\/alumno\/profesor/);
    await expect(page.getByTestId("selected-student")).toBeVisible();
    await logout(page);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("student lands on /alumno with class table", async ({ page }) => {
    await login(page, e2eCreds.student, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
    await expect(page.getByTestId("class-session-table")).toBeVisible({
      timeout: 15_000,
    });
    await logout(page);
  });

  test("parent lands on /alumno with class table", async ({ page }) => {
    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
    await expect(page.getByTestId("class-session-table")).toBeVisible({
      timeout: 15_000,
    });
    await logout(page);
  });

  test("bad credentials stay on sign-in", async ({ page }) => {
    await page.goto("/sign-in");
    await page.locator('input[name="email"]').fill("nobody@bilingualboost.test");
    await page.locator('input[name="password"]').fill("WrongPass999!");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByText(/incorrectos|incorrect/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
