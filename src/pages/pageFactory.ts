import { type Page } from '@playwright/test';
import { DocsPage } from './docs.page';
import { HomePage } from './home.page';
import { LoginPage } from './login.page';
import { ProfilePage } from './profile.page';
import { RegisterPage } from './register.page';
import { SwaggerPage } from './swagger.page';

/**
 * Lazily instantiates page objects on first access and memoizes them for
 * the lifetime of the fixture. Add new pages here — no fixture changes needed.
 */
export class PageFactory {
  private readonly _page: Page;

  private _homePage?: HomePage;
  private _loginPage?: LoginPage;
  private _registerPage?: RegisterPage;
  private _profilePage?: ProfilePage;
  private _docsPage?: DocsPage;
  private _swaggerPage?: SwaggerPage;

  constructor(page: Page) {
    this._page = page;
  }

  get homePage(): HomePage {
    return (this._homePage ??= new HomePage(this._page));
  }

  get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this._page));
  }

  get registerPage(): RegisterPage {
    return (this._registerPage ??= new RegisterPage(this._page));
  }

  get profilePage(): ProfilePage {
    return (this._profilePage ??= new ProfilePage(this._page));
  }

  get docsPage(): DocsPage {
    return (this._docsPage ??= new DocsPage(this._page));
  }

  get swaggerPage(): SwaggerPage {
    return (this._swaggerPage ??= new SwaggerPage(this._page));
  }
}
