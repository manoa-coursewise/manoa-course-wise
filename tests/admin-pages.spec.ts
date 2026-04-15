import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('http://localhost:3000/');
  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Check for current landing-page navigation elements.
  await expect(
    adminPage.getByRole('link', { name: 'Mānoa CourseWise' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Search Courses' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Professors' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Schedule Builder' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Submit Review' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Admin' })
  ).toBeVisible({ timeout: 5000 });

  // Test Admin page.
  await adminPage.goto('http://localhost:3000/admin');
  await expect(
    adminPage.getByRole('heading', { name: 'List Stuff Admin' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('heading', { name: 'List Users Admin' })
  ).toBeVisible({ timeout: 5000 });

});