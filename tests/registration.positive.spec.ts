import { expect, test } from '../src/fixtures';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';

test.describe('Registration Positive Tests', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.registerPage.goto();
  });

  test(
    'should accept password with exactly 3 characters',
    { tag: ['@auth', '@regression', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.registerPage.register(email, 'abc');

      await expect(pages.registerPage.successMessage).toBeVisible();
    }
  );

  test(
    'should allow registration without display name',
    { tag: ['@auth', '@regression', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.registerPage.emailInput.fill(email);
      await pages.registerPage.passwordInput.fill('password123');
      await pages.registerPage.submitButton.click();

      await expect(pages.registerPage.successMessage).toBeVisible();
    }
  );

  test(
    'should successfully register a new user',
    { tag: ['@auth', '@smoke', '@registration'] },
    async ({ page, pages }) => {
      const email = generateUniqueEmail();
      const displayName = 'Test User';
      const password = 'Test123!';

      await pages.registerPage.register(email, password, displayName);

      await expect(pages.registerPage.successMessage).toBeVisible();
      await expect(page).toHaveURL(/.*\/login\.html/);
    }
  );
});
