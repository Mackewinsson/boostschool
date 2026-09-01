import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout, uniqueMarker } from "./helpers";

test.describe("admin user student link", () => {
  test("vincular alumno only appears for parent role", async ({ page }) => {
    await login(page, e2eCreds.admin, /\/alumno\/profesor/);
    await page.goto("/alumno/profesor/usuarios");

    const createForm = page.getByTestId("user-create-form");
    const studentLink = createForm.getByTestId("user-student-link");

    await expect(createForm.locator('select[name="role"]')).toHaveValue("student");
    await expect(studentLink).toHaveCount(0);

    await createForm.locator('select[name="role"]').selectOption("teacher");
    await expect(studentLink).toHaveCount(0);

    await createForm.locator('select[name="role"]').selectOption("admin");
    await expect(studentLink).toHaveCount(0);

    await createForm.locator('select[name="role"]').selectOption("parent");
    await expect(studentLink).toBeVisible();

    await createForm.locator('select[name="role"]').selectOption("student");
    await expect(studentLink).toHaveCount(0);
  });
});

test.describe("admin user password", () => {
  test("admin can set a new password and the user can sign in with it", async ({
    page,
  }) => {
    const marker = uniqueMarker("pw");
    const email = `${marker}@bilingualboost.test`;
    const initialPassword = "Inicial123!";
    const nextPassword = "NuevaClave123!";

    await login(page, e2eCreds.admin, /\/alumno\/profesor/);
    await page.goto("/alumno/profesor/usuarios");

    const createForm = page.getByTestId("user-create-form");
    await createForm.locator('input[name="name"]').fill(`E2E ${marker}`);
    await createForm.locator('input[name="email"]').fill(email);
    await createForm.locator('select[name="role"]').selectOption("student");
    await createForm.locator('input[name="password"]').fill(initialPassword);
    await createForm.getByRole("button", { name: "Crear usuario" }).click();
    await page.waitForURL(/\/alumno\/profesor\/usuarios\/[0-9a-f-]+/i);

    const passwordForm = page.getByTestId("user-password-form");
    await expect(passwordForm).toBeVisible();

    await passwordForm.locator('input[name="password"]').fill(nextPassword);
    await passwordForm
      .locator('input[name="passwordConfirm"]')
      .fill("NoCoincide123!");
    await passwordForm
      .getByRole("button", { name: "Actualizar contraseña" })
      .click();
    await expect(page.getByText(/no coinciden/i)).toBeVisible();

    await passwordForm.locator('input[name="password"]').fill(nextPassword);
    await passwordForm.locator('input[name="passwordConfirm"]').fill(nextPassword);
    await passwordForm
      .getByRole("button", { name: "Actualizar contraseña" })
      .click();
    await expect(page.getByText("Contraseña actualizada.")).toBeVisible();

    await logout(page);
    await login(page, { email, password: nextPassword }, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
  });
});
