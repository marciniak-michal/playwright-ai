import { expect, test } from '../src/fixtures/index.fixture';

function getRequiredEnvVar(name: 'E2E_LOGIN_EMAIL' | 'E2E_LOGIN_PASSWORD'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Add it to .env.`);
  }

  return value;
}

const loginEmail = getRequiredEnvVar('E2E_LOGIN_EMAIL');
const loginPassword = getRequiredEnvVar('E2E_LOGIN_PASSWORD');

test.describe('Login E2E', () => {
  test(
    'should login, verify profile sections, and logout',
    { tag: ['@auth', '@e2e'] },
    async ({ page, pages }) => {
      await test.step('Navigate to login page', async () => {
        await pages.loginPage.goto();
      });

      await test.step('Login with valid credentials', async () => {
        await pages.loginPage.login(loginEmail, loginPassword);
      });

      await test.step('Verify redirect to profile page after login', async () => {
        await expect(page).toHaveURL(pages.profilePage.PAGE_URL);
      });

      await test.step('Verify profile sections are visible', async () => {
        await expect(pages.profilePage.profileInformationHeading).toBeVisible();
        await expect(pages.profilePage.updateProfileHeading).toBeVisible();
        await expect(pages.profilePage.dangerZoneHeading).toBeVisible();
      });

      await test.step('Logout and verify redirect to login page', async () => {
        await pages.profilePage.logoutButton.click();
        await expect(page).toHaveURL(pages.loginPage.PAGE_URL);
      });
    }
  );
});
