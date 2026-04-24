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

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';

  await page.goto('/docs.html');
  await expect(page.locator('.docs-header-subtitle')).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';

  await page.goto('/swagger.html');
  const iframe = page.frameLocator('iframe#swagger-frame');
  await expect(iframe.locator('.information-container .renderedMarkdown')).toHaveText(
    expectedDescription
  );
});

test(
  'should successfully register a new user',
  { tag: ['@smoke', '@auth', '@registration'] },
  async ({ page }) => {
    // Arrange
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const displayName = 'Test User';
    const password = 'Test123!';

    await page.goto('/register.html');

    // Act
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('display-name-input').fill(displayName);
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('register-submit-btn').click();

    // Assert
    await expect(page.getByText('Registration successful!')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login\.html/);
  }
);
