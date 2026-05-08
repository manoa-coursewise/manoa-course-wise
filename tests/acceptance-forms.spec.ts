import { test, expect } from '@playwright/test';
import { SignInPage } from './page-objects/SignInPage';
import { SignUpPage } from './page-objects/SignUpPage';
import { AddStuffPage } from './page-objects/AddStuffPage';
import { SubmitReviewPage } from './page-objects/SubmitReviewPage';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// ----- SIGN UP FORM -----
test.describe('Sign up form', () => {
  test('user can register a new account', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.open();

    // Use a unique suffix to avoid conflicts between parallel browser runs
    const unique = `${Date.now()}${Math.floor(Math.random() * 9000 + 1000)}`;
    const email = `testuser_${unique}@testmail.com`;
    const username = `user_${unique}`.slice(0, 20);

    await signUpPage.register(email, username, 'password123');
    await signUpPage.expectRedirectedAfterSignUp();
  });
});

// ----- SIGN IN FORM -----
test.describe('Sign in form', () => {
  test('existing user can sign in with email', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.open();
    await signInPage.signIn('john@foo.com', 'changeme');
    await signInPage.expectAuthenticated();
  });
});

// ----- ADD STUFF FORM -----
test.describe('Add Stuff form', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.open();
    await signInPage.signIn('john@foo.com', 'changeme');
    await signInPage.expectAuthenticated();
  });

  test('user can add a new item', async ({ page }) => {
    const addPage = new AddStuffPage(page);
    await addPage.open();
    await addPage.expectLoaded();
    await addPage.addItem('Test Widget', 3, 'good');
    await addPage.expectRedirectedToList();
    // Verify the new item appears in the list
    await expect(page.getByRole('cell', { name: 'Test Widget' })).toBeVisible({ timeout: 5000 });
  });
});

// ----- SUBMIT REVIEW FORM -----
test.describe('Submit Review form', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.open();
    await signInPage.signIn('john@foo.com', 'changeme');
    await signInPage.expectAuthenticated();
  });

  test('user can submit a course review', async ({ page }) => {
    const reviewPage = new SubmitReviewPage(page);
    await reviewPage.open();
    await reviewPage.expectLoaded();
    await reviewPage.submitReview('This course was very informative and well structured. Highly recommend.');
    await reviewPage.expectRedirectedAfterSubmit();
  });
});
