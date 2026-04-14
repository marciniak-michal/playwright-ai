import { expect, test } from '@playwright/test';

test('should display page with Rolnopol title on homepage', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rolnopol/);
});

test('should load login page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  const response = await page.goto('/login.html');
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
});

test('should load register page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  const response = await page.goto('/register.html');
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
});
