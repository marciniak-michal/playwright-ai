import { type Page } from '@playwright/test';
import { PageUrl } from '../constants/pageUrls';

export abstract class BasePage {
  readonly page: Page;
  protected abstract readonly PAGE_URL: PageUrl;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.PAGE_URL);
  }
}
