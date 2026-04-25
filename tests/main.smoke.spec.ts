import { expect, test } from '@playwright/test';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';
import { DocsPage } from '../src/pages/docs.page';
import { HomePage } from '../src/pages/home.page';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { SwaggerPage } from '../src/pages/swagger.page';

test(
  'should display page with Rolnopol title on homepage',
  { tag: ['@e2e', '@smoke'] },
  async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);

    // Act
    await homePage.goto();

    // Assert
    await expect(page).toHaveTitle(/Rolnopol/);
  }
);

test('should load login page', { tag: ['@auth', '@smoke'] }, async ({ page }) => {
  // Arrange
  const expectedSubtitle = 'User Login & Account Access';
  const loginPage = new LoginPage(page);

  // Act
  await loginPage.goto();

  // Assert
  await expect(loginPage.subtitle).toHaveText(expectedSubtitle);
});

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  // Arrange
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';
  const docsPage = new DocsPage(page);

  // Act
  await docsPage.goto();

  // Assert
  await expect(docsPage.headerSubtitle).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  // Arrange
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';
  const swaggerPage = new SwaggerPage(page);

  // Act
  await swaggerPage.goto();

  // Assert
  await expect(swaggerPage.apiDescription).toHaveText(expectedDescription);
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
    const email = generateUniqueEmail();
    const displayName = 'Test User';
    const password = 'Test123!';

    await registerPage.goto();

    // Act
    await registerPage.register(email, password, displayName);

    // Assert
    await expect(registerPage.successMessage).toBeVisible();
    await expect(page).toHaveURL(/.*\/login\.html/);
  }
);
