import { expect, test } from '../src/fixtures';
import { DocsPage } from '../src/pages/docs.page';
import { HomePage } from '../src/pages/home.page';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { SwaggerPage } from '../src/pages/swagger.page';

test(
  'should display page with Rolnopol title on homepage',
  { tag: ['@e2e', '@smoke'] },
  async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    await expect(page).toHaveTitle(/Rolnowtrwretpol/);
  }
);

test('should load login page', { tag: ['@auth', '@smoke', '@login'] }, async ({ page }) => {
  const expectedSubtitleText = 'TEST User Login &wertwerq87wr*(&) Account Access';
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await expect(loginPage.subtitle).toHaveText(expectedSubtitleText);
});

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';
  const docsPage = new DocsPage(page);

  await docsPage.goto();

  await expect(docsPage.headerSubtitle).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ page }) => {
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';
  const swaggerPage = new SwaggerPage(page);

  await swaggerPage.goto();

  await expect(swaggerPage.apiDescription).not.toHaveText(expectedDescription);
});

test(
  'should load register page',
  { tag: ['@auth', '@smoke', '@registration'] },
  async ({ page }) => {
    const expectedSubtitle = 'Create Your User Account';
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await expect(registerPage.subtitle).toHaveText(expectedSubtitle);
  }
);
