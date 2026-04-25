# Test Plan - Rolnopol

**App:** http://localhost:3000/  
**Docs:** http://localhost:3000/docs.html  
**API:** http://localhost:3000/swagger.html

## Test Scope

**In Scope:** Authentication, farm management (fields/animals/staff), marketplace, finances, role-based access, RWD (Desktop / Mobile resolutions), API
**Out of Scope:** Performance and security testing

## Tag Convention

All test cases use a consistent 2-tag pattern: **`@feature @type`**

**Feature tags:**

- `@auth` - Authentication & session management
- `@api` - API endpoints
- `@documentation` - Documentation page
- `@e2e` - End-to-end user journeys
- `@registration` - Tests connected with registration functionality
- `@login` - Tests connected with login functionality

**Type tags:**

- `@smoke` - Critical happy path tests
- `@regression` - Standard functional tests
- `@integration` - Multi-component interactions
- `@negative` - Error handling and validation

---

## Test Cases

### Navigation / Smoke

- **Homepage title** `@e2e @smoke`: Load homepage → page title contains "Rolnopol" ✅
- **Load docs page** `@documentation @smoke`: Navigate to /docs.html → subtitle "Rolnopol System Guide & API Reference" visible ✅

### Authentication

- **Load login page** `@auth @smoke @login`: Navigate to /login.html → subtitle "User Login & Account Access" visible ✅
- **Load register page** `@auth @smoke @registration`: Navigate to /register.html → subtitle "Create Your User Account" visible ✅
- **Registration** `@auth @smoke @registration`: New user creates account → success message shown, redirected to /login.html ✅
- **Login** `@auth @regression`: Valid credentials → token set, cookies created, redirect to /profile.html _(planned)_
- **Login failure** `@auth @negative`: Invalid credentials → error message shown _(planned)_
- **Logout** `@auth @smoke`: Clear cookies, invalidate session _(planned)_
- **Session expiration** `@auth @regression`: After 24h (user) / 1h (admin) → redirect to login _(planned)_
- **Rate limiting** `@auth @negative`: Multiple failed attempts → temporary block _(planned)_

### API

- **Swagger UI** `@documentation @smoke`: Access /swagger.html → API description "API documentation for the Rolnopol service with versioning support" visible ✅

## Notes

- Use demo accounts from documentation
