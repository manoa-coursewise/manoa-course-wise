import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/auth/signin');
  }

  async signIn(email: string, password: string) {
    await this.page.locator('input[name="email"]').fill(email);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: /sign.?in/i }).click();
  }

  async expectAuthenticated() {
    // Wait for redirect away from the signin page
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/signin'), { timeout: 15000 });
    // Confirm the user dropdown button is present (shows email)
    await expect(this.page.locator('#login-dropdown')).toBeVisible({ timeout: 10000 });
  }
}
