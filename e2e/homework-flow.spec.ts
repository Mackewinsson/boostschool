import { expect, test } from "@playwright/test";
import {
  MEET_URL,
  STUDENT_LABEL,
  classRows,
  classTable,
  e2eCreds,
  futureThursdayAt,
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
  weekdayFromDatetimeLocal,
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
    await saveWeeklySchedule(page, {
      weekday: "1",
      timeLocal: "18:00",
      horizonWeeks: "12",
    });

    const table = classTable(page);
    await expect(table).toBeVisible();
    const calendar = page.getByTestId("class-month-calendar");
    await expect(calendar).toBeVisible();
    const calendarChip = calendar.getByTestId("calendar-session-chip").first();
    for (let i = 0; i < 3; i += 1) {
      if (await calendarChip.isVisible()) break;
      await calendar.getByLabel("Mes siguiente").click();
    }
    await expect(calendarChip).toBeVisible();
    await calendarChip.click();
    const homeworkRow = await rowWithDatetimeEnding(page, "T18:00");

    await homeworkRow.getByTestId("session-homework").fill(exercise);
    await homeworkRow.getByRole("button", { name: "Guardar" }).click();
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
    await expect(studentRow.getByTestId("session-homework-text")).toContainText(marker);
    await expect(studentRow.getByTestId("homework-status-badge")).toHaveCount(0);
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
    await expect(page.getByTestId("parent-dashboard")).toBeVisible();
    await expect(page.getByTestId("parent-linked-student")).toContainText(/Ana Alumna|alumno@bilingualboost\.test/);
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("session-homework-text")).toContainText(marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toHaveAttribute(
      "data-status",
      "done",
    );
    await expect(parentRow.getByRole("link", { name: /Unirse a Meet|Meet/i })).toHaveCount(0);
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
    await newRow.getByRole("button", { name: "Guardar" }).click();
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
    await expect(studentRow.getByTestId("homework-status-badge")).toHaveCount(0);
    await expect(studentRow.getByTestId("homework-status")).toHaveCount(0);
    await expect(studentRow.getByRole("link", { name: /Unirse a Meet/i })).toBeVisible();

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    await expect(page.getByTestId("parent-dashboard")).toBeVisible();
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("session-homework-text")).toContainText(marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toHaveAttribute(
      "data-status",
      "partial",
    );
    await expect(parentRow.getByTestId("homework-status")).toHaveCount(0);
    await expect(parentRow.getByRole("link", { name: /Unirse a Meet|Meet/i })).toHaveCount(0);
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
    await homeworkRow.getByRole("button", { name: "Guardar" }).click();
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

    // Upcoming weekly slots should be 20:00 (past / ad-hoc one-offs may differ)
    const times = await classRows(page)
      .locator('[data-testid="session-datetime"]')
      .evaluateAll((inputs) =>
        inputs.map((el) => (el as HTMLInputElement).value).filter(Boolean),
      );
    expect(times.some((value) => value.endsWith("T20:00"))).toBe(true);
    expect(times.filter((value) => value.endsWith("T18:00")).length).toBe(0);
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
    await row.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const savedRow = await rowWithText(page, marker);
    await expect(savedRow.getByTestId("session-datetime")).toHaveValue(when);

    await savedRow.getByTestId("homework-status").selectOption("not_done");
    await expect(savedRow.getByTestId("homework-status")).toHaveValue("not_done");

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    await expect(page.getByTestId("parent-dashboard")).toBeVisible();
    const parentRow = await rowWithText(page, marker);
    await expect(parentRow.getByTestId("homework-status-badge")).toHaveAttribute(
      "data-status",
      "not_done",
    );
    await expect(parentRow.getByTestId("homework-status")).toHaveCount(0);
    await expect(parentRow.getByTestId("session-homework-text")).toContainText(marker);
  });

  test("twice-weekly schedule generates both days with the same Meet link", async ({
    page,
  }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, {
      weekday: "1",
      timeLocal: "18:00",
      weekday2: "4",
      timeLocal2: "18:00",
      horizonWeeks: "6",
    });

    const values = await classRows(page)
      .locator('[data-testid="session-datetime"]')
      .evaluateAll((inputs) =>
        inputs.map((el) => (el as HTMLInputElement).value).filter(Boolean),
      );
    const weekdays = new Set(
      values
        .filter((value) => value.endsWith("T18:00"))
        .map((value) => weekdayFromDatetimeLocal(value)),
    );
    expect(weekdays.has(1)).toBe(true);
    expect(weekdays.has(4)).toBe(true);

    const meetLinks = classRows(page).getByRole("link", { name: /Meet/i });
    await expect(meetLinks.first()).toBeVisible();
    const hrefs = await meetLinks.evaluateAll((anchors) =>
      anchors.map((el) => (el as HTMLAnchorElement).href),
    );
    expect(hrefs.length).toBeGreaterThan(1);
    expect(hrefs.every((href) => href.includes(MEET_URL))).toBe(true);
    expect(new Set(hrefs).size).toBe(1);
  });

  test("duplicate weekday and time shows a clear error and does not save", async ({
    page,
  }) => {
    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    await page.getByTestId("schedule-add-slot").click();
    await page.locator('select[name="weekday-1"]').selectOption("1");
    const time2 = page.locator('input[name="timeLocal-1"]');
    await time2.click();
    await time2.fill("18:00");
    await expect(time2).toHaveValue("18:00");

    await page.getByRole("button", { name: "Guardar horario" }).click();
    await expect(page.getByTestId("schedule-form-error")).toHaveText(
      "Dos clases no pueden ser el mismo día a la misma hora.",
    );
    await expect(page.getByTestId("schedule-slot-1")).toBeVisible();
  });

  test("saving the weekly schedule does not delete a manual extra class", async ({
    page,
  }) => {
    const when = futureThursdayAt("15:17");

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    await page.getByTestId("add-class-datetime").fill(when);
    await page.getByRole("button", { name: "Crear clase" }).click();
    await expect(page.getByText("Clase añadida.")).toBeVisible({
      timeout: 15_000,
    });
    await expect
      .poll(async () => {
        const values = await classRows(page)
          .locator('[data-testid="session-datetime"]')
          .evaluateAll((inputs) =>
            inputs.map((el) => (el as HTMLInputElement).value),
          );
        return values.includes(when);
      })
      .toBe(true);

    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    const valuesAfter = await classRows(page)
      .locator('[data-testid="session-datetime"]')
      .evaluateAll((inputs) =>
        inputs.map((el) => (el as HTMLInputElement).value),
      );
    expect(valuesAfter).toContain(when);
  });

  test("moving one class keeps that date after saving the weekly schedule", async ({
    page,
  }) => {
    const when = futureThursdayAt("15:13");

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);
    await selectStudent(page, STUDENT_LABEL);
    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    const weeklyRow = await rowWithDatetimeEnding(page, "T18:00");
    const sessionId = await weeklyRow.getAttribute("data-session-id");
    expect(sessionId).toBeTruthy();

    await weeklyRow.getByTestId("session-datetime").fill(when);
    await weeklyRow.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Cambios guardados.")).toBeVisible({
      timeout: 15_000,
    });

    const moved = page.locator(`[data-session-id="${sessionId}"]`);
    await expect(moved.getByTestId("session-datetime")).toHaveValue(when);
    await expect(moved.getByTestId("session-rescheduled")).toBeVisible();

    await saveWeeklySchedule(page, { weekday: "1", timeLocal: "18:00" });

    const stillMoved = page.locator(`[data-session-id="${sessionId}"]`);
    await expect(stillMoved.getByTestId("session-datetime")).toHaveValue(when);
    await expect(stillMoved.getByTestId("session-rescheduled")).toBeVisible();
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
