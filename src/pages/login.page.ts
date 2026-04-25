import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly subtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subtitle = page.getByTestId('login-subtitle');
  }

  async goto() {
    await this.page.goto('/login.html');
  }
}
