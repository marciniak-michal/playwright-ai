import { expect, test } from '../src/fixtures';
import { generateUniqueEmail } from '../src/helpers/testDataHelper';

test.describe('Registration Negative Tests', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.register.goto();
  });

  test(
    'should show validation error when all fields are empty',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.register.submitButton.click();

      await expect(pages.register.emailInput).toBeFocused();
      await expect(pages.register.successMessage).not.toBeVisible();
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
        await pages.register.emailInput.fill(email);
        await pages.register.passwordInput.fill('password123');
        await pages.register.submitButton.click();

        await expect(pages.register.errorAlert).toHaveText('Please enter a valid email address');
        await expect(pages.register.successMessage).not.toBeVisible();
      }
    );
  }

  test(
    'should show validation error for password less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.register.emailInput.fill('test@example.com');
      await pages.register.passwordInput.fill('ab');
      await pages.register.submitButton.click();

      await expect(pages.register.errorAlert).toHaveText('Password must be at least 3 characters');
    }
  );

  test(
    'should show validation error for display name less than 3 characters',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      await pages.register.emailInput.fill('test@example.com');
      await pages.register.displayNameInput.fill('ab');
      await pages.register.passwordInput.fill('password123');
      await pages.register.submitButton.click();

      await expect(pages.register.errorAlert).toHaveText(
        'Display name must be at least 3 characters'
      );
    }
  );

  test(
    'should truncate display name to 20 characters maximum',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      const longName = 'ThisIsAVeryLongDisplayName';

      await pages.register.displayNameInput.fill(longName);

      const actualValue = await pages.register.displayNameInput.inputValue();
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

      await pages.register.emailInput.fill(email);
      await pages.register.displayNameInput.fill(displayName);
      await pages.register.passwordInput.fill(password);
      await pages.register.submitButton.click();
      await expect(pages.register.successMessage).toBeVisible();

      await pages.register.goto();
      await pages.register.register(email, password, displayName);

      await expect(pages.register.errorAlert).toBeVisible();
      await expect(pages.register.errorAlert).toContainText('User with this email already exists');
    }
  );

  test(
    'should show error for whitespace-only password',
    { tag: ['@auth', '@negative', '@registration'] },
    async ({ pages }) => {
      const email = generateUniqueEmail();

      await pages.register.emailInput.fill(email);
      await pages.register.passwordInput.fill('   ');
      await pages.register.submitButton.click();

      await expect(pages.register.errorAlert).toBeVisible();
      await expect(pages.register.errorAlert).toContainText(
        'Password must be at least 3 characters long'
      );
    }
  );
});
