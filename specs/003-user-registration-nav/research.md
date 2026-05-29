# Research: User Registration & Auth Nav Redesign

## Decision 1: Use bcryptjs for password hashing
- **Decision**: Add `bcryptjs` as a backend production dependency. Use `bcrypt.hash()` at registration and `bcrypt.compare()` at login. Migrate existing seed user `passwordHash` fields in `dataStore.js` from plain text to pre-computed bcrypt hashes so the full login path uses one consistent comparison strategy.
- **Rationale**: NFR-003 mandates passwords MUST NOT be stored or transmitted in plain text. `bcryptjs` is a pure-JavaScript implementation requiring no native build tooling, is the most widely adopted bcrypt library for Node.js, and exposes a simple async API consistent with the existing Express handler patterns. Migrating the seed users eliminates a dual-path plain-text/hash fallback in `authService.login` that would otherwise introduce latent complexity and a security inconsistency.
- **Alternatives considered**:
  - Node.js built-in `crypto.scryptSync`: No new dependency, but requires manual salt generation, buffer handling, and careful timing-safe comparison — more error-prone boilerplate without meaningful advantage in this context.
  - Leave seed users in plain text and add a dual-comparison path in login: Rejected — creates two code paths for the same operation, a security regression for existing seed accounts, and a confusing precedent.
  - `argon2`: More memory-hard but requires native bindings, harder to install consistently across developer environments. Overkill for a bootcamp project.

## Decision 2: Registration endpoint returns the same response shape as login (auto-login via 201)
- **Decision**: `POST /api/auth/register` creates a user record, calls the existing `createSession()` utility, and returns `{ success: true, data: { isAuthenticated: true, user, sessionId } }` with HTTP 201. Duplicate-email conflicts return 409. Missing/invalid field errors return 400.
- **Rationale**: FR-006 requires auto-login after registration. Reusing the same response shape and session-creation mechanism means the frontend `AuthContext.register()` method applies the identical state-update logic as `login()`, minimising new surface area and keeping the session contract consistent. HTTP 201 is semantically correct for resource creation.
- **Alternatives considered**:
  - Return 200 instead of 201: 200 is semantically ambiguous for a creation operation. No functional difference in the SPA, but 201 communicates intent and aligns with REST conventions in the existing contracts.
  - Return a user record only (no session) and require a separate login call: Rejected — contradicts FR-006 (auto-login) and adds an unnecessary extra round-trip on the success path.

## Decision 3: Add register() to AuthContext mirroring the login() pattern
- **Decision**: Add a `register` function to `AuthProvider` that calls the new `register` API service function, stores the returned session ID in `localStorage`, sets the Authorization token via `setSessionToken`, and updates `isAuthenticated` and `user` state — identical steps to `login()`.
- **Rationale**: Consistency with the existing context pattern keeps `RegisterPage` symmetric to `LoginPage`. Exposing `register` from `useAuth()` means the page component stays thin and session state management is owned by the context, consistent with the current architecture.
- **Alternatives considered**:
  - Have `RegisterPage` call the auth API service directly then invoke a post-registration state update: Bypasses the context's session management; creates a two-step sequence that can race or diverge.
  - Expose a single `authenticate(type, credentials)` function for both login and register: Premature abstraction for two endpoints with different validation rules — rejected.

## Decision 4: Nav auth section replaces "Signed out" text with Login + Register buttons; Login NavLink removed from primary nav
- **Decision**: In `MainNav.js`, replace `<span>Signed out</span>` in the `auth-chip` div with `<NavLink>` to `/register` (styled as a button) and `<NavLink>` to `/login` (styled as a button) when unauthenticated. Remove the standalone `Login` `<NavLink>` from the primary nav links since it moves to the auth section. The `auth-chip` div retains `aria-live="polite"`.
- **Rationale**: FR-008–FR-010 require a dedicated right-side auth section. The existing `auth-chip` div already occupies the correct layout slot. Removing the `Login` NavLink from the primary links reduces redundancy and matches the spec input ("Move the registration and login buttons… into their own separate section").
- **Alternatives considered**:
  - Keep Login in both the primary nav links and the auth section: Creates duplicate navigation targets, contradicts the spec intent of "moving" the button, and clutters the nav.
  - Add a new top-level nav element alongside `auth-chip`: The existing `auth-chip` div already satisfies the layout need; introducing a new element is unnecessary.

## Decision 5: Client-side validation uses HTML5 + explicit JavaScript checks (no validation library)
- **Decision**: Use `type="email"` input for browser-assisted format feedback and explicit `if` checks in the submit handler for non-empty, min/max length, and minimum password length. Display per-field errors using a `<p className="field-error">` element below each input and the existing `FeedbackBanner` for server-returned errors.
- **Rationale**: NFR-004 requires inline, field-associated errors. Three fields with simple rules do not warrant a form library. The existing `LoginPage` uses this same pattern for the simpler two-field case.
- **Alternatives considered**:
  - `react-hook-form` or `formik`: Adds a dependency and abstraction layer for three fields — rejected as over-engineering.
  - Rely solely on browser native HTML5 validation UI: Inconsistent cross-browser styling and does not meet NFR-004's inline-associated-error requirement.

## Decision 6: Already-authenticated guard handled inline in RegisterPage (no shared route wrapper)
- **Decision**: In `RegisterPage`, check `useAuth().isAuthenticated` and render `<Navigate to={ROUTES.leagues} replace />` if true. No reusable `PublicOnlyRoute` wrapper is introduced.
- **Rationale**: FR-013 requires the redirect. The codebase does not have an existing route-guard pattern, and adding one for a single page introduces more structural surface area than the simple inline check. Consistent with the existing approach (the existing `LoginPage` does not currently guard against authenticated access either — that can be addressed in a future clean-up).
- **Alternatives considered**:
  - Shared `PublicOnlyRoute` wrapping both `LoginPage` and `RegisterPage`: Desirable future refactor but out of scope for this feature.
  - Guard in `App.js` route definition without a wrapper component: Less explicit and harder to test in isolation than a component-level check.
