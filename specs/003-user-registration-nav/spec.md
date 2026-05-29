# Feature Specification: User Registration & Auth Nav Redesign

**Feature Branch**: `003-user-registration-nav`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Add a User Registration flow (we currently only have a login flow, so users cannot register and thus not login). Move the registration and login buttons, along with the 'Signed out' text, into their own separate section on the right side of the main menu, which is modern and attractive looking. Remove the login button from the primary landing page CTAs and leave only the version in the header."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registers for an Account (Priority: P1)

A first-time visitor to the site wants to create an account so they can join leagues. They navigate to the registration page (either via the header or a link from the login page), fill in their display name, email address, and password, and are redirected to the leagues page upon success.

**Why this priority**: Without user registration, no new users can ever log in. This is a prerequisite to all authenticated features and is the most critical gap.

**Independent Test**: Navigate to `/register`, submit valid credentials, and verify the user is logged in and redirected to leagues. Delivers full account creation value independently.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they submit the registration form with a unique email, valid display name, and a password meeting minimum requirements, **Then** the system creates an account, logs the user in automatically, and redirects them to the leagues page.
2. **Given** an unauthenticated visitor, **When** they submit the registration form with an email address already associated with an existing account, **Then** the system displays a clear error message indicating the email is already in use, and the form is not submitted.
3. **Given** an unauthenticated visitor, **When** they submit the registration form with missing or invalid fields (e.g., empty email, password too short), **Then** the system shows inline validation feedback identifying each issue before submission.
4. **Given** an unauthenticated visitor, **When** they are on the login page, **Then** they see a visible link to the registration page ("Create an account" or equivalent).

---

### User Story 2 - Auth Controls Consolidated in Header (Priority: P2)

An unauthenticated visitor sees clear "Login" and "Register" buttons in a dedicated right-side section of the main navigation header. An authenticated user sees their display name and a "Logout" button in the same section. The "Signed out" status text is replaced by these action buttons.

**Why this priority**: The header auth section is the primary discovery point for authentication across all pages. It must work correctly after registration is available. Improves usability and visual hierarchy.

**Independent Test**: Visit any page as an unauthenticated user and confirm "Login" and "Register" buttons are present in the right side of the nav. Delivers the nav redesign independently.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user on any page, **When** they view the main navigation header, **Then** they see a dedicated right-side section containing a "Register" button and a "Login" button (no longer showing plain "Signed out" text alone).
2. **Given** an authenticated user on any page, **When** they view the main navigation header, **Then** the right-side auth section shows their display name and a "Logout" button (no Login or Register buttons visible).
3. **Given** an unauthenticated user, **When** they click the "Register" button in the header, **Then** they are navigated to the registration page.
4. **Given** an unauthenticated user, **When** they click the "Login" button in the header, **Then** they are navigated to the login page.
5. **Given** an authenticated user, **When** they click the "Logout" button in the header, **Then** their session is ended and they are redirected to the home/landing page (`/`).
6. **Given** the header is viewed at various screen widths, **When** the auth section is rendered, **Then** it remains visually distinct and does not overlap or collapse into the main nav links.

---

### User Story 3 - Login CTA Removed from Landing Page (Priority: P3)

The landing page hero section no longer shows a "Login" call-to-action button. The remaining CTAs are "Browse Leagues" and "How to Play". Users discover the login and register actions through the header navigation.

**Why this priority**: Declutters the landing page and reinforces the header as the canonical place for auth actions. Lower priority because it does not block any workflow.

**Independent Test**: Navigate to the home page and confirm no "Login" CTA button exists in the hero section. The remaining CTAs still function.

**Acceptance Scenarios**:

1. **Given** any visitor on the home page, **When** the landing hero section renders, **Then** no "Login" button appears among the landing page CTAs.
2. **Given** any visitor on the home page, **When** the landing hero section renders, **Then** "Browse Leagues" and "How to Play" CTAs are still present and functional.
3. **Given** a visitor who arrived at the home page and wants to log in, **When** they look at the main navigation header, **Then** the "Login" button is visible there.

---

### Edge Cases

