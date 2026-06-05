import { expect, test } from '../src/fixtures';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';

test.describe('Registration Negative Tests', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.registerPage.goto();
  });

  test(
    'should show validation error when all fields are empty',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.registerPage.submitButton.click();

      await expect(pages.registerPage.emailInput).toBeFocused();
      await expect(pages.registerPage.successMessage).not.toBeVisible();
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
      async ({ pages }) => {
        await pages.registerPage.emailInput.fill(email);
        await pages.registerPage.passwordInput.fill('password123');
        await pages.registerPage.submitButton.click();

        await expect(pages.registerPage.errorAlert).toHaveText(
          'Please enter a valid email address'
        );
        await expect(pages.registerPage.successMessage).not.toBeVisible();
      }
    );
  }

  test(
    'should show validation error for password less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.registerPage.emailInput.fill('test@example.com');
      await pages.registerPage.passwordInput.fill('ab');
      await pages.registerPage.submitButton.click();

      await expect(pages.registerPage.errorAlert).toHaveText(
        'Password must be at least 3 characters'
      );
    }
  );

  test(
    'should show validation error for display name less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.registerPage.emailInput.fill('test@example.com');
      await pages.registerPage.displayNameInput.fill('ab');
      await pages.registerPage.passwordInput.fill('password123');
      await pages.registerPage.submitButton.click();

      await expect(pages.registerPage.errorAlert).toHaveText(
        'Display name must be at least 3 characters'
      );
    }
  );

  test(
    'should truncate display name to 20 characters maximum',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      const longName = 'ThisIsAVeryLongDisplayName';

      await pages.registerPage.displayNameInput.fill(longName);

      const actualValue = await pages.registerPage.displayNameInput.inputValue();
      expect(actualValue).toHaveLength(20);
      expect(actualValue).toBe('ThisIsAVeryLongDispl');
    }
  );

  test(
    'should show error when registering with duplicate email',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();
      const password = 'password123';
      const displayName = 'Test User';

      await pages.registerPage.emailInput.fill(email);
      await pages.registerPage.displayNameInput.fill(displayName);
      await pages.registerPage.passwordInput.fill(password);
      await pages.registerPage.submitButton.click();
      await expect(pages.registerPage.successMessage).toBeVisible();

      await pages.registerPage.goto();
      await pages.registerPage.register(email, password, displayName);

      await expect(pages.registerPage.errorAlert).toBeVisible();
      await expect(pages.registerPage.errorAlert).toContainText(
        'User with this email already exists'
      );
    }
  );

  test(
    'should show error for whitespace-only password',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.registerPage.emailInput.fill(email);
      await pages.registerPage.passwordInput.fill('   ');
      await pages.registerPage.submitButton.click();

      await expect(pages.registerPage.errorAlert).toBeVisible();
      await expect(pages.registerPage.errorAlert).toContainText(
        'Password must be at least 3 characters long'
      );
    }
  );
});
