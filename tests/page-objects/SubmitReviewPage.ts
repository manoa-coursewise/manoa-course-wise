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
    // Select first available course (default selection)
    // Fill in a required text review
    await this.page.locator('textarea[name="text"]').fill(reviewText);
    // Submit the form
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async expectRedirectedAfterSubmit() {
    // After submitting, app redirects to course details.
    await this.page.waitForURL(
      (url) => url.pathname.startsWith('/courses/details/'),
      { timeout: 10000 },
    );
  }
}
