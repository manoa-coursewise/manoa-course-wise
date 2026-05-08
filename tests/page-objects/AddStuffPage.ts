import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddStuffPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/add');
  }

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Add Stuff' })).toBeVisible({ timeout: 5000 });
  }

  async addItem(name: string, quantity: number, condition: 'excellent' | 'good' | 'fair' | 'poor') {
    await this.page.locator('input[name="name"]').fill(name);
    await this.page.locator('input[name="quantity"]').fill(String(quantity));
    await this.page.locator('select[name="condition"]').selectOption(condition);
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async expectRedirectedToList() {
    await this.page.waitForURL((url) => url.pathname === '/list', { timeout: 10000 });
  }
}
