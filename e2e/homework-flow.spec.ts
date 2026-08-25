import { expect, test } from "@playwright/test";
import {
  STUDENT_LABEL,
  classRows,
  classTable,
  e2eCreds,
  login,
  logout,
  rowWithDatetimeEnding,
  rowWithMeet,
  rowWithText,
  saveAdhocMeet,
  saveWeeklySchedule,
  selectStudent,
  uniqueFutureScheduledLocal,
  uniqueMarker,
  uniqueTitle,
} from "./helpers";

test.describe("class table homework flow", () => {
  test("teacher assigns homework + status; student notes; parent read-only", async ({
    page,
  }) => {
    const marker = uniqueMarker();
    const exercise = [
      `Completa (${marker}):`,
      "Ella __ una oferta. (recibir)",
      "Nosotros __ ir al abogado. (querer)",
    ].join("\n");
    const notes = `Apunte ${marker}`;
    const extraTitle = uniqueTitle("E2E extra");

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    const table = classTable(page);
    await expect(table).toBeVisible();
    const homeworkRow = await rowWithDatetimeEnding(page, "T18:00");

    await homeworkRow.getByTestId("session-homework").fill(exercise);
    await homeworkRow.getByRole("button", { name: "Guardar deberes" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const statusSelect = (await rowWithText(page, marker)).getByTestId("homework-status");
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
    const studentRow = await rowWithText(page, marker);
    await expect(studentRow.getByTestId("homework-status-badge")).toContainText(/Sí/);
    await expect(studentRow.getByRole("link", { name: /Unirse a Meet/i })).toBeVisible();
    await expect(studentRow.getByTestId("homework-status")).toHaveCount(0);

    const notesBox = studentRow.getByTestId("class-notes");
    await expect(notesBox).toBeVisible();
    await notesBox.fill(notes);
    await notesBox.blur();
    await expect(page.getByText("Apuntes guardados")).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByText(extraTitle)).toBeVisible();
    await expect(classTable(page).getByText(extraTitle)).toHaveCount(0);

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toContainText(/Sí/);
    await expect(parentRow.getByRole("link", { name: /Unirse a Meet/i })).toBeVisible();
    await expect(parentRow.getByTestId("class-notes")).toHaveCount(0);
    await expect(parentRow.getByTestId("homework-status")).toHaveCount(0);
    await expect(page.getByLabel("Apuntes de clase")).toHaveCount(0);
  });

  test("class-by-class: add session, homework, student and parent see it", async ({
    page,
  }) => {
    const marker = uniqueMarker("adhoc");
    const exercise = `Deber adhoc (${marker})`;
    const when = uniqueFutureScheduledLocal();

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveAdhocMeet(page);

    await page.getByTestId("add-class-datetime").fill(when);
    await page.getByRole("button", { name: "Crear clase" }).click();
    await expect(page.getByText("Clase añadida.")).toBeVisible({
      timeout: 15_000,
    });

    // Prefer the newly created row: match Meet + empty homework, then write marker
    const newRow = await rowWithMeet(page);
    await newRow.getByTestId("session-homework").fill(exercise);
    await newRow.getByRole("button", { name: "Guardar deberes" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const statusSelect = (await rowWithText(page, marker)).getByTestId("homework-status");
    await statusSelect.selectOption("partial");
    await expect(statusSelect).toHaveValue("partial");

    await logout(page);

    await login(page, e2eCreds.student, /\/alumno\/?$/);
    const studentRow = await rowWithText(page, marker);
    await expect(studentRow.getByTestId("session-homework-text")).toContainText(marker);
    await expect(studentRow.getByTestId("homework-status-badge")).toContainText(/Parcialmente/);
    await expect(studentRow.getByRole("link", { name: /Unirse a Meet/i })).toBeVisible();

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("session-homework-text")).toContainText(marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toContainText(/Parcialmente/);
    await expect(parentRow.getByTestId("class-notes")).toHaveCount(0);
  });

  test("changing weekly time realigns all future classes and keeps homework", async ({
    page,
  }) => {
    const marker = uniqueMarker("realign");
    const exercise = `Realign homework (${marker})`;

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    const homeworkRow = await rowWithDatetimeEnding(page, "T18:00");
    await homeworkRow.getByTestId("session-homework").fill(exercise);
    await homeworkRow.getByRole("button", { name: "Guardar deberes" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "20:00" });

    const updatedRow = await rowWithText(page, marker);
    await expect
      .poll(async () => updatedRow.getByTestId("session-datetime").inputValue(), {
        timeout: 15_000,
      })
      .toMatch(/T20:00$/);
    await expect(updatedRow.getByTestId("session-homework")).toHaveValue(
      new RegExp(marker),
    );

    // Every future class row should now be 20:00 (no leftover old times)
    const times = await classRows(page)
      .locator('[data-testid="session-datetime"]')
      .evaluateAll((inputs) =>
        inputs.map((el) => (el as HTMLInputElement).value).filter(Boolean),
      );
    expect(times.length).toBeGreaterThan(0);
    expect(times.every((value) => value.endsWith("T20:00"))).toBe(true);
  });

  test("teacher can edit session datetime and mark not_done for parent", async ({
    page,
  }) => {
    const marker = uniqueMarker("edit-date");
    const exercise = `Edit date (${marker})`;
    const when = uniqueFutureScheduledLocal();

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "2", timeLocal: "17:30" });

    const row = await rowWithMeet(page);
    await row.getByTestId("session-datetime").fill(when);
    await row.getByTestId("session-homework").fill(exercise);
    await row.getByRole("button", { name: "Guardar deberes" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const savedRow = await rowWithText(page, marker);
    await expect(savedRow.getByTestId("session-datetime")).toHaveValue(when);

    await savedRow.getByTestId("homework-status").selectOption("not_done");
    await expect(savedRow.getByTestId("homework-status")).toHaveValue("not_done");

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toContainText(/^No$/);
    await expect(parentRow.getByTestId("session-homework-text")).toContainText(marker);
  });

  test("extras stay outside class table and can be deleted", async ({ page }) => {
    const extraTitle = uniqueTitle("E2E extra-del");

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);

    await page.locator("#material-title").fill(extraTitle);
    await page.locator("#material-description").fill("Extra to delete");
    await page.getByRole("button", { name: "Guardar y asignar" }).click();
    await expect(page.getByText("Material guardado y asignado.")).toBeVisible({
      timeout: 15_000,
    });

    const extrasSection = page.locator("section").filter({ hasText: "Materiales extra" });
    await expect(extrasSection.getByText(extraTitle)).toBeVisible();
    await expect(classTable(page).getByText(extraTitle)).toHaveCount(0);

    const extraItem = extrasSection.locator("li").filter({ hasText: extraTitle });
    await extraItem.getByRole("button", { name: "Eliminar" }).click();
    await expect(extrasSection.getByText(extraTitle)).toHaveCount(0);

    await logout(page);

    await login(page, e2eCreds.student, /\/alumno\/?$/);
    await expect(page.getByText(extraTitle)).toHaveCount(0);
  });

  test("student cannot open teacher area", async ({ page }) => {
    await login(page, e2eCreds.student, /\/alumno\/?$/);
    await page.goto("/alumno/profesor");
    await expect(page).not.toHaveURL(/\/alumno\/profesor/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
  });

  test("parent cannot open teacher area", async ({ page }) => {
    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    await page.goto("/alumno/profesor");
    await expect(page).not.toHaveURL(/\/alumno\/profesor/);
    await expect(page).toHaveURL(/\/alumno\/?$/);
  });
});
