import { type Locator, type Page } from '@playwright/test';

export class SwaggerPage {
  readonly page: Page;
  readonly apiDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.apiDescription = page
      .frameLocator('iframe#swagger-frame')
      .locator('.information-container .renderedMarkdown');
  }

  async goto() {
    await this.page.goto('/swagger.html');
  }
}
