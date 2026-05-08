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

  async submitReview(reviewText: string) {
    // Pick a course that has at least one professor option.
    const courseSelect = this.page.locator('select[name="courseCode"]');
    const professorSelect = this.page.locator('select[name="professor"]');

    const courseValues = await courseSelect.locator('option').evaluateAll((options) =>
      options
        .map((option) => (option as HTMLOptionElement).value)
        .filter((value) => Boolean(value)),
    );

    for (const courseValue of courseValues) {
      await courseSelect.selectOption(courseValue);
      await this.page.waitForTimeout(100);
      const professorCount = await professorSelect.locator('option').count();
      if (professorCount > 0) {
        await professorSelect.selectOption({ index: 0 });
        break;
      }
    }

    // Fill in a required text review.
    await this.page.locator('textarea[name="text"]').fill(reviewText);
    // Submit the form.
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async expectRedirectedAfterSubmit() {
    // Accept either expected redirect or visible success message.
    try {
      await this.page.waitForURL((url) => url.pathname.startsWith('/courses/details/'), { timeout: 10000 });
      return;
    } catch {
      await expect(this.page.getByText('Your review has been submitted')).toBeVisible({ timeout: 10000 });
    }
  }
}
