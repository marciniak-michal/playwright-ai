import { expect, test } from '@playwright/test';

test('should display page with Rolnopol title on homepage', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rolnopol/);
});

test('should load login page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  await page.goto('/login.html');
  await expect(page.locator('body')).toBeVisible();
});

test('should load register page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  await page.goto('/register.html');
  await expect(page.locator('body')).toBeVisible();
});
