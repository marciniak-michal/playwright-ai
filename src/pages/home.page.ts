import { type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  protected readonly PAGE_URL = '/';

  constructor(page: Page) {
    super(page);
  }
}
