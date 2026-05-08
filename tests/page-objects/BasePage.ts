import { Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    try {
      await this.page.goto(url);
    } catch {
      // Retry once for occasional browser-side navigation interruption errors.
      await this.page.goto(url);
    }
    await this.page.waitForLoadState('domcontentloaded');
  }
}
