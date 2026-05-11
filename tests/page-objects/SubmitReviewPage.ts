import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SubmitReviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/reviews/submit');
  }

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Submit Review' })).toBeVisible({ timeout: 5000 });
  }

  async submitReview(reviewText: string, selection?: { courseCode: string; professor: string }) {
    // Pick a course/professor combination that is guaranteed to be valid.
    const courseSelect = this.page.locator('select[name="courseCode"]');
    const professorSelect = this.page.locator('select[name="professor"]');

    if (selection) {
      await courseSelect.selectOption(selection.courseCode);
      await professorSelect.selectOption(selection.professor, { timeout: 5000 });
    } else {
      const courseValues = await courseSelect.locator('option').evaluateAll((options) =>
        options
          .map((option) => (option as HTMLOptionElement).value)
          .filter((value) => Boolean(value)),
      );

      for (const courseValue of courseValues) {
        await courseSelect.selectOption(courseValue);
        const professorValues = await professorSelect.locator('option').evaluateAll((options) =>
          options
            .map((option) => (option as HTMLOptionElement).value)
            .filter((value) => Boolean(value)),
        );
        if (professorValues.length > 0) {
          await professorSelect.selectOption(professorValues[0]);
          break;
        }
      }
    }

    // Fill in a required text review.
    await this.page.locator('textarea[name="text"]').fill(reviewText);
    // Submit the form.
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async expectRedirectedAfterSubmit() {
    // The server action uses Next.js soft (client-side) navigation, so we poll
    // the URL directly rather than waiting for a browser navigation event.
    await expect(this.page).toHaveURL(/\/courses\/details\//, { timeout: 30000 });
  }
}
