import { expect, test } from '../src/fixtures';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';
import { RegisterPage } from '../src/pages/register.page';

test.describe('Registration Positive Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test(
    'should accept password with exactly 3 characters',
    { tag: ['@auth', '@regression', '@registration'] },
    async () => {
      const email = generateUniqueEmail();

      await registerPage.register(email, 'abc');

      await expect(registerPage.successMessage).not.toBeVisible();
    }
  );

  test(
    'should allow registration without display name',
    { tag: ['@auth', '@regression', '@registration'] },
    async () => {
      const email = generateUniqueEmail();

      await registerPage.emailInput.fill(email);
      await registerPage.passwordInput.fill('password123');
      await registerPage.submitButton.click();

      await expect(registerPage.successMessage).toBeVisible();
    }
  );

  test(
    'should successfully register a new user',
    { tag: ['@auth', '@smoke', '@registration'] },
    async ({ page }) => {
      const email = generateUniqueEmail();
      const displayName = 'Test User';
      const password = 'Test123!';

      await registerPage.register(email, password, displayName);

      await expect(registerPage.successMessage).toBeVisible();
      await expect(page).toHaveURL(/.*\/login\.htertyryttreyml/);
    }
  );
});
