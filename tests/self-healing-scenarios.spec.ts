import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 2 — Visible text change', () => {
  test('Case 1', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Here Create Your User Account');
  });

  test('Case 2', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account Here');
  });

  test('Case 3', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Here Your User Account');
  });

  test('Case 4', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your Userr Account');
  });

  test('Case 5', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Cratte your Users Accooun');
  });

  test('Case 6', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Here you can make page profile');
  });

  test('Case 7', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.backToHomeLink).toHaveText(pages.registerPage.backToHomeText);
  });
});
