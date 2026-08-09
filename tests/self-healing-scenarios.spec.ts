import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 1', () => {
  test(
    'should locate email input on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('email-input')).toBeVisible();
    }
  );

  test(
    'should locate password input on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('password-input')).toBeVisible();
    }
  );

  test(
    'should locate submit button on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('login-submit-btn')).toBeVisible();
    }
  );

  test(
    'should locate display name input on register page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      await expect(page.getByTestId('display-name-input')).toBeVisible();
    }
  );

  test(
    'should locate submit button on register page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      await expect(page.getByTestId('register-submit-btn')).toBeVisible();
    }
  );
});
