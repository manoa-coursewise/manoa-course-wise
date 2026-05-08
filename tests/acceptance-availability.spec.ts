import { test, expect } from './auth-utils';
import { NavbarComponent } from './page-objects/NavbarComponent';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// ----- PUBLIC PAGES -----
test.describe('Public pages are available', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Mānoa CourseWise|CourseWise|Home/i);
  });

  test('sign in page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    await expect(page.getByRole('button', { name: /sign.?in/i })).toBeVisible({ timeout: 5000 });
  });

  test('sign up page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signup`);
    await expect(page.getByRole('button', { name: /create account|sign up|register/i })).toBeVisible({ timeout: 5000 });
  });

  test('not-authorized page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/not-authorized`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ----- AUTHENTICATED PAGES -----
test.describe('Authenticated pages are available', () => {
  test.describe.configure({ mode: 'serial' });

  test('navbar shows correct links after login', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/dashboard`);
    const navbar = new NavbarComponent(page);
    await navbar.expectLinkVisible('Search Courses');
    await navbar.expectLinkVisible('Professors');
    await navbar.expectLinkVisible('Submit Review');
    await navbar.expectLinkHidden('Admin');
  });

  test('search courses page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/courses/search`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('professors page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/professors`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('add stuff page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/add`);
    await expect(page.getByRole('heading', { name: 'Add Stuff' })).toBeVisible({ timeout: 5000 });
  });

  test('list stuff page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/list`);
    await expect(page.getByRole('heading', { name: 'Stuff' })).toBeVisible({ timeout: 5000 });
  });

  test('submit review page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/reviews/submit`);
    await expect(page.getByRole('heading', { name: 'Submit Review' })).toBeVisible({ timeout: 5000 });
  });

  test('dashboard page loads', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ----- ADMIN PAGES -----
test.describe('Admin pages are available', () => {
  test.describe.configure({ mode: 'serial' });

  test('admin navbar shows Admin link', async ({ getUserPage }) => {
    const page = await getUserPage('admin@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/dashboard`);
    const navbar = new NavbarComponent(page);
    await navbar.expectLinkVisible('Admin');
  });

  test('admin page loads', async ({ getUserPage }) => {
    const page = await getUserPage('admin@foo.com', 'changeme');
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.getByRole('heading', { name: 'List Stuff Admin' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('heading', { name: 'List Users Admin' })).toBeVisible({ timeout: 5000 });
  });
});
