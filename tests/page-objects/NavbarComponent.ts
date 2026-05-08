import { Page, expect, Locator } from '@playwright/test';

export class NavbarComponent {
  readonly page: Page;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('#basic-navbar-nav');
  }

  async expectLinkVisible(name: string | RegExp) {
    await expect(this.nav.getByRole('link', { name })).toBeVisible({ timeout: 5000 });
  }

  async expectLinkHidden(name: string | RegExp) {
    await expect(this.nav.getByRole('link', { name })).toHaveCount(0);
  }
}
