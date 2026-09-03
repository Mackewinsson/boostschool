import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout } from "./helpers";

test.describe("teacher analytics tab", () => {
  test("teacher can open the overview with class and homework stats", async ({
    page,
  }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await page.getByTestId("teacher-nav").getByRole("link", { name: "Resumen" }).click();
    await expect(page).toHaveURL(/\/alumno\/profesor\/resumen/);
    const panel = page.getByTestId("teacher-analytics");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Resumen" })).toBeVisible();
    await expect(panel.getByText("Clases esta semana")).toBeVisible();
    await expect(panel.getByText("Deberes hechos")).toBeVisible();
    await expect(page.getByTestId("class-month-calendar")).toBeVisible();
    await expect(page.getByTestId("class-month-calendar")).toHaveAttribute(
      "data-calendar-variant",
      "allStudents",
    );
    await logout(page);
  });
});
