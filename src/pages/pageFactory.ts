import { type Page } from '@playwright/test';
import { DocsPage } from './docs.page';
import { HomePage } from './home.page';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { SwaggerPage } from './swagger.page';

/**
 * Lazily instantiates page objects on first access and memoizes them for
 * the lifetime of the fixture. Add new pages here — no fixture changes needed.
 */
export class PageFactory {
  private readonly _page: Page;

  private _home?: HomePage;
  private _login?: LoginPage;
  private _register?: RegisterPage;
  private _docs?: DocsPage;
  private _swagger?: SwaggerPage;

  constructor(page: Page) {
    this._page = page;
  }

  get home(): HomePage {
    return (this._home ??= new HomePage(this._page));
  }

  get login(): LoginPage {
    return (this._login ??= new LoginPage(this._page));
  }

  get register(): RegisterPage {
    return (this._register ??= new RegisterPage(this._page));
  }

  get docs(): DocsPage {
    return (this._docs ??= new DocsPage(this._page));
  }

  get swagger(): SwaggerPage {
    return (this._swagger ??= new SwaggerPage(this._page));
  }
}
