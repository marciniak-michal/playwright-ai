# playwright-ai

Test Automation Framework built with Playwright and use of the AI

## Prerequisites

- [Node.js](https://nodejs.org/) 18 LTS or later
- A running instance of the **Rolnopol** application at `http://localhost:3000`

## Installation

```bash
npm install
npm run install:browsers
```

## Environment Variables

- `BASE_URL`
- `E2E_LOGIN_EMAIL`
- `E2E_LOGIN_PASSWORD`

## Usage

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm test`            | Run all tests (headless)         |
| `npm run test:headed` | Run tests with a visible browser |
| `npm run test:debug`  | Step-by-step debugger            |
| `npm run test:report` | Open the last HTML report        |

Run a specific file:

```bash
npx playwright test tests/main.smoke.spec.ts
```

Filter by tag (see [TEST_PLAN.md](TEST_PLAN.md) for the full tag list):

```bash
npx playwright test --grep "@smoke"
```

## Further Reading

- [TEST_PLAN.md](TEST_PLAN.md) – test scope, tag conventions, and test cases
- [CODING_STANDARDS.md](CODING_STANDARDS.md) – Page Object pattern and AAA test structure
