import { test, expect } from '@playwright/test';

test.describe('Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-up');
  });

  test('should display signup form', async ({ page }) => {
    await expect(page.getByLabel('First name')).toBeVisible();
    await expect(page.getByLabel('Last name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create account' })
    ).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(
      page.getByText('First name must be at least 2 characters')
    ).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.getByLabel('First name').fill('John');
    await page.getByLabel('Last name').fill('Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password', { exact: true }).fill('TestPass123@');
    await page.getByLabel('Confirm password').fill('DifferentPass123@');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should show error for weak password', async ({ page }) => {
    await page.getByLabel('First name').fill('John');
    await page.getByLabel('Last name').fill('Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password', { exact: true }).fill('weak');
    await page.getByLabel('Confirm password').fill('weak');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Password "weak" fails multiple validations - check for any password error
    await expect(page.getByText(/Password must/)).toBeVisible();
  });

  test('should signup successfully with valid data', async ({ page }) => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.getByLabel('First name').fill('John');
    await page.getByLabel('Last name').fill('Doe');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('TestPass123@');
    await page.getByLabel('Confirm password').fill('TestPass123@');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should redirect to home page after successful signup
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Use existing test user email
    await page.getByLabel('First name').fill('John');
    await page.getByLabel('Last name').fill('Doe');
    await page.getByLabel('Email').fill('testuser123@example.com');
    await page.getByLabel('Password', { exact: true }).fill('TestPass123@');
    await page.getByLabel('Confirm password').fill('TestPass123@');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText(/email already exists/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should have link to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/auth/login');
  });
});
