import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 3', () => {
  test('Case - 1', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 2', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 3', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 4', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 5', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });
});

