import { expect, test } from "@playwright/test";
import {
  e2eCreds,
  login,
  logout,
  rowWithMeet,
  saveAdhocMeet,
  selectStudent,
  uniqueFutureScheduledLocal,
  uniqueMarker,
} from "./helpers";

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

test.describe("parent linked to several students", () => {
  test("parent can switch between linked students", async ({ page }) => {
    const marker = uniqueMarker("multi");
    const nameA = `Alfa ${marker}`;
    const nameB = `Beta ${marker}`;
    const emailA = `alfa-${marker}@bilingualboost.test`;
    const emailB = `beta-${marker}@bilingualboost.test`;
    const parentEmail = `padre-${marker}@bilingualboost.test`;
    const password = "Prueba123!";
    const exercise = `Deber solo Alfa (${marker})`;
    const when = uniqueFutureScheduledLocal();

    async function createUser(input: {
      name: string;
      email: string;
      role: "student" | "parent";
      linkNames?: string[];
    }) {
      await page.goto("/alumno/profesor/usuarios");
      const form = page.getByTestId("user-create-form");
      await form.locator('input[name="name"]').fill(input.name);
      await form.locator('input[name="email"]').fill(input.email);
      await form.locator('select[name="role"]').selectOption(input.role);
      if (input.linkNames) {
        for (const linkName of input.linkNames) {
          await form.getByRole("checkbox", { name: linkName }).check();
        }
      }
      await form.locator('input[name="password"]').fill(password);
      await form.getByRole("button", { name: "Crear usuario" }).click();
      await page.waitForURL(/\/alumno\/profesor\/usuarios\/[0-9a-f-]+/i);
    }

    await login(page, e2eCreds.admin, /\/alumno\/profesor/);
    await createUser({ name: nameA, email: emailA, role: "student" });
    await createUser({ name: nameB, email: emailB, role: "student" });
    await createUser({
      name: `Padre ${marker}`,
      email: parentEmail,
      role: "parent",
      linkNames: [nameA, nameB],
    });

    await expect(page.getByRole("checkbox", { name: nameA })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: nameB })).toBeChecked();

    await page.goto("/alumno/profesor");
    const studentSelect = page.getByTestId("selected-student");
    await expect(studentSelect.locator("option", { hasText: nameA })).toBeAttached({
      timeout: 15_000,
    });
    await selectStudent(page, new RegExp(nameA));
    await saveAdhocMeet(page);
    await page.getByTestId("add-class-datetime").fill(when);
    await page.getByRole("button", { name: "Crear clase" }).click();
    await expect(page.getByText("Clase añadida.")).toBeVisible({ timeout: 15_000 });
    const newRow = await rowWithMeet(page);
    await newRow.getByTestId("session-homework").fill(exercise);
    await newRow.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({ timeout: 15_000 });

    await logout(page);
    await login(page, { email: parentEmail, password }, /\/alumno\/?$/);
    await expect(page.getByTestId("parent-dashboard")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("parent-student-switcher")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      `El progreso de ${nameA}`,
    );
    await expect(page.getByText(exercise)).toBeVisible();

    await page.getByTestId("parent-student-switcher").selectOption({ label: nameB });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      `El progreso de ${nameB}`,
    );
    await expect(page.getByText(exercise)).toHaveCount(0);

    await page.getByTestId("parent-student-switcher").selectOption({ label: nameA });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      `El progreso de ${nameA}`,
    );
    await expect(page.getByText(exercise)).toBeVisible();
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
