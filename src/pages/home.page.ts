import { type Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the home route. */
export class HomePage extends BasePage {
  readonly PAGE_URL = PAGE_URLS.HOME;
  readonly subtitle: Locator;

  constructor(page: Page) {
    super(page);
    this.subtitle = page.locator('header#home-legacy-header span:not([class])');
  }
}
