import { type Locator, type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly PAGE_URL = PAGE_URLS.LOGIN;
  readonly subtitle: Locator;

  constructor(page: Page) {
    super(page);
    this.subtitle = page.getByTestId('login-subtitle');
  }
}
