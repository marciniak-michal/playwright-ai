import { expect, test } from '../src/fixtures';

test(
  'should display page with Rolnopol title on homepage',
  { tag: ['@e2e', '@smoke'] },
  async ({ pages }) => {
    const expectedSubtitle = 'Futuristic Farm & Resource Management';

    await pages.home.goto();

    await expect(pages.home.page).toHaveTitle(/Rolnopol/);
    await expect(pages.home.subtitle).toHaveText(expectedSubtitle);
  }
);

test('should load login page', { tag: ['@auth', '@smoke', '@login'] }, async ({ pages }) => {
  const expectedSubtitle = 'User Login & TEST Account TEST Access';

  await pages.login.goto();

  await expect(pages.login.subtitle).toHaveText(expectedSubtitle);
});

test('should load docs page', { tag: ['@smoke', '@documentation'] }, async ({ pages }) => {
  const expectedSubtitle = 'Rolnopol System Guide & API Reference';

  await pages.docs.goto();

  await expect(pages.docs.headerSubtitle).not.toHaveText(expectedSubtitle);
});

test('should load swagger page', { tag: ['@smoke', '@documentation'] }, async ({ pages }) => {
  const expectedDescriptionText =
    'API documentation for the Rolnopol service with versioning support';

  await pages.swagger.goto();

  await expect(pages.swagger.apiDescription).toHaveText(expectedDescriptionText);
});

test(
  'should load register page',
  { tag: ['@auth', '@smoke', '@registration'] },
  async ({ pages }) => {
    const expectedSubtitle = 'Create Your User Account';

    await pages.register.goto();

    await expect(pages.register.subtitle).toHaveText(expectedSubtitle);
  }
);
