import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SwaggerPage extends BasePage {
  protected readonly PAGE_URL = '/swagger.html';
  readonly apiDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.apiDescription = page
      .frameLocator('iframe#swagger-frame')
      .locator('.information-container .renderedMarkdown');
  }
}
