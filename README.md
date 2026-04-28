# playwright-ai

Test Automation Framework built with Playwright and use of AI

## Project Description

**playwright-ai** is an end-to-end test automation framework for the **Rolnopol** web application. It is built on top of [Playwright](https://playwright.dev/) and TypeScript, and follows a Page Object pattern to keep tests clean, maintainable, and reusable.

### Key Features

- **Page Object Pattern** – UI interactions are encapsulated in dedicated page classes under `src/pages/`, keeping test files focused on assertions.
- **Arrange-Act-Assert structure** – All tests follow a clear AAA pattern for readability and maintainability.
- **Tag-based test organisation** – Every test carries at least two tags (`@feature` and `@type`) so suites can be filtered precisely.
- **HTML reporting** – A full HTML report is generated after each run for easy post-run analysis.
- **CI-ready** – Supports environment-driven configuration (retries, single worker, `forbidOnly`) out of the box.

---

## Prerequisites

| Tool | Minimum version | Notes |
|------|-----------------|-------|
| [Node.js](https://nodejs.org/) | 18 LTS | Tested with Node 18 and 20 |
| npm | 9+ | Bundled with Node.js |
| Playwright browsers | see below | Installed via `npm run install:browsers` |

> A running instance of the **Rolnopol** application must be accessible at `http://localhost:3000` before executing the tests. Refer to the [Rolnopol application repository](https://github.com/marciniak-michal/playwright-ai) for instructions on starting the local development server.

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/marciniak-michal/playwright-ai.git
cd playwright-ai

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browsers
npm run install:browsers
```

---

## Usage

All scripts are defined in `package.json`.

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with a visible browser window |
| `npm run test:debug` | Open Playwright's step-by-step debugger |
| `npm run codegen` | Launch Playwright's code generator |
| `npm run test:report` | Open the last HTML report in the browser |

### Run a specific test file

```bash
npx playwright test tests/main.smoke.spec.ts
```

---

## Testing

### Tag-based filtering

Every test is tagged with at least one **feature** tag and one **type** tag.

**Feature tags**

| Tag | Scope |
|-----|-------|
| `@auth` | Authentication & session management |
| `@e2e` | End-to-end user journeys |
| `@api` | API endpoints |
| `@documentation` | Documentation & Swagger pages |
| `@registration` | Registration functionality |
| `@login` | Login functionality |

**Type tags**

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path tests |
| `@regression` | Standard functional tests |
| `@integration` | Multi-component interactions |
| `@negative` | Error handling and edge cases |

#### Filtering examples

```bash
# Run only smoke tests
npx playwright test --grep "@smoke"

# Run authentication smoke tests
npx playwright test --grep "@auth" --grep "@smoke"

# Exclude negative tests
npx playwright test --grep-invert "@negative"
```

### Reporters

The framework is configured to produce two reporters simultaneously:

- **HTML** – detailed report saved to `playwright-report/` (open with `npm run test:report`)
- **Line** – live progress output in the terminal

### CI configuration

When the `CI` environment variable is set the runner automatically:

- Disables `test.only` calls (`forbidOnly`)
- Retries each failing test up to **2** times
- Limits concurrency to **1** worker

---

## Project Structure

```
playwright-ai/
├── src/
│   ├── constants/
│   │   └── pageUrls.ts          # Centralised URL constants
│   ├── helpers/
│   │   └── testDataHelper.ts    # Shared test-data utilities
│   └── pages/                   # Page Object classes
│       ├── base.page.ts
│       ├── docs.page.ts
│       ├── home.page.ts
│       ├── login.page.ts
│       ├── register.page.ts
│       └── swagger.page.ts
├── tests/                       # Playwright test specs
│   ├── main.smoke.spec.ts
│   ├── registration.negative.spec.ts
│   └── registration.positive.spec.ts
├── CODING_STANDARDS.md          # Coding conventions (AAA, Page Object rules)
├── TEST_PLAN.md                 # Full test plan with tag definitions
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json
└── package.json
```
