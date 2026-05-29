---

description: "Task list template for feature implementation"
---

# Tasks: User Registration & Auth Nav Redesign

**Input**: Design documents from `specs/003-user-registration-nav/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Test tasks included per constitution requirement for all meaningful behavior changes.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths follow monorepo layout: `packages/backend/` and `packages/frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install the one new dependency and add the shared route constant needed across user stories.

- [X] T001 Install `bcryptjs` as a production dependency in `packages/backend/package.json` (run `npm install bcryptjs --workspace=packages/backend`)
- [X] T002 [P] Add `register: '/register'` constant to `packages/frontend/src/constants/routes.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migrate existing seed users to bcrypt password hashes so the unified `bcrypt.compare()` path in `authService.login` is consistent across all users. This MUST complete before any backend test or US1 implementation work begins.

**⚠️ CRITICAL**: Backend US1 work cannot proceed until this phase is complete.

- [X] T003 Migrate seed user `passwordHash` fields from plain text to pre-computed bcrypt hashes in `packages/backend/src/services/dataStore.js`

**Checkpoint**: Bcrypt seed migration complete — US1 backend implementation can now begin.

---

## Phase 3: User Story 1 — New User Registers for an Account (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor fills in display name, email, and password at `/register`, is automatically logged in upon success, and is redirected to the leagues page.

**Independent Test**: Navigate to `/register`, submit valid credentials (unique email, displayName 2–20 chars, password ≥ 8 chars), and verify the user is logged in and redirected to `/leagues`.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Add registration integration tests to `packages/backend/__tests__/app.test.js` covering: success (201 with session response shape), duplicate email (409), missing field (400), password too short (400), displayName out of range (400)
- [X] T005 [P] [US1] Create `packages/frontend/src/__tests__/RegisterPage.test.js` covering: valid form submission triggers register() and redirects to `/leagues`; duplicate email server error renders FeedbackBanner; blank field shows per-field inline error before submit; short password shows per-field inline error before submit; authenticated user is redirected to `/leagues` without seeing the form

### Implementation for User Story 1

- [X] T006 [P] [US1] Add `register(displayName, email, password)` function to `packages/backend/src/services/authService.js`: validate inputs, check email uniqueness (409 on duplicate), hash password with `bcrypt.hash()`, create user record in `dataStore`, create session via existing `createSession()` utility, return session response shape matching login
- [X] T007 [US1] Add `POST /api/auth/register` route to `packages/backend/src/app.js` calling `authService.register()` and returning 201 on success, 409 on duplicate email, 400 on validation error (depends on T006)
- [X] T008 [P] [US1] Add `register(displayName, email, password)` API call function to `packages/frontend/src/services/authService.js` posting to `POST /api/auth/register` and returning the parsed response
- [X] T009 [US1] Add `register()` method to `packages/frontend/src/context/AuthContext.js` mirroring the `login()` pattern: call `authService.register()`, store session ID in `localStorage`, call `setSessionToken()`, update `isAuthenticated` and `user` state (depends on T008)
- [X] T010 [US1] Create `packages/frontend/src/pages/RegisterPage.js`: controlled form with displayName, email, and password fields; client-side validation (non-empty, email format, displayName 2–20 chars, password ≥ 8 chars); per-field `<p className="field-error">` inline errors; FeedbackBanner for server errors (duplicate email, backend failure); on success call `useAuth().register()` and navigate to `ROUTES.leagues`; authenticated-user guard renders `<Navigate to={ROUTES.leagues} replace />` (depends on T009)
- [X] T011 [US1] Add `/register` route for `<RegisterPage>` to `packages/frontend/src/App.js` (depends on T010)
- [X] T012 [P] [US1] Add "Create an account" link pointing to `ROUTES.register` on `packages/frontend/src/pages/LoginPage.js`

**Checkpoint**: US1 fully functional — new visitor can register, auto-login, and reach leagues. Backend and RegisterPage test suites pass.

---

## Phase 4: User Story 2 — Auth Controls Consolidated in Header (Priority: P2)

**Goal**: The main nav header's `auth-chip` section shows "Register" + "Login" NavLinks when unauthenticated, and displayName + "Logout" button when authenticated. The standalone Login NavLink is removed from the primary nav links.

**Independent Test**: Visit any page as an unauthenticated user and confirm "Login" and "Register" buttons appear in the right side of the nav header; the primary nav links contain no Login entry.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US2] Update `packages/frontend/src/__tests__/MainNav.test.js` with assertions for: unauthenticated state renders Register button (href `/register`) and Login button (href `/login`) in auth section, no "Signed out" text, no Login entry in primary nav links; authenticated state renders user displayName and Logout button, no Register or Login buttons; Logout button calls `logout()` and navigates to `/`

### Implementation for User Story 2

- [X] T014 [US2] Redesign `packages/frontend/src/components/MainNav.js`: in the `auth-chip` div replace the `<span>Signed out</span>` with conditional rendering — unauthenticated: `<NavLink>` to `/register` + `<NavLink>` to `/login` both styled as buttons; authenticated: user `displayName` text + `<button>` calling `logout()`; remove the standalone Login `<NavLink>` from the primary nav links; retain `aria-live="polite"` on the auth section container (depends on T013)

**Checkpoint**: US2 fully functional — nav header shows correct auth controls on all pages for both states. MainNav tests pass.

---

## Phase 5: User Story 3 — Login CTA Removed from Landing Page (Priority: P3)

**Goal**: The landing page hero section no longer contains a Login CTA button. "Browse Leagues" and "How to Play" CTAs remain present and functional.

**Independent Test**: Navigate to the home page and confirm no "Login" button appears in the hero section; "Browse Leagues" and "How to Play" CTAs render and function correctly.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US3] Update `packages/frontend/src/__tests__/HomePage.test.js` with assertions that: no element with a Login CTA label is rendered in the hero section; "Browse Leagues" CTA is present; "How to Play" CTA is present

### Implementation for User Story 3

- [X] T016 [US3] Remove the Login CTA button from the hero section in `packages/frontend/src/pages/HomePage.js`, leaving "Browse Leagues" and "How to Play" CTAs intact (depends on T015)

**Checkpoint**: US3 fully functional — landing page hero shows no Login CTA; remaining CTAs work. HomePage tests pass.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final security, accessibility, and test coverage verification across all stories.

- [X] T017 [P] Run full test suite across both packages and confirm repository-wide coverage ≥ 80% (`npm test` from repo root)
- [X] T018 [P] Verify registration API response does not include the `passwordHash` field and that `dataStore.users` stores a bcrypt hash string (not plain text) — add or confirm assertion in `packages/backend/__tests__/app.test.js`
- [ ] T019 [P] Verify keyboard-only navigation (Tab, Shift+Tab, Enter) reaches and activates: Register button in nav, Login button in nav, all three RegisterPage form fields, form submit, and Logout button when authenticated — per NFR-002 and quickstart.md §6
- [ ] T020 Run quickstart.md manual validation scenarios (§4–§8) against the running application (`npm run start`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001 `bcryptjs` installed) — BLOCKS backend US1 work
- **US1 (Phase 3)**: Depends on Phase 2 complete; frontend side also needs T002 (routes constant) from Phase 1
- **US2 (Phase 4)**: Depends on Phase 1 (T002 routes constant for Register NavLink); does NOT depend on US1
- **US3 (Phase 5)**: Depends on Phase 1 complete; does NOT depend on US1 or US2
- **Polish (Phase 6)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Requires Phase 2 (bcrypt seed migration). Backend and frontend workstreams are independent of each other after Phase 2 and T002.
- **US2 (P2)**: Requires only T002 (routes constant). Fully independent of US1 — can proceed in parallel with US1 if team capacity allows.
- **US3 (P3)**: No dependencies beyond Phase 1. Fully independent of US1 and US2.

### Within US1

- T006 (backend service) must complete before T007 (backend route)
- T008 (frontend service) → T009 (AuthContext) → T010 (RegisterPage) → T011 (App.js route)
- T012 (LoginPage link) can run in parallel with T009–T011

### Parallel Opportunities

**Phase 1**: T001 and T002 run in parallel

**Phase 3 (US1)**:
- T004 and T005 run in parallel (different test files)
- T006 and T008 run in parallel (backend vs frontend service — different packages)
- T012 runs in parallel with T010 and T011 (different file, no shared dependency)
- The full backend workstream (T004 → T006 → T007) and full frontend workstream (T005 → T008 → T009 → T010 → T011, T012) can run in parallel after Phase 2

**Cross-story parallelism** (if staffed):
- US2 (T013 → T014) can run alongside Phase 3 work after Phase 1 is done
- US3 (T015 → T016) can run alongside Phase 3 and Phase 4 work after Phase 1 is done

**Polish**: T017, T018, and T019 run in parallel; T020 follows after T017 passes

---
