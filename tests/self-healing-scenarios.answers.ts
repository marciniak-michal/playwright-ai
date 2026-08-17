import { expect, test } from '../src/fixtures/index.fixture';

/**
 * Experimental test suite for the self-healing layer evaluation.
 *
 * ALL 35 tests in this file are intentionally broken and serve as input
 * for the self-healing pipeline. Each describe block represents one failure
 * class from chapter 7.4. The DOM captured at failure time provides the AI
 * with the ground truth needed to generate the correct fix.
 *
 * Failure causes per class:
 *   Klasa 1 — wrong data-testid values in direct locators
 *   Klasa 2 — wrong expected text in assertions
 *   Klasa 3 — wrong ARIA role name or wrong role type
 *   Klasa 4 — wrong parent selector in scoped locators
 *   Klasa 5 — combined wrong testid + wrong text / wrong role
 *   Klasa 6 — correct locator, wrong .not negation
 *   Klasa 8 — correct locator, garbled expected string (typo)
 *
 * Each describe block maps to one modification class defined in chapter 7.4:
 *   Klasa 1 — data-testid attribute change
 *   Klasa 2 — visible text change
 *   Klasa 3 — ARIA role / semantic structure change
 *   Klasa 4 — DOM hierarchy change
 *   Klasa 5 — Combined change
 *   Klasa 6 — Wrong assertion negation   (intentionally broken)
 *   Klasa 8 — Typo in test source        (intentionally broken)
 *
 * Classes 6 and 8 contain tests that fail in the base state by design.
 * They simulate developer mistakes and are used to verify the AI model's
 * ability to distinguish test-side errors from application-side regressions.
 */

// ─── Klasa 2 — Visible text change ────────────────────────────────────────────
// Tests assert wrong expected text. The AI must read the actual text from the
// DOM tree and replace the incorrect expected string in the assertion.

test.describe('Klasa 2 — Visible text change', () => {
  test(
    'should display correct subtitle on login page',
    { tag: ['@auth', '@regression'] },
    async ({ pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong text — correct value: 'User Login & Account Access'
      await expect(pages.loginPage.subtitle).toHaveText('User Login & Account Access Portal');
    }
  );

  test(
    'should display correct subtitle on register page',
    { tag: ['@auth', '@regression'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong text — correct value: 'Create Your User Account'
      await expect(pages.registerPage.subtitle).toHaveText('New User Account Registration');
    }
  );

  test(
    'should display correct heading inside login form container',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong text — correct value: 'Login to Your User Account'
      await expect(page.locator('[data-testid="login-form-container"] h2')).toContainText(
        'Please Log In to Continue'
      );
    }
  );

  test(
    'should display correct heading inside register form container',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong text — correct value: 'Create Your User Account'
      await expect(page.locator('[data-testid="register-form-container"] h2')).toContainText(
        'New Account Registration'
      );
    }
  );

  test(
    'should display correct label on register submit button',
    { tag: ['@auth', '@regression'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong text — correct value: 'Create Account'
      await expect(pages.registerPage.submitButton).toHaveText('Submit');
    }
  );
});

// ─── Klasa 3 — ARIA role / semantic structure change ─────────────────────────
// Tests use wrong ARIA role names or incorrect role types. The AI must match
// the actual accessible name or role found in the DOM and correct the locator.

test.describe('Klasa 3 — ARIA role / semantic structure change', () => {
  test(
    'should find register submit button by ARIA role and accessible name',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong accessible name — correct value: 'Create Account'
      await expect(page.getByRole('button', { name: 'Submit Registration' })).toBeVisible();
    }
  );

  test(
    'should find login submit button by ARIA role and accessible name',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong accessible name — correct value: 'Login'
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    }
  );

  test(
    'should find email input on login page by textbox role and label',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong label name — correct value: 'Email'
      await expect(page.getByRole('textbox', { name: 'E-mail address' })).toBeVisible();
    }
  );

  test(
    'should find register link on login page by link role and name',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong link name — correct value: 'Register here'
      await expect(page.getByRole('link', { name: 'Sign up here' })).toBeVisible();
    }
  );

  test(
    'should display a status role element after submitting an invalid email',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();
      await pages.registerPage.emailInput.fill('invalid-email');
      await pages.registerPage.passwordInput.fill('password123');
      await pages.registerPage.submitButton.click();

      // ❌ Wrong role — correct value: 'alert'
      await expect(page.getByRole('status')).toBeVisible();
    }
  );
});