- What happens when a user attempts to register while already authenticated? (Redirect to leagues or home with an informational message.)
- What happens when the registration backend is unavailable? (Display a user-friendly error; do not expose technical details.)
- What happens if two concurrent requests try to register the same email simultaneously? (System must reject the duplicate and return the appropriate error.)
- How does the header auth section behave on mobile/small screens where the nav may collapse? (Auth section remains accessible.)
- What happens if a user navigates directly to `/register` while already logged in? (Redirect to a sensible destination, not an error.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a registration page accessible at a dedicated route (e.g., `/register`).
- **FR-002**: The registration form MUST collect: display name, email address, and password.
- **FR-003**: The system MUST validate that all registration fields are present and non-empty before submission. Passwords MUST be at least 8 characters long; no other character-type constraints are required. Display names MUST be between 2 and 20 characters.
- **FR-004**: The system MUST validate that the submitted email follows a valid email format.
- **FR-005**: The system MUST reject registration if the submitted email is already associated with an existing account, and display a clear, user-facing error.
- **FR-006**: Upon successful registration, the system MUST automatically log the new user in (no email verification step) and redirect them to the leagues page.
- **FR-007**: The login page MUST include a visible link to the registration page.
- **FR-008**: The main navigation header MUST contain a dedicated right-side auth section that is visually separate from the primary navigation links.
- **FR-009**: When the user is unauthenticated, the auth section MUST display a "Register" button and a "Login" button (replacing the current "Signed out" text).
- **FR-010**: When the user is authenticated, the auth section MUST display the user's display name and a "Logout" button (no Register or Login buttons).
- **FR-011**: The landing page hero section MUST NOT include a "Login" CTA button.
- **FR-012**: The landing page "Browse Leagues" and "How to Play" CTAs MUST remain present and functional after the Login CTA is removed.
- **FR-013**: Navigating to the registration page while already authenticated MUST redirect the user away from the registration page (to leagues or home) rather than showing the form.
- **FR-014**: The backend MUST expose a registration endpoint that accepts display name, email, and password, creates a user record, and returns a session using the same session-creation mechanism as the existing login flow (same token format and transport).
- **FR-015**: Upon successful logout, the system MUST redirect the user to the home/landing page (`/`).

### Non-Functional Requirements

- **NFR-001 (Performance)**: The registration form MUST submit and receive a response within a timeframe consistent with normal page interactions (comparable to login).
- **NFR-002 (Accessibility)**: The registration form and the new nav auth section MUST be keyboard-navigable and have sufficient color contrast for readability.
- **NFR-003 (Security)**: Passwords MUST NOT be stored or transmitted in plain text; the system MUST handle password storage securely.
- **NFR-004 (Usability)**: Validation errors on the registration form MUST be displayed inline and be clearly associated with their respective fields.
- **NFR-005 (Consistency)**: The new auth section in the nav MUST be visually consistent with the existing design language (colors, typography, spacing).

### Key Entities

- **User**: Represents a registered account. Key attributes: id, email, displayName (2–20 characters), passwordHash, createdAt.
- **Session**: Represents an active authenticated session. Created on successful registration (auto-login) or login. Key attributes: sessionId, userId, createdAt, expiresAt, revokedAt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new visitor can complete account registration and arrive at the leagues page in under 2 minutes from first landing on the registration page.
- **SC-002**: 100% of pages in the application reflect the updated navigation header with the dedicated auth section for both authenticated and unauthenticated states.
- **SC-003**: The landing page hero section contains zero login-specific CTAs; all authentication entry points are accessible exclusively through the navigation header.
- **SC-004**: Attempting to register with an already-used email produces an error message visible to the user within one interaction cycle (no silent failures).
- **SC-005**: The registration and login navigation buttons in the header are reachable via keyboard alone without assistive technology workarounds.

## Assumptions

- The existing login flow (email + password) remains unchanged; registration mirrors its credential model and reuses the same session-creation mechanism (same token format and transport).
- Password minimum length is 8 characters; no character-type complexity requirements are enforced.
- Email uniqueness is enforced per the existing data model (one User per email).
- The registration page reuses the existing form styling (`stacked-form`, `page-card`) for visual consistency.
- Mobile/responsive breakpoint behavior for the nav auth section follows whatever responsive strategy is established by the existing `main-nav-shell` layout.
- Auto-login after registration does not require a separate email verification step (none is mentioned in the functional requirements).
- The "modern and attractive" styling for the auth section means visually distinct from plain text links — using buttons with clear affordance — while remaining consistent with the existing design system rather than introducing a new design language.
- The existing backend data store (in-memory) is acceptable for storing the new user registrations (no database migration required for this feature).

## Clarifications

### Session 2026-05-29

- Q: Does the registration flow require email verification before the user is auto-logged in and redirected? → A: No email verification required — auto-login immediately after registration.
- Q: What are the password validation rules for the registration form? → A: Minimum 8 characters, no other constraints.
- Q: What happens to the session/token when a user registers and is auto-logged in — same mechanism as existing login? → A: Reuse the existing session-creation mechanism (same token format and transport).
- Q: Where should a user be redirected after a successful logout? → A: Home/landing page (`/`).
- Q: Should the "display name" field have any length or character constraints? → A: Non-empty, 2–20 characters.
