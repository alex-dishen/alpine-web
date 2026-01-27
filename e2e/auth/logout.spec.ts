import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('testuser123@example.com');
    await page.getByLabel('Password').fill('TestPass123@');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for redirect to home
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should logout and redirect to login page', async ({ page }) => {
    // Click logout button in sidebar
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
  });

  test('should not be able to access protected routes after logout', async ({
    page,
  }) => {
    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Wait for redirect to login
    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });

    // Try to navigate to protected route
    await page.goto('/');

    // Should stay on login page
    await expect(page).toHaveURL('/auth/login');
  });
});