// ─── Klasa 4 — DOM hierarchy change ──────────────────────────────────────────
// Tests use wrong parent container testids. The AI must identify the correct
// ancestor element from the DOM tree and update the scoping selector.

test.describe('Klasa 4 — DOM hierarchy change', () => {
  test(
    'should find email input scoped within the login form element',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong parent testid — correct value: 'login-form'
      await expect(
        page.locator('[data-testid="login-form-wrapper"]').getByTestId('email-input')
      ).toBeVisible();
    }
  );

  test(
    'should find password input scoped within the register form element',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong parent testid — correct value: 'register-form'
      await expect(
        page.locator('[data-testid="registration-form"]').getByTestId('password-input')
      ).toBeVisible();
    }
  );

  test(
    'should find the submit button scoped within the login form container',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong parent testid — correct value: 'login-form-container'
      await expect(page.locator('[data-testid="login-card"]').getByRole('button')).toBeVisible();
    }
  );

  test(
    'should find exactly two navigation links within the auth-links section',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong parent testid — correct value: 'auth-links'
      await expect(page.locator('[data-testid="nav-links"]').getByRole('link')).toHaveCount(2);
    }
  );

  test(
    'should find email input scoped within the outer auth-form-container on register page',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong parent testid — correct value: 'auth-form-container'
      await expect(
        page.locator('[data-testid="form-wrapper"]').getByTestId('email-input')
      ).toBeVisible();
    }
  );
});

// ─── Klasa 5 — Combined change ────────────────────────────────────────────────
// Tests contain multiple simultaneous errors: wrong text AND wrong ARIA name,
// or wrong text AND wrong parent testid. The AI must resolve all issues in a
// single fix per file.

test.describe('Klasa 5 — Combined change', () => {
  test(
    'should display correct subtitle and an enabled submit button on login page',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong text — correct: 'User Login & Account Access'
      await expect(pages.loginPage.subtitle).toHaveText('User Login Portal');
      // ❌ Wrong accessible name — correct: 'Login'
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
    }
  );

  test(
    'should display correct subtitle and a visible register form on register page',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong text — correct: 'Create Your User Account'
      await expect(pages.registerPage.subtitle).toHaveText('Register a New Account');
      // ❌ Wrong parent testid — correct: 'register-form'
      await expect(page.locator('[data-testid="registration-form"]')).toBeVisible();
    }
  );

  test(
    'should confirm register button has correct text and is inside the form',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong text — correct: 'Create Account'
      await expect(pages.registerPage.submitButton).toHaveText('Register Now');
      // ❌ Wrong parent testid — correct: 'register-form-container'
      await expect(page.locator('[data-testid="register-card"]').getByRole('button')).toBeVisible();
    }
  );

  test(
    'should confirm email input is reachable by both data-testid and ARIA role on login page',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong testid — correct: 'email-input'
      await expect(page.getByTestId('user-email')).toBeVisible();
      // ❌ Wrong label name — correct: 'Email'
      await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    }
  );

  test(
    'should display a visible alert with correct text after submitting an invalid email',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();
      await pages.registerPage.emailInput.fill('invalid-email');
      await pages.registerPage.passwordInput.fill('password123');
      await pages.registerPage.submitButton.click();

      // ❌ Wrong role — correct: 'alert'
      await expect(page.getByRole('status')).toBeVisible();
      // ❌ Wrong text — correct: 'Please enter a valid email address'
      await expect(pages.registerPage.errorAlert).toHaveText('Invalid email format provided');
    }
  );
});

// ─── Klasa 6 — Wrong assertion negation ──────────────────────────────────────
// These tests are intentionally broken: the .not modifier is applied to an
// assertion that should pass without it. They simulate a developer mistake
// and are used to verify that the self-healing AI can detect and remove an
// incorrect negation without modifying the application code.

