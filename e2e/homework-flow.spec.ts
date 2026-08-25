import { expect, test } from "@playwright/test";
import {
  e2eCreds,
  futureScheduledLocal,
  login,
  logout,
  materialCard,
  materialRow,
  uniqueTitle,
} from "./helpers";

const DRIVE_URL = "https://drive.google.com/file/d/e2e-test/view";
const STUDENT_LABEL = /Ana Alumna|alumno@bilingualboost\.test/;

test.describe("homework flow teacher → student → parent", () => {
  test("create, assign, mark Sí; student notes; parent read-only", async ({
    page,
  }) => {
    const title = uniqueTitle();
    const notes = `Apunte e2e ${Date.now()}`;

    await login(page, e2eCreds.teacher, /\/alumno\/profesor/);

    await page.locator("#material-title").fill(title);
    await page.locator("#material-url").fill(DRIVE_URL);
    await page.locator("#material-scheduled").fill(futureScheduledLocal());
    await page.getByRole("button", { name: "Guardar deber" }).click();

    const row = await materialRow(page, title);
    const assignToggle = row.locator("button[aria-expanded]");
    if ((await assignToggle.getAttribute("aria-expanded")) !== "true") {
      await assignToggle.click();
    }
    await expect(assignToggle).toHaveAttribute("aria-expanded", "true");

    const studentButton = row.getByRole("button").filter({ hasText: STUDENT_LABEL });
    await expect(studentButton).toBeVisible();
    await studentButton.click();

    const statusSelect = row.getByTestId("homework-status");
    await expect(statusSelect).toBeVisible({ timeout: 15_000 });
    await statusSelect.selectOption("done");
    await expect(statusSelect).toHaveValue("done");

    await logout(page);

    await login(page, e2eCreds.student, /\/alumno\/?$/);
    const studentCard = await materialCard(page, title);
    await expect(studentCard.getByText(/Estado.*Sí|Sí/)).toBeVisible();

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
    await expect(parentCard.getByText(/Estado.*Sí|Sí/)).toBeVisible();
    await expect(parentCard.getByTestId("class-notes")).toHaveCount(0);
    await expect(parentCard.getByLabel("Apuntes de clase")).toHaveCount(0);
  });
});
