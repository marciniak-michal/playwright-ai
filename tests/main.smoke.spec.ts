import { expect, test } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';

test('should display page with Rolnopol title on homepage', { tag: '@smoke' }, async ({ page }) => {
  // Act
  await page.goto('/');

  // Assert
  await expect(page).toHaveTitle(/Rolnopol/);
});

test('should load login page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  // Arrange
  const expectedSubtitle = 'User Login & Account Access';

  // Act
  await page.goto('/login.html');

  // Assert
  await expect(page.getByTestId('login-subtitle')).toHaveText(expectedSubtitle);
});

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  // Arrange
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';

  // Act
  await page.goto('/docs.html');

  // Assert
  await expect(page.locator('.docs-header-subtitle')).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  // Arrange
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';
  const iframe = page.frameLocator('iframe#swagger-frame');

  // Act
  await page.goto('/swagger.html');

  // Assert
  await expect(iframe.locator('.information-container .renderedMarkdown')).toHaveText(
    expectedDescription
  );
});

test(
  'should load register page',
  { tag: ['@auth', '@smoke', '@registration'] },
  async ({ page }) => {
    // Arrange
    const expectedSubtitle = 'Create Your User Account';
    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();

    // Assert
    await expect(registerPage.subtitle).toHaveText(expectedSubtitle);
  }
);

test(
  'should successfully register a new user',
  { tag: ['@smoke', '@auth', '@registration'] },
  async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const displayName = 'Test User';
    const password = 'Test123!';

    await registerPage.goto();

    // Act
    await registerPage.register(uniqueEmail, displayName, password);

    // Assert
    await expect(registerPage.successMessage).toBeVisible();
    await expect(page).toHaveURL(/.*\/login\.html/);
  }
);
