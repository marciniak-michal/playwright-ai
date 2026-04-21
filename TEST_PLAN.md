# Rolnopol Test Plan

## 1. Document Control

- Product: Rolnopol
- Framework: Playwright Test + TypeScript
- Repository: playwright-ai
- Environment under test:
  - App: http://localhost:3000/
  - Docs: http://localhost:3000/docs.html
  - API UI: http://localhost:3000/swagger.html
- Ownership:
  - QA/Automation: responsible for coverage and test design
  - Engineering: responsible for feature correctness and testability

## 2. Purpose and Quality Goals

This document defines a maintainable, extensible strategy for automated testing of Rolnopol.

Primary quality goals:

- Prevent critical user-facing regressions in core flows.
- Validate business rules for farm, marketplace, and finance domains.
- Verify role-based access controls and API contract basics.
- Keep test suites fast, stable, and easy to evolve.

## 3. Test Scope

In scope:

- Authentication and session behavior
- Farm management (fields, animals, staff, assignments)
- Marketplace lifecycle (offer creation, purchase, cancellation)
- Financial operations (balances, transfers, transaction history)
- Access control by role (farmer, admin, superadmin)
- API availability and authorization basics
- Cross-module end-to-end user journeys

Out of scope:

- Load/performance testing
- Security penetration testing
- Mobile-specific validation

## 4. Test Strategy

Test levels:

- Smoke: fast confidence checks for deployment readiness
- Regression: broad functional verification after changes
- Integration: workflows across multiple modules
- Negative: error handling, validation, and denial paths

Execution principle:

- Every feature area has at least one smoke scenario.
- Critical business rules are covered by regression and negative tests.
- Multi-step business workflows are covered by integration or e2e tests.

## 5. Tagging Standard (Mandatory)

Every test should include 2 tags:

- 1 feature tag
- 1 type tag

Pattern:

- `@feature @type`

Allowed feature tags:

- `@auth` - authentication and session lifecycle
- `@farm` - farm resources and assignments
- `@marketplace` - offers and purchase workflows
- `@finance` - balances, transfers, transactions
- `@access` - role-based authorization rules
- `@api` - API endpoint and documentation validation
- `@e2e` - cross-module user journeys

Allowed type tags:

- `@smoke` - critical, fast, release confidence
- `@regression` - broader functional verification
- `@integration` - multi-component behavior
- `@negative` - invalid or failure conditions

Compliance notes:

- Avoid custom tags unless added to this document first.
- Tests with legacy or non-standard tags should be migrated gradually to this standard.

## 6. Test Design Pattern

Use this Given/When/Then style to keep cases clear and reusable.

## 7. Functional Coverage Matrix

### 7.1 Smoke Suite

- E2E-SMOKE-001 - Homepage loads with Rolnopol title (`@e2e @smoke`)
- AUTH-SMOKE-001 - Login page loads with expected subtitle (`@auth @smoke`)
- AUTH-SMOKE-002 - Register page loads with expected subtitle (`@auth @smoke`)
- API-SMOKE-001 - Docs page loads (`@api @smoke`)
- API-SMOKE-002 - Swagger page and API frame load (`@api @smoke`)

### 7.2 Authentication

- AUTH-REG-001 - Register new user and redirect to dashboard (`@auth @regression`)
- AUTH-SMOKE-003 - Login with valid credentials (`@auth @smoke`)
- AUTH-NEG-001 - Login with invalid credentials shows error (`@auth @negative`)
- AUTH-SMOKE-004 - Logout clears session and cookies (`@auth @smoke`)
- AUTH-REG-002 - Session expiry redirects to login (`@auth @regression`)
- AUTH-NEG-002 - Repeated failed logins trigger rate limiting (`@auth @negative`)

### 7.3 Farm Management

