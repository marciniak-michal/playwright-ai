import { expect, test } from '../src/fixtures/index.fixture';

test.describe('Klasa 1 — data-testid attribute change', () => {
  test(
    'should locate email input on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('user-email-field')).toBeVisible();
    }
  );

  test(
    'should locate password input on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('user-password-field')).toBeVisible();
    }
  );

  test(
    'should locate submit button on login page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.loginPage.goto();

      await expect(page.getByTestId('btn-login')).toBeVisible();
    }
  );

  test(
    'should locate display name input on register page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      await expect(page.getByTestId('name-input')).toBeVisible();
    }
  );

  test(
    'should locate submit button on register page by data-testid',
    { tag: ['@auth', '@regression'] },
    async ({ page, pages }) => {
      await pages.registerPage.goto();

      await expect(page.getByTestId('btn-register')).toBeVisible();
    }
  );
});

// test.describe('Klasa 2 — Visible text change', () => {
//   test(
//     'should display correct subtitle on login page',
//     { tag: ['@auth', '@regression'] },
//     async ({ pages }) => {
//       await pages.loginPage.goto();

//       await expect(pages.loginPage.subtitle).toHaveText('User Login & Account Access Portal');
//     }
//   );

//   test(
//     'should display correct subtitle on register page',
//     { tag: ['@auth', '@regression'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.subtitle).toHaveText('New User Account Registration');
//     }
//   );

//   test(
//     'should display correct heading inside login form container',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.locator('[data-testid="login-form-container"] h2')).toContainText(
//         'Please Log In to Continue'
//       );
//     }
//   );

//   test(
//     'should display correct heading inside register form container',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(page.locator('[data-testid="register-form-container"] h2')).toContainText(
//         'New Account Registration'
//       );
//     }
//   );

//   test(
//     'should display correct label on register submit button',
//     { tag: ['@auth', '@regression'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.submitButton).toHaveText('Submit');
//     }
//   );
// });

// test.describe('Klasa 3 — ARIA role / semantic structure change', () => {
//   test(
//     'should find register submit button by ARIA role and accessible name',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(page.getByRole('button', { name: 'Submit Registration' })).toBeVisible();
//     }
//   );

//   test(
//     'should find login submit button by ARIA role and accessible name',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
//     }
//   );

//   test(
//     'should find email input on login page by textbox role and label',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.getByRole('textbox', { name: 'E-mail address' })).toBeVisible();
//     }
//   );

//   test(
//     'should find register link on login page by link role and name',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.getByRole('link', { name: 'Sign up here' })).toBeVisible();
//     }
//   );

//   test(
//     'should display a status role element after submitting an invalid email',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();
//       await pages.registerPage.emailInput.fill('invalid-email');
//       await pages.registerPage.passwordInput.fill('password123');
//       await pages.registerPage.submitButton.click();

//       await expect(page.getByRole('status')).toBeVisible();
//     }
//   );
// });

// test.describe('Klasa 4 — DOM hierarchy change', () => {
//   test(
//     'should find email input scoped within the login form element',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(
//         page.locator('[data-testid="login-form-wrapper"]').getByTestId('email-input')
//       ).toBeVisible();
//     }
//   );

//   test(
//     'should find password input scoped within the register form element',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(
//         page.locator('[data-testid="registration-form"]').getByTestId('password-input')
//       ).toBeVisible();
//     }
//   );

//   test(
//     'should find the submit button scoped within the login form container',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.locator('[data-testid="login-card"]').getByRole('button')).toBeVisible();
//     }
//   );

//   test(
//     'should find exactly two navigation links within the auth-links section',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.locator('[data-testid="nav-links"]').getByRole('link')).toHaveCount(2);
//     }
//   );

//   test(
//     'should find email input scoped within the outer auth-form-container on register page',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(
//         page.locator('[data-testid="form-wrapper"]').getByTestId('email-input')
//       ).toBeVisible();
//     }
//   );
// });

