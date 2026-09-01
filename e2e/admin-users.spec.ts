import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout, uniqueMarker } from "./helpers";

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
