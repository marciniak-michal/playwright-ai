import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 2 — Visible text change', () => {
  test('Case 1', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 2', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 3', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 4', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 5', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 6', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });

  test('Case 7', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account');
  });
});

