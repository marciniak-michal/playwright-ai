import { type Locator, type Page } from '@playwright/test';

export class DocsPage {
  readonly page: Page;
  readonly headerSubtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerSubtitle = page.locator('.docs-header-subtitle');
  }

  async goto() {
    await this.page.goto('/docs.html');
  }
}
