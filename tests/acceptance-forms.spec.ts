import { test, expect } from './auth-utils';
import { SignInPage } from './page-objects/SignInPage';
import { SignUpPage } from './page-objects/SignUpPage';
import { AddStuffPage } from './page-objects/AddStuffPage';
import { SubmitReviewPage } from './page-objects/SubmitReviewPage';
import { PrismaClient } from '@prisma/client';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const REVIEW_COURSE_CODE = 'PLAYWRIGHT 101';
const REVIEW_PROFESSOR_NAME = 'Playwright Test Professor';

async function ensureReviewSubmissionData(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { classId: REVIEW_COURSE_CODE },
    update: {},
    create: { classId: REVIEW_COURSE_CODE, name: 'Playwright Test Course' },
    select: { id: true },
  });

  await prisma.professor.upsert({
    where: {
      courseId_name: {
        courseId: course.id,
        name: REVIEW_PROFESSOR_NAME,
      },
    },
    update: {},
    create: {
      courseId: course.id,
      name: REVIEW_PROFESSOR_NAME,
    },
  });
}

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
  test('user can add a new item', async ({ getUserPage }) => {
    test.slow();
    const page = await getUserPage('john@foo.com', 'changeme');
    const addPage = new AddStuffPage(page);
    await addPage.open();
    await addPage.expectLoaded();
    const itemName = `Test Widget ${Date.now()}${Math.floor(Math.random() * 1000)}`;
    await addPage.addItem(itemName, 3, 'good');
    await addPage.expectRedirectedToList();
    // Verify the new item appears in the list row.
    await expect(page.locator('tbody tr', { hasText: itemName }).first()).toBeVisible({ timeout: 5000 });
  });
});

// ----- SUBMIT REVIEW FORM -----
test.describe('Submit Review form', () => {
  let prisma: PrismaClient;

  test.beforeAll(async () => {
    prisma = new PrismaClient();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('user can submit a course review', async ({ getUserPage }) => {
    await ensureReviewSubmissionData(prisma);
    const page = await getUserPage('john@foo.com', 'changeme');
    const reviewPage = new SubmitReviewPage(page);
    await reviewPage.open();
    await reviewPage.expectLoaded();
    await reviewPage.submitReview('This course was very informative and well structured. Highly recommend.', {
      courseCode: REVIEW_COURSE_CODE,
      professor: REVIEW_PROFESSOR_NAME,
    });
    await reviewPage.expectRedirectedAfterSubmit();
  });
});
