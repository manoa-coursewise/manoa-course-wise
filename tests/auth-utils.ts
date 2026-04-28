import { test as base, expect, Page } from '@playwright/test';

// Base configuration
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// Define our custom fixtures
interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}
/**
 * Authenticate using the UI with robust waiting and error handling
 */
async function authenticateWithUI(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  // Always authenticate via UI to avoid flaky shared session files across parallel browser projects.
  try {
    console.log(`→ Authenticating ${email} via UI...`);

    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Fill in credentials with retry logic
    await fillFormWithRetry(page, [
      { selector: 'input[name="email"]', value: email },
      { selector: 'input[name="password"]', value: password },
    ]);

    // Click submit button and wait for navigation
    const submitButton = page.getByRole('button', { name: /sign[ -]?in/i });
    if (!await submitButton.isVisible({ timeout: 1000 })) {
      // Try alternative selector if the first one doesn't work
      await page.getByRole('button', { name: /log[ -]?in/i }).click();
    } else {
      await submitButton.click();
    }


    // Wait for a clear post-login indicator (user button or sign out button)
    const userButton = page.getByRole('button', { name: email });
    const signOutButton = page.getByRole('button', { name: /sign out/i });
    await Promise.any([
      expect(userButton).toBeVisible({ timeout: 10000 }),
      expect(signOutButton).toBeVisible({ timeout: 10000 })
    ]);

    // Ensure the redirect triggered by signin has fully settled before tests start
    // issuing their own navigation calls (prevents interrupted goto in WebKit).
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    console.log(`✓ Successfully authenticated ${email}`);
  } catch (error) {
    console.error(`× Authentication failed for ${email}:`, error);

    throw new Error(`Authentication failed: ${error}`);
  }
}

/**
 * Helper to fill form fields with retry logic
 */
async function fillFormWithRetry(
  page: Page,
  fields: Array<{ selector: string; value: string }>
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.fill(field.value);
        await element.evaluate((el) => el.blur()); // Trigger blur event
        break;
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to fill field ${field.selector} after ${maxAttempts} attempts`);
        }
        await page.waitForTimeout(500);
      }
    }
  }
}

// Create custom test with authenticated fixtures
export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, fixtureCallback) => {
    const createUserPage = async (email: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

        await authenticateWithUI(page, email, password);
      return page;
    };

    await fixtureCallback(createUserPage);
  },
});

export { expect } from '@playwright/test';
