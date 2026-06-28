import { type Locator, type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the embedded Swagger UI. */
export class SwaggerPage extends BasePage {
  readonly PAGE_URL = PAGE_URLS.SWAGGER;
  readonly apiDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.apiDescription = page
      .frameLocator('iframe#swagger-frame')
      .locator('.information-container .renderedMarkdown');
  }
}
