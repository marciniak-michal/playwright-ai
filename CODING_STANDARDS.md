# Coding Standards

## Test Structure: Arrange-Act-Assert Pattern

All tests must follow the **Arrange-Act-Assert (AAA)** pattern:

1. **Arrange**: Set up test data, navigate to pages, prepare the initial state
2. **Act**: Perform the action being tested (click, fill, submit, etc.)
3. **Assert**: Verify the expected outcomes and behavior

### Comment Guidance

1. Prefer clear test flow over mechanical `Arrange` / `Act` / `Assert` comments when the structure is already obvious.
2. Remove obvious or repetitive inline comments that only restate the code.
3. Keep or add short JSDoc comments only when they explain intent, context, or architectural boundaries.

## Page Object Pattern

Follow these best practices when implementing Page Objects in Playwright tests:

### Core Principles

1. **No Assertions in Page Objects**
   - Page Object classes should NEVER contain `expect()` statements
   - All verifications and validations must remain in test files only

2. **What Page Objects Should Contain**
   - **Locator definitions**: Expose locators as `readonly` properties
   - **Navigation methods**: Methods like `goto()` to navigate to pages
   - **Action methods**: Methods to perform user actions (fill, click, select)

3. **Expose Locators Publicly**
   - Make locators `readonly` and public so tests can access them
   - Tests perform assertions directly on exposed locators
   - Example: `await expect(registerPage.successMessage).toBeVisible();`

### Example Structure

```typescript
export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator; // ✅ Exposed locator
  readonly submitButton: Locator; // ✅ Exposed locator
  readonly successMessage: Locator; // ✅ Exposed locator

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.successMessage = page.getByText('Registration successful!');
  }

  async goto() {
    // ✅ Navigation method
    await this.page.goto('/register.html');
  }

  async register(email: string) {
    // ✅ Action method
    await this.emailInput.fill(email);
    await this.submitButton.click();
    // ❌ NO expect() here
  }
}
```

## PageFactory Fixture

All page objects are accessed through the `pages` fixture provided by `src/fixtures/index.ts`. Tests never instantiate page objects directly.

- `pages.home`, `pages.login`, `pages.register`, `pages.docs`, `pages.swagger`
- Each page object is lazily created on first access and memoized for the test's lifetime.
- Adding a new page requires only a getter in `src/pages/pageFactory.ts` — no fixture changes needed.

### In Test Files

```typescript
test('should register successfully', async ({ page, pages }) => {
  // Arrange
  await pages.register.goto();

  // Act
  await pages.register.register('test@example.com');

  // Assert - ALL assertions in test file
  await expect(pages.register.successMessage).toBeVisible();
  await expect(page).toHaveURL(/.*\/login\.html/);
});
```

### Benefits

- **Clear separation of concerns**: Actions vs Assertions
- **Better test readability**: Expectations are visible in tests
- **Easier maintenance**: Page Objects focus on UI structure
- **Reusable components**: Page Objects work with different assertion scenarios
- **Lazy instantiation**: Page objects are created only when accessed, avoiding unnecessary navigation
- **Single fixture entry point**: `pages` fixture provides all page objects — no imports or manual construction in tests
- **Scalable**: Adding a new page only requires a getter in `PageFactory`
