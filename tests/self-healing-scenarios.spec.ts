import { expect, test } from '../src/fixtures/index.fixture';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';

test.describe('Klasa 4', () => {
  test('Case - 1', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    const wrongEmail = 'invalid-email-format';
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(wrongEmail, correctPassword);

    await expect(pages.registerPage.errorAlert).not.toHaveText(
      'Please enter a valid email address'
    );
  });

  test('Case - 2', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    const correctEmail = generateUniqueEmail();
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(correctEmail, correctPassword);

    await expect(pages.registerPage.successMessage).toHaveText('Registration failed!');
  });

  test('Case - 3', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    const wrongEmail = 'invalid-email-format';
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(wrongEmail, correctPassword);

    await expect(pages.registerPage.errorAlert).not.toBeVisible();
  });

  test('Case - 4', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    const correctEmail = generateUniqueEmail();
    const correctPassword = 'password123';

    await pages.registerPage.goto();
    await pages.registerPage.register(correctEmail, correctPassword);

    await expect(pages.registerPage.errorAlert).toBeVisible();
  });
});
