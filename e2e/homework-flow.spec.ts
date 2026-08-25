import { expect, test, type Page } from "@playwright/test";
import {
  e2eCreds,
  login,
  logout,
  uniqueFutureScheduledLocal,
  uniqueTitle,
} from "./helpers";

const STUDENT_LABEL = /Ana Alumna|alumno@bilingualboost\.test/;
const MEET_URL = "https://meet.google.com/e2e-test-room";

async function selectStudent(page: Page, label: RegExp) {
  const select = page.getByTestId("selected-student");
  const option = select.locator("option").filter({ hasText: label }).first();
  const value = await option.getAttribute("value");
  expect(value).toBeTruthy();
  await select.selectOption(value!);
}

test.describe("homework flow teacher → student → parent", () => {
  test("class table: homework + status; student notes; parent read-only", async ({
    page,
  }) => {
    const marker = `e2e-${Date.now()}`;
    const exercise = [
      `Completa (${marker}):`,
      "Ella __ una oferta. (recibir)",
      "Nosotros __ ir al abogado. (querer)",
    ].join("\n");
    const notes = `Apunte ${marker}`;
    const extraTitle = uniqueTitle("E2E extra");

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);

    await selectStudent(page, STUDENT_LABEL);

    await page.getByRole("button", { name: "Horario fijo (cada semana)" }).click();
    await page.locator('select[name="weekday"]').selectOption("1");
    await page.locator('input[name="timeLocal"]').fill("18:00");
    await page.locator('input[name="meetUrl"]').fill(MEET_URL);
    await page.getByRole("button", { name: "Guardar horario" }).click();
    await expect(page.getByText(/Horario guardado/)).toBeVisible({
      timeout: 15_000,
    });

    const table = page.getByTestId("class-session-table");
    await expect(table).toBeVisible();
    const firstRow = table.getByTestId("class-session-row").first();
    await expect(firstRow).toBeVisible({ timeout: 15_000 });

    const rowWithMeet = table
      .getByTestId("class-session-row")
      .filter({ has: page.getByRole("link", { name: /Meet|Google Meet/i }) })
      .first();
    const homeworkRow = (await rowWithMeet.count()) > 0 ? rowWithMeet : firstRow;

    await homeworkRow.getByTestId("session-homework").fill(exercise);
    await homeworkRow.getByRole("button", { name: "Guardar deberes" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const statusSelect = homeworkRow.getByTestId("homework-status");
    await statusSelect.selectOption("done");
    await expect(statusSelect).toHaveValue("done");

    await page.locator("#material-title").fill(extraTitle);
    await page.locator("#material-description").fill("Recurso extra e2e");
    await page.getByRole("button", { name: "Guardar y asignar" }).click();
    await expect(page.getByText("Material guardado y asignado.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.locator("section").filter({ hasText: "Materiales extra" }).getByText(extraTitle),
    ).toBeVisible();
    await expect(table.getByText(extraTitle)).toHaveCount(0);

    await logout(page);

    await login(page, e2eCreds.student, /\/alumno\/?$/);
    const studentTable = page.getByTestId("class-session-table");
    const studentRow = studentTable
      .getByTestId("class-session-row")
      .filter({ hasText: marker })
      .first();
    await expect(studentRow).toBeVisible({ timeout: 15_000 });
    await expect(studentRow.getByTestId("homework-status-badge")).toContainText(/Sí/);
    await expect(studentRow.getByRole("link", { name: /Unirse a Meet/i })).toBeVisible();

    const notesBox = studentRow.getByTestId("class-notes");
    await expect(notesBox).toBeVisible();
    await notesBox.fill(notes);
    await notesBox.blur();
    await expect(page.getByText("Apuntes guardados")).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByText(extraTitle)).toBeVisible();
    await expect(studentTable.getByText(extraTitle)).toHaveCount(0);

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    const parentTable = page.getByTestId("class-session-table");
    const parentRow = parentTable
      .getByTestId("class-session-row")
      .filter({ hasText: marker })
      .first();
    await expect(parentRow).toBeVisible({ timeout: 15_000 });
    await expect(parentRow.getByTestId("homework-status-badge")).toContainText(/Sí/);
    await expect(parentRow.getByTestId("class-notes")).toHaveCount(0);
    await expect(parentTable.getByLabel("Apuntes de clase")).toHaveCount(0);
  });

  test("class-by-class: add session with shared Meet", async ({ page }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);

    await page.getByRole("button", { name: "Clase a clase" }).click();
    await page.locator('input[name="meetUrl"]').fill(MEET_URL);
    await page.getByRole("button", { name: "Guardar horario" }).click();
    await expect(page.getByText(/Horario guardado/)).toBeVisible({
      timeout: 15_000,
    });

    const when = uniqueFutureScheduledLocal();
    await page.getByTestId("add-class-datetime").fill(when);
    await page.getByRole("button", { name: "Crear clase" }).click();
    await expect(page.getByText("Clase añadida.")).toBeVisible({
      timeout: 15_000,
    });

    const row = page
      .getByTestId("class-session-row")
      .filter({ has: page.getByRole("link", { name: /Meet|Google Meet/i }) })
      .first();
    await expect(row).toBeVisible();
  });
});
