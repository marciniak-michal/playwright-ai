import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 5', () => {
  test('Case - 1', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    const wrongEmail = 'invalid-email-format';
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(wrongEmail, correctPassword);

    await expect(page.locator('div.error-box[role="alert"]')).not.toBeVisible();
  });

  test('Case - 2', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    const wrongEmail = 'invalid-email-format';
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(wrongEmail, correctPassword);

    await expect(page.locator('div.authentication ul li#passwd-guide')).toBeVisible();
  });

  test('Case - 3', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    const wrongEmail = 'invalid-email-format';
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(wrongEmail, correctPassword);

    await expect(page.locator('div.auth-info div li#description-password')).toBeVisible();
  });

  test('Case - 4', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.container ul li#password-guideline')).not.toHaveText('Passwrd: Must have at least 3 charactrs long');
  });

  test('Case - 5', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.loginHereLink).toHaveText('Back to login page');
  });
});
