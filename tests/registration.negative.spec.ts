import { expect, test } from '@playwright/test';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';
import { RegisterPage } from '../src/pages/register.page';

test.describe('Registration Negative Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test(
    'should show validation error when all fields are empty',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      await registerPage.submitButton.click();

      await expect(registerPage.emailInput).toBeFocused();
      await expect(registerPage.successMessage).not.toBeVisible();
    }
  );

  const invalidEmailTestCases = [
    'invalid-email',
    'test@',
    '@example.com',
    'test@example',
    'test@.com',
    'test @example.com',
  ];

  for (const email of invalidEmailTestCases) {
    test(
      `should show validation error for invalid email: ${email}`,
      { tag: ['@auth', '@negative', '@registration'] },
      async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();

        await registerPage.emailInput.fill(email);
        await registerPage.passwordInput.fill('password123');
        await registerPage.submitButton.click();

        await expect(registerPage.errorAlert).toHaveText('Please enter a valid email address');
        await expect(registerPage.successMessage).not.toBeVisible();
      }
    );
  }

  test(
    'should show validation error for password less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      await registerPage.emailInput.fill('test@example.com');
      await registerPage.passwordInput.fill('ab');
      await registerPage.submitButton.click();

      await expect(registerPage.errorAlert).toHaveText('Password must be at least 3 characters');
    }
  );

  test(
    'should show validation error for display name less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      await registerPage.emailInput.fill('test@example.com');
      await registerPage.displayNameInput.fill('ab');
      await registerPage.passwordInput.fill('password123');
      await registerPage.submitButton.click();

      await expect(registerPage.errorAlert).toHaveText(
        'Display name must be at least 3 characters'
      );
    }
  );

  test(
    'should truncate display name to 20 characters maximum',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      const longName = 'ThisIsAVeryLongDisplayName';

      await registerPage.displayNameInput.fill(longName);

      const actualValue = await registerPage.displayNameInput.inputValue();
      expect(actualValue).toHaveLength(20);
      expect(actualValue).toBe('ThisIsAVeryLongDispl');
    }
  );

  test(
    'should show error when registering with duplicate email',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      const email = generateUniqueEmail();
      const password = 'password123';
      const displayName = 'Test User';

      await registerPage.emailInput.fill(email);
      await registerPage.displayNameInput.fill(displayName);
      await registerPage.passwordInput.fill(password);
      await registerPage.submitButton.click();
      await expect(registerPage.successMessage).toBeVisible();

      await registerPage.goto();
      await registerPage.register(email, password, displayName);

      await expect(registerPage.errorAlert).toBeVisible();
      await expect(registerPage.errorAlert).toContainText('User with this email already exists');
    }
  );

  test(
    'should show error for whitespace-only password',
    { tag: ['@auth', '@negative', '@registration'] },
    async () => {
      const email = generateUniqueEmail();

      await registerPage.emailInput.fill(email);
      await registerPage.passwordInput.fill('   ');
      await registerPage.submitButton.click();

      await expect(registerPage.errorAlert).toBeVisible();
      await expect(registerPage.errorAlert).toContainText(
        'Password must be at least 3 characters long'
      );
    }
  );
});
