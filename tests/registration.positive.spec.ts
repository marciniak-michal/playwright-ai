import { expect, test } from '../src/fixtures';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';

test.describe('Registration Positive Tests', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.register.goto();
  });

  test(
    'should accept password with exactly 3 characters',
    { tag: ['@auth', '@regression', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.register.register(email, 'abc');

      await expect(pages.register.successMessage).toBeVisible();
    }
  );

  test(
    'should allow registration without display name',
    { tag: ['@auth', '@regression', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.register.emailInput.fill(email);
      await pages.register.passwordInput.fill('password123');
      await pages.register.submitButton.click();

      await expect(pages.register.successMessage).toBeVisible();
    }
  );

  test(
    'should successfully register a new user',
    { tag: ['@auth', '@smoke', '@registration'] },
    async ({ page, pages }) => {
      const email = generateUniqueEmail();
      const displayName = 'Test User';
      const password = 'Test123!';

      await pages.register.register(email, password, displayName);

      await expect(pages.register.successMessage).toBeVisible();
      await expect(page).toHaveURL(/.*\/login\.html/);
    }
  );
});
