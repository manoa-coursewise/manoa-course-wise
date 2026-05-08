import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/auth/signup');
  }

  async register(email: string, username: string, password: string) {
    await this.page.locator('input[name="email"]').fill(email);
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('input[name="confirmPassword"]').fill(password);
    await this.page.getByRole('button', { name: /create account|sign up|register/i }).click();
  }

  async expectRedirectedAfterSignUp() {
    // After signup, user is signed in and redirected to dashboard
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/'), { timeout: 15000 });
    await expect(this.page.locator('#login-dropdown')).toBeVisible({ timeout: 10000 });
  }
}