// test.describe('Klasa 5 — Combined change', () => {
//   test(
//     'should display correct subtitle and an enabled submit button on login page',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(pages.loginPage.subtitle).toHaveText('User Login Portal');
//       await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
//     }
//   );

//   test(
//     'should display correct subtitle and a visible register form on register page',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.subtitle).toHaveText('Register a New Account');
//       await expect(page.locator('[data-testid="registration-form"]')).toBeVisible();
//     }
//   );

//   test(
//     'should confirm register button has correct text and is inside the form',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.submitButton).toHaveText('Register Now');
//       await expect(page.locator('[data-testid="register-card"]').getByRole('button')).toBeVisible();
//     }
//   );

//   test(
//     'should confirm email input is reachable by both data-testid and ARIA role on login page',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.getByTestId('user-email')).toBeVisible();
//       await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
//     }
//   );

//   test(
//     'should display a visible alert with correct text after submitting an invalid email',
//     { tag: ['@auth', '@regression'] },
//     async ({ page, pages }) => {
//       await pages.registerPage.goto();
//       await pages.registerPage.emailInput.fill('invalid-email');
//       await pages.registerPage.passwordInput.fill('password123');
//       await pages.registerPage.submitButton.click();

//       await expect(page.getByRole('status')).toBeVisible();
//       await expect(pages.registerPage.errorAlert).toHaveText('Invalid email format provided');
//     }
//   );
// });

// // These tests are intentionally broken: the .not modifier is applied to an
// // assertion that should pass without it. They simulate a developer mistake
// // and are used to verify that the self-healing AI can detect and remove an
// // incorrect negation without modifying the application code.

// test.describe('Klasa 6 — Wrong assertion negation', () => {
//   test(
//     '[intentionally broken] register submit button should not be visible',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.submitButton).not.toBeVisible();
//     }
//   );

//   test(
//     '[intentionally broken] login email input should not be enabled',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.loginPage.goto();

//       await expect(pages.loginPage.emailInput).not.toBeEnabled();
//     }
//   );

//   test(
//     '[intentionally broken] register subtitle should not be visible',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.subtitle).not.toBeVisible();
//     }
//   );

//   test(
//     '[intentionally broken] login form container should not be attached to DOM',
//     { tag: ['@auth', '@negative'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.locator('[data-testid="login-form-container"]')).not.toBeAttached();
//     }
//   );

//   test(
//     '[intentionally broken] register display name input should not be visible',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.displayNameInput).not.toBeVisible();
//     }
//   );
// });

// test.describe('Klasa 8 — Typo in test source', () => {
//   test(
//     '[intentionally broken] should display correct subtitle on login page',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.loginPage.goto();

//       await expect(pages.loginPage.subtitle).toHaveText('User Lognin & Acount Acces');
//     }
//   );

//   test(
//     '[intentionally broken] should display correct subtitle on register page',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.subtitle).toHaveText('Crate Yur User Acocunt');
//     }
//   );

//   test(
//     '[intentionally broken] should display correct heading inside login form container',
//     { tag: ['@auth', '@negative'] },
//     async ({ page, pages }) => {
//       await pages.loginPage.goto();

//       await expect(page.locator('[data-testid="login-form-container"] h2')).toContainText(
//         'Loggin to Yor User Acount'
//       );
//     }
//   );

//   test(
//     '[intentionally broken] should display correct label on register submit button',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();

//       await expect(pages.registerPage.submitButton).toHaveText('Creat Accountt');
//     }
//   );

//   test(
//     '[intentionally broken] should display correct error message for invalid email',
//     { tag: ['@auth', '@negative'] },
//     async ({ pages }) => {
//       await pages.registerPage.goto();
//       await pages.registerPage.emailInput.fill('invalid-email');
//       await pages.registerPage.passwordInput.fill('password123');
//       await pages.registerPage.submitButton.click();

//       await expect(pages.registerPage.errorAlert).toHaveText('Plaese enter a valld emial addres');
//     }
//   );
// });
