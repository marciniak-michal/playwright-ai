import { expect, test } from '@playwright/test';

test('should display page with Rolnopol title on homepage', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rolnopol/);
});
