import { type Locator, type Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/pageUrls';
import { BasePage } from './base.page';

/** Page object for the user profile screen. */
export class ProfilePage extends BasePage {
  readonly PAGE_URL = PAGE_URLS.PROFILE;
  readonly profileInformationHeading: Locator;
  readonly updateProfileHeading: Locator;
  readonly dangerZoneHeading: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.profileInformationHeading = page.getByRole('heading', { name: 'Profile Information' });
    this.updateProfileHeading = page.getByRole('heading', { name: 'Update Profile' });
    this.dangerZoneHeading = page.getByRole('heading', { name: 'Danger Zone' });
    this.logoutButton = page.getByTestId('profile-header').getByTestId('logout-btn');
  }
}
