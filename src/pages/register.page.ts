import { type Locator, type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the registration flow, including form submission helpers. */
export class RegisterPage extends BasePage {
  readonly PAGE_URL = PAGE_URLS.REGISTER;
  readonly emailInput: Locator;
  readonly displayNameLabel: Locator;
  readonly displayNameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorAlert: Locator;
  readonly subtitle: Locator;
  readonly loginHereLink: Locator;
  readonly backToHomeLink: Locator;
  readonly passwordGuideLine: Locator;

  readonly backToHomeText = 'Backk to home';

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('email-input');
    this.displayNameLabel = page.locator('label[for="displayedName"]');
    this.displayNameInput = page.locator('#displayedName');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.successMessage = page.locator('div.success[role="alert"] div.notification-message');
    this.errorAlert = page.locator('div.form__error[role="alert"]');
    this.subtitle = page.getByTestId('register-subtitle');
    this.loginHereLink = page.getByTestId('login-link');
    this.backToHomeLink = page.locator('div.auth-form div.auth-links p a[data-testid="home-link"]');
    this.passwordGuideLine = page.locator('div.auth-info ul li#password-guideline');
  }

  async register(email: string, password: string, displayName?: string) {
    await this.emailInput.fill(email);
    if (displayName) await this.displayNameInput.fill(displayName);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
