# Test Plan - Rolnopol

**App:** http://localhost:3000/  
**Docs:** http://localhost:3000/docs.html  
**API:** http://localhost:3000/swagger.html

## Overview

Agricultural management system for farmers, admins, and superadmins. Supports farm resources, marketplace trading, and financial operations.

## Test Scope

**In Scope:** Authentication, farm management (fields/animals/staff), marketplace, finances, role-based access, API  
**Out of Scope:** Performance, security testing, mobile

---

## Test Cases

### Authentication

- **Registration:** New user creates account → auto-login, redirected to dashboard
- **Login:** Valid credentials → token set, cookies created, redirect to /profile.html
- **Login failure:** Invalid credentials → error message shown
- **Logout:** Clear cookies, invalidate session
- **Session expiration:** After 24h (user) / 1h (admin) → redirect to login
- **Rate limiting:** Multiple failed attempts → temporary block

### Farm Management

- **Add field:** Create field with name and area → displayed in farm overview
- **Edit field:** Update field details → changes saved
- **Delete field:** Remove unassigned field → removed from list
- **Add animals:** Create animal (type, amount) → added to farm, optionally assign to field
- **Add staff:** Create staff member (name, age) → added to farm
- **Assignments:** Assign staff/animals to fields → linking recorded

### Marketplace

- **Create offer (unassigned):** Offer for unassigned field/animal → status 'active'
- **Create offer (assigned):** Offer for assigned asset → status 'unavailable'
- **Buy offer:** User B buys User A's offer → ownership transferred, balances updated, offer marked 'sold'
- **Buy with insufficient funds:** Try purchase exceeding balance → blocked with error "Insufficient funds: overdraft is not allowed"
- **Buy own offer:** Try purchasing own offer → blocked with error
- **Cancel offer:** Cancel active offer → status changed to 'cancelled'

### Financial Operations

- **View balance:** Check current account balance → displayed correctly
- **View transactions:** Review transaction history → all income/expense listed
- **Transfer funds:** Transfer between users → both balances updated, transactions recorded
- **Transfer exceeding balance:** Try transfer > balance → blocked with error
- **Sale transaction:** Complete marketplace sale → seller gets income, buyer gets expense

### Access Control

- **Farmer restrictions:** Farmer tries admin features → access denied
- **Admin access:** Admin views all users' resources → full access granted
- **Superadmin access:** Superadmin accesses all features → full system access

### API

- **Health check:** GET health endpoint → status returned
- **No auth:** API request without token → 401 Unauthorized
- **With auth:** API request with valid token → successful response
- **Swagger UI:** Access /swagger.html → documentation loads

---

## End-to-End Scenarios

**New User Journey:** Register → login → add field → add animals → add staff → create assignment → create marketplace offer → view finances → logout

**Marketplace Trade:** User A creates offer → User B purchases → verify ownership transfer and financial transactions

**Failed Purchase:** User creates field → assigns staff → creates offer (unavailable) → another user tries to buy → blocked

---

## Notes

- Use demo accounts from documentation
- Test environment: localhost:3000
- Password storage is plain text (demo only)
- Cookies are accessible to JavaScript (not httpOnly)