- FARM-SMOKE-001 - Create field and display in overview (`@farm @smoke`)
- FARM-REG-001 - Edit field details (`@farm @regression`)
- FARM-REG-002 - Delete unassigned field (`@farm @regression`)
- FARM-REG-003 - Add animals and optional field assignment (`@farm @regression`)
- FARM-REG-004 - Add staff member (`@farm @regression`)
- FARM-INT-001 - Assign staff/animals to fields (`@farm @integration`)

### 7.4 Marketplace

- MKT-SMOKE-001 - Create offer for eligible unassigned asset (`@marketplace @smoke`)
- MKT-NEG-001 - Block offer for assigned asset (`@marketplace @negative`)
- MKT-SMOKE-002 - Purchase offer transfers ownership and updates balances (`@marketplace @smoke`)
- MKT-NEG-002 - Block purchase with insufficient funds (`@marketplace @negative`)
- MKT-NEG-003 - Block purchase of own offer (`@marketplace @negative`)
- MKT-REG-001 - Cancel active offer (`@marketplace @regression`)

### 7.5 Financial Operations

- FIN-SMOKE-001 - Display current account balance (`@finance @smoke`)
- FIN-REG-001 - Display transaction history (`@finance @regression`)
- FIN-REG-002 - Transfer funds between users (`@finance @regression`)
- FIN-NEG-001 - Block transfer above available balance (`@finance @negative`)
- FIN-INT-001 - Marketplace sale produces correct ledger impact (`@finance @integration`)

### 7.6 Access Control

- ACC-NEG-001 - Farmer denied admin-only actions (`@access @negative`)
- ACC-SMOKE-001 - Admin can view users' resources (`@access @smoke`)
- ACC-SMOKE-002 - Superadmin has full system access (`@access @smoke`)

### 7.7 API

- API-SMOKE-003 - Health endpoint returns success (`@api @smoke`)
- API-NEG-001 - Unauthorized request without token returns 401 (`@api @negative`)
- API-SMOKE-004 - Authorized request with valid token succeeds (`@api @smoke`)

### 7.8 End-to-End Journeys

- E2E-SMOKE-002 - New user journey: register to logout (`@e2e @smoke`)
- E2E-INT-001 - Marketplace trade between two users (`@e2e @integration`)
- E2E-NEG-001 - Failed purchase due to business rule constraint (`@e2e @negative`)

## 8. Test Data and Environment Rules

- Use deterministic demo accounts and seeded fixtures.
- Isolate data per test where possible; avoid cross-test coupling.
- Prefer API/setup helpers over long UI setup chains for non-UI preconditions.
- Ensure each test can run independently and in parallel.

## 9. Entry and Exit Criteria

Entry criteria:

- Target environment is reachable.
- Required seed data and credentials are available.
- Core pages (`/`, `/login.html`, `/register.html`) are operational.

Exit criteria:

- Smoke suite passes 100%.
- No open critical defects in covered areas.
- Regression failures are triaged with clear ownership.

## 10. Maintenance and Extension Guidelines

When adding new features/tests:

1. Add/confirm feature mapping in Section 7.
2. Follow Section 5 tagging standard (`@feature @type`).
3. Use the Section 6 test case template.
4. Keep titles behavior-focused and stable.
5. Prefer resilient selectors (`data-testid`) over visual/text-only locators.
6. Update this plan in the same pull request as new test coverage.

Naming conventions:

- Test files: `<area>.<type>.spec.ts` (example: `marketplace.regression.spec.ts`)
- Test titles: `should <expected behavior> when <condition>`
- IDs in plan: `<AREA>-<TYPE>-<NNN>`

## 11. Risks and Assumptions

Assumptions:

- Local environment uses `http://localhost:3000`.
- Demo implementation details (for example cookie policy) may differ from production-grade security practices.

Risks:

- UI copy changes can cause brittle assertions if text matching is too strict.
- Shared mutable test data can create flaky behavior in parallel runs.
- Incomplete tag compliance can reduce suite filtering quality.
