# Quickstart: User Registration & Auth Nav Redesign

## 1. Install dependencies

From the repository root:

```bash
npm install
```

This installs all workspace dependencies including `bcryptjs` (added to `packages/backend`).

## 2. Start the application

```bash
npm run start
```

Open `http://localhost:3000` in a browser.

## 3. Run tests

```bash
# All workspaces
npm test

# Backend only
npm run test:backend

# Frontend only
npm run test:frontend
```

Backend tests require no running server — supertest drives `app.js` in-process.

## 4. Validate user stories manually

### Story 1 — New user registers an account (P1)

1. Open `http://localhost:3000/register` while logged out.
2. Fill in a unique email, a display name (2–20 characters), and a password (≥ 8 characters).
3. Submit. Confirm:
   - You are redirected to `/leagues`.
   - The nav header shows your display name and a Logout button.
4. Open `http://localhost:3000/register` while logged in. Confirm:
   - You are redirected away (to `/leagues`) and the registration form is not shown.
5. Submit the form with an already-registered email. Confirm:
   - An inline error message appears: "An account with this email address already exists."
   - The form is not submitted a second time.
6. Submit the form with a blank field or a password fewer than 8 characters. Confirm:
   - Per-field inline validation errors appear before the form is submitted.

### Story 2 — Auth controls consolidated in header (P2)

1. Load any page while logged out. Confirm:
   - The right side of the nav shows a **Register** button and a **Login** button.
   - No plain "Signed out" text is visible.
   - The primary nav links (Home, Leagues, How to Play) do not include a Login link.
2. Log in via `/login`. Confirm:
   - The nav right side now shows your display name and a **Logout** button.
   - No Register or Login buttons are visible.
3. Click the Register button (logged out). Confirm navigation to `/register`.
4. Click the Login button (logged out). Confirm navigation to `/login`.
5. Click Logout (logged in). Confirm:
   - Session is cleared.
   - You are redirected to `/` (home page).
   - The nav reverts to the Register + Login buttons.
6. Resize the browser to a narrow viewport. Confirm the auth section remains visible and does not overlap the primary nav links.

### Story 3 — Login CTA removed from landing page (P3)

1. Navigate to `http://localhost:3000/` while logged out.
2. Confirm:
   - No "Login" CTA button appears in the hero section.
   - "Browse Leagues" and "How to Play" CTAs are present and navigate correctly.
   - The Login button is accessible via the nav header (Story 2 above).

## 5. Security checks

- Confirm passwords are not visible in network request payloads sent to the backend (use browser DevTools → Network).
- Confirm registration response does not include the `passwordHash` field.
- Confirm the backend stores a bcrypt hash (not the plain-text password) by inspecting `dataStore.users` in a debugger or a test assertion.

## 6. Accessibility checks

1. Use keyboard-only navigation (Tab, Shift+Tab, Enter) to:
   - Reach and activate the **Register** and **Login** buttons in the nav.
   - Tab through all form fields on `RegisterPage` and submit via Enter.
   - Reach and activate the **Logout** button when authenticated.
2. Confirm all interactive elements have visible focus rings.
3. Verify text and button contrast meets WCAG AA targets (4.5:1 for normal text, 3:1 for large text and UI components).

## 7. Definition of done for this feature slice

- All acceptance scenarios in the feature specification pass.
- `POST /api/auth/register` returns 201 on success, 409 on duplicate email, 400 on validation errors.
- Seed user passwords in `dataStore.js` are bcrypt hashes; the existing `loginAsAlex` test helper works without modification.
- Frontend test suite passes with repository-wide coverage ≥ 80%.
- `RegisterPage`, `MainNav`, and `HomePage` tests cover the new or changed behaviour.
- Constitution gates remain satisfied in implementation and review.

## 8. Final validation checklist

- [ ] `/register` renders the registration form for unauthenticated visitors.
- [ ] `/register` redirects authenticated users to `/leagues`.
- [ ] Successful registration logs the user in and redirects to `/leagues`.
- [ ] Duplicate email submission shows the expected error message.
- [ ] Per-field validation errors appear before submission for blank, too-short, or malformed inputs.
- [ ] The login page includes a "Create an account" link pointing to `/register`.
- [ ] Nav header shows Register + Login buttons (no Login NavLink in primary links) when unauthenticated.
- [ ] Nav header shows display name + Logout when authenticated.
- [ ] Logout redirects to `/` and clears auth state.
- [ ] Landing page hero contains no Login CTA; Browse Leagues and How to Play are present.
- [ ] All new interactive elements are keyboard-reachable with visible focus indicators.
- [ ] Backend stores bcrypt hashes, never plain-text passwords.
