import { expect, test } from "@playwright/test";

test.describe("public smoke", () => {
  test("landing loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("sign-in shows email/password form (no Clerk)", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    await expect(page.locator("text=Clerk")).toHaveCount(0);
    await expect(page.locator("[data-clerk-component]")).toHaveCount(0);
  });
});
