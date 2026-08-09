import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByTestId('email-input');
  readonly passwordInput = this.page.getByTestId('password-input');
  readonly submitButton = this.page.getByTestId('login-submit-btn');

  async goto() {
    await this.page.goto('/login.html');
  }
}
