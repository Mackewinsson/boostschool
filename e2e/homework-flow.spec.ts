import { expect, test } from "@playwright/test";
import {
  e2eCreds,
  login,
  logout,
  materialCard,
  materialRow,
  uniqueTitle,
} from "./helpers";

const STUDENT_LABEL = /Ana Alumna|alumno@bilingualboost\.test/;
const MEET_URL = "https://meet.google.com/e2e-test-room";

test.describe("homework flow teacher → student → parent", () => {
  test("create text-only homework, assign, mark Sí; student notes; parent read-only", async ({
    page,
  }) => {
    const title = uniqueTitle();
    const exercise = [
      "Completa con la forma correcta:",
      "Ella __ una oferta. (recibir)",
      "Nosotros __ ir al abogado. (querer)",
    ].join("\n");
    const notes = `Apunte e2e ${Date.now()}`;

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);

    // Fixed schedule so assign auto-fills next class date + Meet
    const scheduleSection = page
      .locator("section")
      .filter({ hasText: "Horario fijo por alumno" });
    const scheduleCard = scheduleSection.locator("li").filter({ hasText: STUDENT_LABEL });
    await expect(scheduleCard).toBeVisible();
    await scheduleCard.locator('select[name="weekday"]').selectOption("1");
    await scheduleCard.locator('input[name="timeLocal"]').fill("18:00");
    await scheduleCard.locator('input[name="meetUrl"]').fill(MEET_URL);
    await scheduleCard.getByRole("button", { name: "Guardar horario" }).click();
    await expect(page.getByText("Horario guardado. Próximas clases generadas.")).toBeVisible({
      timeout: 15_000,
    });

    await page.locator("#material-title").fill(title);
    await page.locator("#material-description").fill(exercise);
    await expect(page.locator("#material-scheduled")).toHaveCount(0);
    await expect(page.locator("#material-meet")).toHaveCount(0);
    await page.getByRole("button", { name: "Guardar deber" }).click();

    const row = await materialRow(page, title);
    await expect(row.getByText(/0\s*\/\s*\d+/)).toHaveCount(0);

    const assignToggle = row.locator("button[aria-expanded]");
    if ((await assignToggle.getAttribute("aria-expanded")) !== "true") {
      await assignToggle.click();
    }
    await expect(assignToggle).toHaveAttribute("aria-expanded", "true");

    const studentButton = row.getByRole("button").filter({ hasText: STUDENT_LABEL });
    await expect(studentButton).toBeVisible();
    await studentButton.click();

    await expect(row.getByText(/\d{1,2}.+\d{4}/)).toBeVisible({ timeout: 15_000 });

    const statusSelect = row.getByTestId("homework-status");
    await expect(statusSelect).toBeVisible({ timeout: 15_000 });
    await statusSelect.selectOption("done");
    await expect(statusSelect).toHaveValue("done");

    await logout(page);

    await login(page, e2eCreds.student, /\/alumno\/?$/);
    const studentCard = await materialCard(page, title);
    await expect(studentCard.getByText("Ella __ una oferta.")).toBeVisible();
    await expect(studentCard.getByRole("link", { name: /Abrir/ })).toHaveCount(0);
    await expect(studentCard.getByText(/Estado.*Sí|Sí|Deber:\s*Sí/)).toBeVisible();

    const notesBox = studentCard.getByTestId("class-notes");
    await expect(notesBox).toBeVisible();
    await notesBox.fill(notes);
    await notesBox.blur();
    await expect(studentCard.getByText("Apuntes guardados")).toBeVisible({
      timeout: 15_000,
    });

    await logout(page);

    await login(page, e2eCreds.parent, /\/alumno\/?$/);
    const parentCard = await materialCard(page, title);
    await expect(parentCard.getByText("Ella __ una oferta.")).toBeVisible();
    await expect(parentCard.getByText(/Estado.*Sí|Sí|Deber:\s*Sí/)).toBeVisible();
    await expect(parentCard.getByTestId("class-notes")).toHaveCount(0);
    await expect(parentCard.getByLabel("Apuntes de clase")).toHaveCount(0);
  });
});
