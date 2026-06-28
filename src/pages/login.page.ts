import { type Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the login screen. */
export class LoginPage extends BasePage {
  readonly PAGE_URL = PAGE_URLS.LOGIN;
  readonly subtitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.subtitle = page.getByTestId('login-subtitle');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit-btn');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
