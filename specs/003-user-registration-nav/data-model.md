# Data Model: User Registration & Auth Nav Redesign

## Entities

### User (extended)
- **Purpose**: Represents a registered user account. Existing entity in `dataStore.js`; extended to support new user creation via the registration flow.
- **Fields**:
  - `id` (string, required, unique, generated via `nextId('user')`)
  - `email` (string, required, unique, lower-case normalised for comparison)
  - `displayName` (string, required, 2–20 characters)
  - `passwordHash` (string, required, bcrypt hash — never plain text)
  - `createdAt` (datetime, ISO-8601, set at registration time)
- **Validation rules**:
  - `email`: non-empty, valid email format (basic RFC 5321 pattern), unique across all users (case-insensitive)
  - `displayName`: non-empty, 2–20 characters
  - `password` (input only, never stored): minimum 8 characters
  - `passwordHash`: stored value is always a bcrypt hash string; plain text is never written to the store
- **Notes**:
  - Existing seed users in `dataStore.js` have their `passwordHash` field migrated from plain text to pre-computed bcrypt hashes as part of this feature so that `authService.login` uses a single consistent `bcrypt.compare()` path.

---

### Session (unchanged)
- **Purpose**: Represents an active authenticated session. Created on both successful login and successful registration (auto-login).
- **Fields**:
  - `sessionId` (string, required, unique, generated via `nextId('session')`)
  - `userId` (string, required, foreign key → User.id)
  - `createdAt` (datetime, ISO-8601)
  - `expiresAt` (datetime, ISO-8601, 12 hours from creation)
  - `revokedAt` (datetime or null; set on logout)
- **Validation rules**: unchanged from current implementation.
- **State transitions**: created → active → (expired or revoked via logout)

---

### RegistrationForm (frontend form data model)
- **Purpose**: Represents the controlled-input form data on the `RegisterPage` component.
- **Fields**:
  - `displayName` (string, controlled input)
  - `email` (string, controlled input)
  - `password` (string, controlled input)
- **Client-side validation** (evaluated before submission):
  - All three fields are non-empty
  - `email`: valid email format (`type="email"` + explicit check)
  - `displayName`: 2–20 characters
  - `password`: minimum 8 characters
- **Error display**:
  - Per-field inline errors using `<p className="field-error">` or similar, associated to their respective field
  - Server-returned errors (duplicate email, backend failure) displayed via `FeedbackBanner`

---

### NavAuthSection (frontend component model)
- **Purpose**: The right-side auth region of `MainNav`. Renders contextually based on authentication state.
- **States**:
  - **Unauthenticated**: displays a "Register" `<NavLink>` (→ `/register`) and a "Login" `<NavLink>` (→ `/login`), both styled as buttons
  - **Authenticated**: displays the user's display name and a "Logout" `<button>`
- **Props / context values** (from `useAuth()`):
  - `isAuthenticated` (boolean)
  - `user` (object: `{ displayName, email }`)
  - `logout` (function)
- **Accessibility**:
  - Container retains `aria-live="polite"` for dynamic content transitions
  - All interactive elements are keyboard-focusable with visible focus rings
  - Text and button contrast meets WCAG AA requirements
  - No Login or Register controls appear when authenticated; no Logout or display name when unauthenticated

---

## Relationships

- `RegistrationForm` → (on valid submit) → creates `User` record and `Session` record on the backend
- `User` 1..* `Session` (a user may accumulate multiple sessions; registration creates one)
- `NavAuthSection` ← `AuthContext` (reads `isAuthenticated` and `user` state reactively)
- `NavAuthSection` → (Register button) → navigates to `RegisterPage`
- `NavAuthSection` → (Login button) → navigates to `LoginPage`
- `NavAuthSection` → (Logout button) → calls `AuthContext.logout()` → clears session → navigates to `/`

---

## State Transitions

### Registration Flow

```
Unauthenticated visitor
  → visits /register
  → fills RegistrationForm (displayName, email, password)
  → submits
    [client validation fails] → per-field inline errors shown; form not submitted
    [client validation passes] → POST /api/auth/register
      [success 201]          → User + Session created → AuthContext state updated → navigate to /leagues
      [duplicate email 409]  → FeedbackBanner error: "An account with this email already exists."
      [validation error 400] → FeedbackBanner error from server message
      [server error 5xx]     → FeedbackBanner: user-friendly message, no technical detail exposed
```

### NavAuthSection Transitions

```
App load (unauthenticated):
  auth-chip → [Register button] [Login button]

After login or registration:
  auth-chip → [displayName] [Logout button]

After logout:
  auth-chip → [Register button] [Login button]
  + navigate to /
```