test.describe('Klasa 6 — Wrong assertion negation', () => {
  test(
    '[intentionally broken] register submit button should not be visible',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong negation — button is visible; correct assertion: toBeVisible()
      await expect(pages.registerPage.submitButton).not.toBeVisible();
    }
  );

  test(
    '[intentionally broken] login email input should not be enabled',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong negation — input is enabled; correct assertion: toBeEnabled()
      await expect(pages.loginPage.emailInput).not.toBeEnabled();
    }
  );

  test(
    '[intentionally broken] register subtitle should not be visible',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong negation — subtitle is visible; correct assertion: toBeVisible()
      await expect(pages.registerPage.subtitle).not.toBeVisible();
    }
  );

  test(
    '[intentionally broken] login form container should not be attached to DOM',
    { tag: ['@auth', '@negative'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Wrong negation — container is present; correct assertion: toBeAttached()
      await expect(page.locator('[data-testid="login-form-container"]')).not.toBeAttached();
    }
  );

  test(
    '[intentionally broken] register display name input should not be visible',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Wrong negation — input is visible; correct assertion: toBeVisible()
      await expect(pages.registerPage.displayNameInput).not.toBeVisible();
    }
  );
});

// ─── Klasa 8 — Typo in test source ───────────────────────────────────────────
// These tests are intentionally broken: the expected value contains a garbled
// string that does not match the actual DOM content. They simulate a typo
// introduced by the test author and are used to verify that the self-healing
// AI can recognise a test-side error and correct the expected value to match
// the ground-truth text found in the DOM — without altering the application.

test.describe('Klasa 8 — Typo in test source', () => {
  test(
    '[intentionally broken] should display correct subtitle on login page',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.loginPage.goto();

      // ❌ Typo in expected value — correct text: 'User Login & Account Access'
      await expect(pages.loginPage.subtitle).toHaveText('User Lognin & Acount Acces');
    }
  );

  test(
    '[intentionally broken] should display correct subtitle on register page',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Typo in expected value — correct text: 'Create Your User Account'
      await expect(pages.registerPage.subtitle).toHaveText('Crate Yur User Acocunt');
    }
  );

  test(
    '[intentionally broken] should display correct heading inside login form container',
    { tag: ['@auth', '@negative'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      // ❌ Typo in expected value — correct text: 'Login to Your User Account'
      await expect(page.locator('[data-testid="login-form-container"] h2')).toContainText(
        'Loggin to Yor User Acount'
      );
    }
  );

  test(
    '[intentionally broken] should display correct label on register submit button',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();

      // ❌ Typo in expected value — correct text: 'Create Account'
      await expect(pages.registerPage.submitButton).toHaveText('Creat Accountt');
    }
  );

  test(
    '[intentionally broken] should display correct error message for invalid email',
    { tag: ['@auth', '@negative'] },
    async ({ pages }) => {
      await pages.registerPage.goto();
      await pages.registerPage.emailInput.fill('invalid-email');
      await pages.registerPage.passwordInput.fill('password123');
      await pages.registerPage.submitButton.click();

      // ❌ Typo in expected value — correct text: 'Please enter a valid email address'
      await expect(pages.registerPage.errorAlert).toHaveText('Plaese enter a valld emial addres');
    }
  );
});

/////////////////////////////////////////////////////////////////////////////////////////////

test.describe('Klasa 1', () => {
  test('should locate submit button', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.submitButton).toBeVisible();
  });

  test('should locate display name input', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.displayNameInput).toBeVisible();
  });

  test('should locate email input', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.emailInput).toBeVisible();
  });

  test('should locate display name label', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.displayNameLabel).toBeVisible();
  });

  test('should locate login here link', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.loginHereLink).toBeVisible();
  });
});

test.describe('Klasa 2 — Visible text change', () => {
  test('Case 1', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Here Create Your User Account');
  });

  test('Case 2', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your User Account Here');
  });

  test('Case 3', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Here Your User Account');
  });

  test('Case 4', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Create Your Userr Account');
  });

  test('Case 5', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Cratte your Users Accooun');
  });

  test('Case 6', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.subtitle).toHaveText('Here you can make page profile');
  });

  test('Case 7', { tag: ['@auth', '@regression'] }, async ({ pages }) => {
    await pages.registerPage.goto();

    await expect(pages.registerPage.backToHomeLink).toHaveText(pages.registerPage.backToHomeText);
  });
});

test.describe('Klasa 3', () => {
  test('Case - 1', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.registration-guidelines ul li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 2', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul.display-name li:nth-child(2) strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 3', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) div strong')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 4', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(2) strong span')).toHaveText(
      'Display Name:'
    );
  });

  test('Case - 5', { tag: ['@auth', '@regression'] }, async ({ page, pages }) => {
    await pages.registerPage.goto();

    await expect(page.locator('div.auth-info ul li:nth-child(5) strong')).toHaveText(
      'Display Name:'
    );
  });
});

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

    await expect(pages.registerPage.successMessage).toHaveText('There was an unexpected error!');
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