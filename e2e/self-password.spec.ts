import { expect, test } from "@playwright/test";
import { e2eCreds, login, logout, uniqueMarker } from "./helpers";

test.describe("self-serve password", () => {
  test("student changes a provisional password and signs in with the new one", async ({
    page,
  }) => {
    const marker = uniqueMarker("selfpw");
    const email = `${marker}@bilingualboost.test`;
    const provisional = "12345678";
    const nextPassword = "NuevaClave123!";

    await login(page, e2eCreds.admin, /\/alumno\/profesor/);
    await page.goto("/alumno/profesor/usuarios");

    const createForm = page.getByTestId("user-create-form");
    await createForm.locator('input[name="name"]').fill(`E2E ${marker}`);
    await createForm.locator('input[name="email"]').fill(email);
    await createForm.locator('select[name="role"]').selectOption("student");
    await createForm.locator('input[name="password"]').fill(provisional);
    await createForm.getByRole("button", { name: "Crear usuario" }).click();
    await page.waitForURL(/\/alumno\/profesor\/usuarios\/[0-9a-f-]+/i);

    await logout(page);
    await login(page, { email, password: provisional }, /\/alumno\/?$/);

    await page.getByRole("link", { name: "Contraseña" }).first().click();
    await expect(page).toHaveURL(/\/alumno\/cuenta/);

    const form = page.getByTestId("own-password-form");
    await expect(form).toBeVisible();

    await form.locator('input[name="currentPassword"]').fill(provisional);
    await form.locator('input[name="password"]').fill(nextPassword);
    await form.locator('input[name="passwordConfirm"]').fill("NoCoincide123!");
    await form.getByRole("button", { name: "Guardar contraseña" }).click();
    await expect(page.getByText(/no coinciden/i)).toBeVisible();

    await form.locator('input[name="currentPassword"]').fill("wrong-pass");
    await form.locator('input[name="password"]').fill(nextPassword);
    await form.locator('input[name="passwordConfirm"]').fill(nextPassword);
    await form.getByRole("button", { name: "Guardar contraseña" }).click();
    await expect(page.getByText(/actual no es correcta/i)).toBeVisible();

    await form.locator('input[name="currentPassword"]').fill(provisional);
    await form.locator('input[name="password"]').fill(nextPassword);
    await form.locator('input[name="passwordConfirm"]').fill(nextPassword);
    await form.getByRole("button", { name: "Guardar contraseña" }).click();
    await expect(page.getByTestId("own-password-success")).toBeVisible();

    await logout(page);
    await login(page, { email, password: nextPassword }, /\/alumno\/?$/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
  });
});
