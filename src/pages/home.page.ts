import { type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the home route. */
export class HomePage extends BasePage {
  protected readonly PAGE_URL = PAGE_URLS.HOME;

  constructor(page: Page) {
    super(page);
  }
}
