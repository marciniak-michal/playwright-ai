import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly PAGE_URL = '/login.html';

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitBtn: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmitBtn = page.getByTestId('login-submit-btn');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.PAGE_URL);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitBtn.click();
  }
}
