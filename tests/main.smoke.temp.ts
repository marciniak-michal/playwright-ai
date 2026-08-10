import { expect, test } from '../src/fixtures/index.fixture';

test(
  'should display page with Rolnopol title on homepage',
  { tag: ['@e2e', '@smoke'] },
  async ({ pages }) => {
    const expectedSubtitle = 'Futuristic Farm & Resource Management System';

    await pages.homePage.goto();

    await expect(pages.homePage.page).toHaveTitle(/Rolnopol/);
    await expect(pages.homePage.subtitle).toHaveText(expectedSubtitle);
  }
);

test('should load login page', { tag: ['@auth', '@smoke', '@login'] }, async ({ pages }) => {
  const expectedSubtitle = 'User Login & Account Access';

  await pages.loginPage.goto();

  await expect(pages.loginPage.subtitle).toHaveText(expectedSubtitle);
});

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ pages }) => {
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';

  await pages.docsPage.goto();

  await expect(pages.docsPage.headerSubtitle).toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ pages }) => {
  const expectedDescription = 'API documentation for the Rolnopol service with versioning support';

  await pages.swaggerPage.goto();

  await expect(pages.swaggerPage.apiDescription).toHaveText(expectedDescription);
});

test(
  'should load register page',
  { tag: ['@auth', '@smoke', '@registration'] },
  async ({ pages }) => {
    const expectedSubtitle = 'Create Your User Account';

    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText(expectedSubtitle);
  }
);
