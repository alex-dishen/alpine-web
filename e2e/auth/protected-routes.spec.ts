import { test, expect, type Page } from '@playwright/test';

async function loginUser(page: Page) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill('testuser123@example.com');
  await page.getByLabel('Password').fill('TestPass123@');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/', { timeout: 10000 });
}

test.describe('Protected Routes - Unauthenticated', () => {
  test('should redirect to login when accessing home without auth', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/auth/login');
  });

  test('should redirect to login when accessing jobs without auth', async ({
    page,
  }) => {
    await page.goto('/jobs');

    await expect(page).toHaveURL('/auth/login');
  });

  test('should redirect to login when accessing resume without auth', async ({
    page,
  }) => {
    await page.goto('/resume');

    await expect(page).toHaveURL('/auth/login');
  });

  test('should redirect to login when accessing knowledge without auth', async ({
    page,
  }) => {
    await page.goto('/knowledge');

    await expect(page).toHaveURL('/auth/login');
  });

  test('should redirect to login when accessing analytics without auth', async ({
    page,
  }) => {
    await page.goto('/analytics');

    await expect(page).toHaveURL('/auth/login');
  });

  test('should allow access to login page without auth', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('should allow access to signup page without auth', async ({ page }) => {
    await page.goto('/auth/sign-up');

    await expect(page).toHaveURL('/auth/sign-up');
    await expect(page.getByLabel('First name')).toBeVisible();
  });
});

test.describe('Protected Routes - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should allow authenticated user to access home', async ({ page }) => {
    await expect(page).toHaveURL('/');
    // Verify we're on the authenticated home page by checking for sidebar
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should allow authenticated user to access protected routes', async ({
    page,
  }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL('/jobs');

    await page.goto('/resume');
    await expect(page).toHaveURL('/resume');

    await page.goto('/knowledge');
    await expect(page).toHaveURL('/knowledge');

    await page.goto('/analytics');
    await expect(page).toHaveURL('/analytics');
  });

  test('should redirect authenticated user from login to home', async ({
    page,
  }) => {
    await page.goto('/auth/login');

    // Should redirect to home since already authenticated
    await expect(page).toHaveURL('/');
  });

  test('should redirect authenticated user from signup to home', async ({
    page,
  }) => {
    await page.goto('/auth/sign-up');

    // Should redirect to home since already authenticated
    await expect(page).toHaveURL('/');
  });
});
