import { type Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  protected abstract readonly PAGE_URL: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.PAGE_URL);
  }
}
