import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for API response and error message
    await expect(
      page.getByText(/invalid credentials|login failed/i)
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Use test account credentials (assumes this user exists in the test database)
    await page.getByLabel('Email').fill('testuser123@example.com');
    await page.getByLabel('Password').fill('TestPass123@');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should redirect to home page after successful login
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should have link to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign up' }).click();

    await expect(page).toHaveURL('/auth/sign-up');
  });
});
