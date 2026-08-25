import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout } from "./helpers";

test.describe("portal auth by role", () => {
  test("teacher lands on /alumno/profesor", async ({ page }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await expect(page).toHaveURL(/\/alumno\/profesor/);
    await logout(page);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("student lands on /alumno", async ({ page }) => {
    await login(page, e2eCreds.student, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
    await logout(page);
  });

  test("parent lands on /alumno", async ({ page }) => {
    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
    await logout(page);
  });
});
