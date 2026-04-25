import { type Locator, type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

export class DocsPage extends BasePage {
  protected readonly PAGE_URL = PAGE_URLS.DOCS;
  readonly headerSubtitle: Locator;

  constructor(page: Page) {
    super(page);
    this.headerSubtitle = page.locator('.docs-header-subtitle');
  }
}
