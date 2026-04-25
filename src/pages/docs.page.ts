import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DocsPage extends BasePage {
  protected readonly PAGE_URL = '/docs.html';
  readonly headerSubtitle: Locator;

  constructor(page: Page) {
    super(page);
    this.headerSubtitle = page.locator('.docs-header-subtitle');
  }
}
