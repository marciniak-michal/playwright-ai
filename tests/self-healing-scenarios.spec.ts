import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 1', () => {
  test('should locate submit button', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.submitButton).toBeVisible();
  });

  test('should locate display name input', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.displayNameInput).toBeVisible();
  });

  test('should locate email input', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.emailInput).toBeVisible();
  });

  test('should locate display name label', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.displayNameLabel).toBeVisible();
  });

  test('should locate login here link', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.loginHereLink).toBeVisible();
  });
});
