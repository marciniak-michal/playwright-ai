## Project Technology Stack

This project uses the Playwright Test framework with TypeScript for automated testing.
When writing or updating tests, always review [playwright.config.ts](../playwright.config.ts) for project-specific settings (such as test directory, baseURL, reporters and devices).

## Conventional Commit Rules

Follow these rules for all commit messages:

1. Use this format:
   <type>[optional scope]: <short description>

2. Types:
   - feat: new feature
   - fix: bug fix
   - docs: documentation
   - style: formatting only
   - refactor: code refactor
   - perf: performance improvement
   - test: tests only
   - chore: build/tools/infra

3. Examples:
   - feat(login): add OAuth2 login
   - fix(api): handle null userId
   - docs(readme): update usage

4. Keep subject under 72 characters, no period at end.
5. Use imperative mood ("add", not "added").

## Test Tagging Rules

When creating new Playwright tests, always use **2 tags**: `@feature @type`

- **Features**: `@auth`, `@farm`, `@marketplace`, `@finance`, `@access`, `@api`, `@e2e`
- **Types**: `@smoke`, `@regression`, `@integration`, `@negative`

Example: `test('should login', { tag: ['@auth', '@smoke'] })`

See #file:../TEST_PLAN.md for complete tag definitions and test cases.

## Test Structure: Arrange-Act-Assert Pattern

All tests must follow the **Arrange-Act-Assert (AAA)** pattern with clear comments:

1. **Arrange**: Set up test data, navigate to pages, prepare the initial state
2. **Act**: Perform the action being tested (click, fill, submit, etc.)
3. **Assert**: Verify the expected outcomes and behavior
