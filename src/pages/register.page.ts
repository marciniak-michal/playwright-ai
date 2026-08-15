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
    this.emailInput = page.getByTestId('form-input-email');
    this.displayNameLabel = page.locator('label[for="displayNameLabel"]');
    this.displayNameInput = page.locator('#displayNameInput');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.locator('button.submit-button');
    this.successMessage = page.getByText('Registration successful!');
    this.errorAlert = page.locator('[role="alert"]');
    this.subtitle = page.getByTestId('register-subtitle');
    this.loginHereLink = page.getByRole('button', { name: 'Login here' });
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
