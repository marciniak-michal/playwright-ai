# Test Plan - Rolnopol

**App:** http://localhost:3000/  
**Docs:** http://localhost:3000/docs.html  
**API:** http://localhost:3000/swagger.html

## Overview

Agricultural management system for farmers, admins, and superadmins. Supports farm resources, marketplace trading, and financial operations.

## Test Scope

**In Scope:** Authentication, farm management (fields/animals/staff), marketplace, finances, role-based access, API  
**Out of Scope:** Performance, security testing, mobile

## Tag Convention

All test cases use a consistent 2-tag pattern: **`@feature @type`**

**Feature tags:**

- `@auth` - Authentication & session management
- `@farm` - Farm resources (fields, animals, staff, assignments)
- `@marketplace` - Offers and purchases
- `@finance` - Balance, transactions, transfers
- `@access` - Role-based access control
- `@api` - API endpoints and documentation
- `@e2e` - End-to-end user journeys

**Type tags:**

- `@smoke` - Critical happy path tests
- `@regression` - Standard functional tests
- `@integration` - Multi-component interactions
- `@negative` - Error handling and validation

---

## Test Cases

### Authentication

- **Registration** `@auth @regression`: New user creates account → auto-login, redirected to dashboard
- **Login** `@auth @smoke`: Valid credentials → token set, cookies created, redirect to /profile.html
- **Login failure** `@auth @negative`: Invalid credentials → error message shown
- **Logout** `@auth @smoke`: Clear cookies, invalidate session
- **Session expiration** `@auth @regression`: After 24h (user) / 1h (admin) → redirect to login
- **Rate limiting** `@auth @negative`: Multiple failed attempts → temporary block

### Farm Management

- **Add field** `@farm @smoke`: Create field with name and area → displayed in farm overview
- **Edit field** `@farm @regression`: Update field details → changes saved
- **Delete field** `@farm @regression`: Remove unassigned field → removed from list
- **Add animals** `@farm @regression`: Create animal (type, amount) → added to farm, optionally assign to field
- **Add staff** `@farm @regression`: Create staff member (name, age) → added to farm
- **Assignments** `@farm @integration`: Assign staff/animals to fields → linking recorded

### Marketplace

- **Create offer (unassigned)** `@marketplace @smoke`: Offer for unassigned field/animal → status 'active'
- **Create offer (assigned)** `@marketplace @negative`: Offer for assigned asset → status 'unavailable'
- **Buy offer** `@marketplace @smoke`: User B buys User A's offer → ownership transferred, balances updated, offer marked 'sold'
- **Buy with insufficient funds** `@marketplace @negative`: Try purchase exceeding balance → blocked with error "Insufficient funds: overdraft is not allowed"
- **Buy own offer** `@marketplace @negative`: Try purchasing own offer → blocked with error
- **Cancel offer** `@marketplace @regression`: Cancel active offer → status changed to 'cancelled'

### Financial Operations

- **View balance** `@finance @smoke`: Check current account balance → displayed correctly
- **View transactions** `@finance @regression`: Review transaction history → all income/expense listed
- **Transfer funds** `@finance @regression`: Transfer between users → both balances updated, transactions recorded
- **Transfer exceeding balance** `@finance @negative`: Try transfer > balance → blocked with error
- **Sale transaction** `@finance @integration`: Complete marketplace sale → seller gets income, buyer gets expense

### Access Control

- **Farmer restrictions** `@access @negative`: Farmer tries admin features → access denied
- **Admin access** `@access @smoke`: Admin views all users' resources → full access granted
- **Superadmin access** `@access @smoke`: Superadmin accesses all features → full system access

### API

- **Health check** `@api @smoke`: GET health endpoint → status returned
- **No auth** `@api @negative`: API request without token → 401 Unauthorized
- **With auth** `@api @smoke`: API request with valid token → successful response
- **Swagger UI** `@api @smoke`: Access /swagger.html → documentation loads

---

## End-to-End Scenarios

**New User Journey** `@e2e @smoke`: Register → login → add field → add animals → add staff → create assignment → create marketplace offer → view finances → logout

**Marketplace Trade** `@e2e @integration`: User A creates offer → User B purchases → verify ownership transfer and financial transactions

**Failed Purchase** `@e2e @negative`: User creates field → assigns staff → creates offer (unavailable) → another user tries to buy → blocked

---

## Notes

- Use demo accounts from documentation
- Test environment: localhost:3000
- Password storage is plain text (demo only)
- Cookies are accessible to JavaScript (not httpOnly)
