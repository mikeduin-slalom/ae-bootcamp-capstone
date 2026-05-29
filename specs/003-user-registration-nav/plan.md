# Implementation Plan: User Registration & Auth Nav Redesign

**Branch**: `003-user-registration-nav` | **Date**: 2026-05-29 | **Spec**: `specs/003-user-registration-nav/spec.md`

**Input**: Feature specification from `specs/003-user-registration-nav/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add user registration to the application (currently login-only) by implementing a `POST /api/auth/register` endpoint on the backend and a new `RegisterPage` on the frontend. Redesign the main navigation header to consolidate auth controls (Register + Login buttons when unauthenticated, display name + Logout when authenticated) into a dedicated right-side auth section, replacing the current "Signed out" plain text. Remove the Login CTA from the landing page hero, leaving only Browse Leagues and How to Play. Password hashing uses `bcryptjs` on the backend; the registration auto-login flow reuses the existing session mechanism.

## Technical Context

**Language/Version**: JavaScript (React 18 frontend, Node.js 18+ backend)

**Primary Dependencies**: Express, react-router-dom, Jest + supertest (backend), Jest + React Testing Library (frontend); `bcryptjs` added to backend as a production dependency for password hashing

**Storage**: In-memory arrays and Map in `packages/backend/src/services/dataStore.js` (no external database)

**Testing**: Backend — Jest + supertest (`packages/backend`); Frontend — Jest + React Testing Library via react-scripts test (`packages/frontend`)

**Target Platform**: Web (SPA + Node.js Express API, npm workspace monorepo)

**Project Type**: Web application (monorepo with `packages/frontend` and `packages/backend`)

**Performance Goals**: Registration form submit + response within a timeframe comparable to login latency (NFR-001)

**Constraints**: Passwords MUST be hashed before storage (NFR-003); registration form and nav auth section MUST be keyboard-navigable with WCAG AA contrast (NFR-002); styling consistent with existing design system using `stacked-form`, `page-card`, and existing button/nav patterns (NFR-005)

**Scale/Scope**: One new backend endpoint, one new frontend page (`RegisterPage`), one redesigned component (`MainNav`), two modified pages (`HomePage`, `LoginPage`), constants and context updates, one new frontend service call

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery**: PASS. All changes trace directly to FR-001–FR-015, NFR-001–NFR-005, and user stories US1–US3 with explicit acceptance scenarios.
- **Frontend/Backend Boundaries**: PASS. Frontend consumes the new `POST /api/auth/register` endpoint exclusively through `packages/frontend/src/services/authService.js`. Backend internals remain unexposed to the frontend.
- **Test Discipline**: PASS. Strategy defined — backend: unit tests for `authService.register`, integration tests for the new endpoint covering success, duplicate email, and validation errors; frontend: component tests for `RegisterPage` (validation, success, duplicate-email error), `MainNav` (unauthenticated/authenticated states), `HomePage` (no login CTA). Coverage must remain ≥ 80% repository-wide.
- **Reliability and Transparency**: PASS. Failure modes documented — duplicate email (409), validation errors (400), backend unavailable (user-facing error banner). Audit log events defined for registration success and failure. No technical details exposed to users.
- **Simplicity and Maintainability**: PASS. Reuses existing session mechanism, existing form styling (`stacked-form`, `page-card`), and existing service/context patterns. `bcryptjs` is the only new dependency. No speculative abstractions introduced.

## Project Structure

### Documentation (this feature)

```text
specs/003-user-registration-nav/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── user-registration.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js                          # + POST /api/auth/register route
│   │   └── services/
│   │       ├── authService.js              # + register(); bcryptjs for hash + compare
│   │       └── dataStore.js               # seed user passwordHash fields migrated to bcrypt hashes
│   └── __tests__/
│       └── app.test.js                    # + registration endpoint integration tests
└── frontend/
    └── src/
        ├── App.js                          # + RegisterPage route at /register
        ├── components/
        │   └── MainNav.js                 # redesigned auth section: Login/Register buttons or displayName/Logout
        ├── constants/
        │   └── routes.js                  # + register: '/register'
        ├── context/
        │   └── AuthContext.js             # + register() method mirroring login()
        ├── pages/
        │   ├── HomePage.js                # login CTA removed from hero
        │   ├── LoginPage.js               # + "Create an account" link to /register
        │   └── RegisterPage.js            # NEW: registration form (displayName, email, password)
        ├── services/
        │   └── authService.js             # + register() API call to POST /api/auth/register
        └── __tests__/
            ├── RegisterPage.test.js       # NEW: validation, success, duplicate-email error
            ├── MainNav.test.js            # + unauthenticated auth section assertions
            └── HomePage.test.js          # + no login CTA assertion
```

**Structure Decision**: Existing web-application monorepo layout (`packages/frontend` + `packages/backend`). New `RegisterPage` follows the same structure and patterns as the existing `LoginPage`. Registration logic in `authService.js` alongside `login`. No new packages or build changes beyond adding `bcryptjs` as a backend production dependency.
