import { expect, test } from '@playwright/test';

test('should display page with Rolnopol title on homepage', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rolnopol/);
});

test('should load login page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  const expectedSubtitle = 'User Login & Account Access';

  await page.goto('/login.html');
  await expect(page.getByTestId('login-subtitle')).toHaveText(expectedSubtitle);
});

test('should load register page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  const expectedSubtitle = 'Create Your User Account';

  await page.goto('/register.html');
  await expect(page.getByTestId('register-subtitle')).toHaveText(expectedSubtitle);
});

test('should load docs page', { tag: '@smoke' }, async ({ page }) => {
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';

  await page.goto('/docs.html');
  await expect(page.locator('.docs-header-subtitle')).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: '@smoke' }, async ({ page }) => {
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';

  await page.goto('/swagger.html');
  const iframe = page.frameLocator('iframe#swagger-frame');
  await expect(iframe.locator('.information-container .renderedMarkdown')).toHaveText(expectedDescription);
});
