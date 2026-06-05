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

#### Login

- **Load login page** `@auth @smoke @login`: Navigate to /login.html → subtitle "User Login & Account Access" visible ✅
- **Login** `@auth @regression @login`: Valid credentials → token set, cookies created, redirect to /profile.html _(planned)_
- **Login failure** `@auth @negative @login`: Invalid credentials → error message shown _(planned)_
- **Logout** `@auth @smoke @login`: Clear cookies, invalidate session _(planned)_
- **Session expiration** `@auth @regression @login`: After 24h (user) / 1h (admin) → redirect to login _(planned)_
- **Rate limiting** `@auth @negative @login`: Multiple failed attempts → temporary block _(planned)_

#### Registration - Positive Tests

- **Load register page** `@auth @smoke @registration`: Navigate to /register.html → subtitle "Create Your User Account" visible ✅
- **Successful registration** `@auth @smoke @registration`: New user creates account with all fields → success message shown, redirected to /login.html ✅
- **Registration without display name** `@auth @regression @registration`: Register with only email and password → success message shown ✅
- **Minimum password length** `@auth @regression @registration`: Register with exactly 3 character password → registration successful ✅

#### Registration - Negative Tests

- **Empty form submission** `@auth @negative @registration`: Submit empty form → validation error on required fields ✅
- **Invalid email format** `@auth @negative @registration`: Parametrized cases — `invalid-email`, `test@`, `@example.com`, `test@example`, `test@.com`, `test @example.com` → "Please enter a valid email address" shown for each ✅
- **Password too short** `@auth @negative @registration`: Password with less than 3 characters → validation error shown ✅
- **Display name too short** `@auth @negative @registration`: Display name with less than 3 characters → validation error shown ✅
- **Display name truncation** `@auth @negative @registration`: Display name exceeding 20 characters → automatically truncated to exactly 20 characters (e.g. "ThisIsAVeryLongDispl") ✅
- **Duplicate email** `@auth @negative @registration`: Register with existing email → error message "User with this email already exists" ✅
- **Whitespace-only password** `@auth @negative @registration`: Password with only spaces → error message "Password must be at least 3 characters long" ✅

### API

- **Swagger UI** `@documentation @smoke`: Access /swagger.html → API description "API documentation for the Rolnopol service with versioning support" visible ✅

## Notes

- Use demo accounts from documentation
