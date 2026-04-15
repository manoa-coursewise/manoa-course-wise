import { test, expect } from './auth-utils';

test.slow();
test('can authenticate a specific user', async ({ getUserPage }) => {

  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await customUserPage.goto('http://localhost:3000/');
  await expect(
    customUserPage.getByRole('button', { name: 'john@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Verify current landing-page navigation links.
  await expect(
    customUserPage.getByRole('link', { name: 'Mānoa CourseWise' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: 'Search Courses' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: 'Professors' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: 'Schedule Builder' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: 'Submit Review' })
  ).toBeVisible({ timeout: 5000 });

  // Standard users should not see admin navigation.
  await expect(
    customUserPage.getByRole('link', { name: 'Admin' })
  ).toHaveCount(0);

  // Protected app pages are still valid and should be reachable when authenticated.
  await customUserPage.goto('http://localhost:3000/add');
  await expect(
    customUserPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.goto('http://localhost:3000/list');
  await expect(
    customUserPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

});
