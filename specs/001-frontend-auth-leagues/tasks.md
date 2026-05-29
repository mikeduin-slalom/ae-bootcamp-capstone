# Tasks: Frontend Auth and League Access

**Input**: Design documents from `/specs/001-frontend-auth-leagues/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include test tasks for each user story. Test work is REQUIRED by the constitution for meaningful behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend code and tests: `packages/frontend/src/`
- Backend code and tests: `packages/backend/src/`, `packages/backend/__tests__/`
- Feature docs/contracts: `specs/001-frontend-auth-leagues/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align workspace scripts and base modules for auth/leagues/how-to-play feature development.

- [X] T001 Add shared frontend dependencies (`react-router-dom`, `axios`) in `packages/frontend/package.json`
- [X] T002 Add backend test dependency (`supertest`) in `packages/backend/package.json`
- [X] T003 [P] Create frontend API client bootstrap in `packages/frontend/src/services/apiClient.js`
- [X] T004 [P] Create frontend app route constants in `packages/frontend/src/constants/routes.js`
- [X] T005 [P] Create backend in-memory data seed module for users/leagues/invitations/how-to-play in `packages/backend/src/services/dataStore.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement cross-story auth/session, routing shell, error envelopes, and observability foundations.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Implement backend auth/session service (login, session lookup, logout) in `packages/backend/src/services/authService.js`
- [X] T007 [P] Implement backend league access service (joinable join, invitation accept, request-to-join) in `packages/backend/src/services/leagueAccessService.js`
- [X] T008 [P] Implement backend structured audit logging helper for auth/join events in `packages/backend/src/services/auditLogService.js`
- [X] T009 Implement backend feature API routes and validation wrappers for contract endpoints in `packages/backend/src/app.js`
- [X] T010 [P] Add backend contract-shape and auth guard tests for foundational endpoints in `packages/backend/__tests__/app.test.js`
- [X] T011 Implement frontend auth/session context provider in `packages/frontend/src/context/AuthContext.js`
- [X] T012 [P] Implement frontend app router shell and persistent navigation scaffold in `packages/frontend/src/App.js`
- [X] T013 [P] Add shared frontend error/feedback banner component in `packages/frontend/src/components/FeedbackBanner.js`
- [X] T014 Add base frontend route + auth context wiring tests in `packages/frontend/src/__tests__/App.test.js`

**Checkpoint**: Foundation ready. User story implementation can proceed.

---

## Phase 3: User Story 1 - Access Platform Entry Points (Priority: P1) 🎯 MVP

**Goal**: Users can land on homepage and navigate to Login, Leagues, and How to Play from persistent navigation.

**Independent Test**: As a signed-out user, load home and navigate in one click to Login, Leagues, and How to Play with correct page rendering.

### Tests for User Story 1

- [X] T015 [P] [US1] Add homepage navigation behavior tests in `packages/frontend/src/__tests__/HomePage.test.js`
- [X] T016 [P] [US1] Add backend smoke test for public homepage-supporting endpoints (`/api/auth/session`, `/api/content/how-to-play`) in `packages/backend/__tests__/app.test.js`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement homepage page component with orientation copy and primary actions in `packages/frontend/src/pages/HomePage.js`
- [X] T018 [P] [US1] Implement shared persistent navigation component in `packages/frontend/src/components/MainNav.js`
- [X] T019 [US1] Wire homepage and navigation routes into app shell in `packages/frontend/src/App.js`
- [X] T020 [US1] Add homepage and navigation styling with keyboard focus states in `packages/frontend/src/App.css`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Sign In Securely (Priority: P1)

**Goal**: Users can log in via email/password, receive clear error feedback, and see signed-in UI state across session.

**Independent Test**: Submit valid and invalid credentials; verify redirect/feedback and persistent signed-in indicator on reload with active session.

### Tests for User Story 2

- [X] T021 [P] [US2] Add backend auth endpoint tests for valid, invalid, and blank credentials in `packages/backend/__tests__/app.test.js`
- [X] T022 [P] [US2] Add frontend login UX tests for success/failure and signed-in indicator in `packages/frontend/src/__tests__/LoginPage.test.js`

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement login page form with validation and submission states in `packages/frontend/src/pages/LoginPage.js`
- [X] T024 [P] [US2] Implement frontend auth service API wrappers (`login`, `session`, `logout`) in `packages/frontend/src/services/authService.js`
- [X] T025 [US2] Integrate login workflow and session hydration into auth context in `packages/frontend/src/context/AuthContext.js`
- [X] T026 [US2] Add backend login/session/logout route handlers and error mapping in `packages/backend/src/app.js`
- [X] T027 [US2] Reflect signed-in state and logout action in persistent navigation component in `packages/frontend/src/components/MainNav.js`

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Discover and Join Leagues (Priority: P2)

**Goal**: Users can browse league types while signed out and authenticated users can join joinable leagues or use private invitation/request flows.

**Independent Test**: Verify signed-out read-only league list and signed-in join workflows for joinable and private leagues including invalid/pending feedback states.

### Tests for User Story 3

- [X] T028 [P] [US3] Add backend league endpoint tests for read-only listing, auth guards, join success, invitation conflict, and request pending in `packages/backend/__tests__/app.test.js`
- [X] T029 [P] [US3] Add frontend leagues page tests for guest restrictions, joinable join success, invitation token failure, and request-to-join feedback in `packages/frontend/src/__tests__/LeaguesPage.test.js`

### Implementation for User Story 3

- [X] T030 [P] [US3] Implement leagues API client wrappers in `packages/frontend/src/services/leaguesService.js`
- [X] T031 [P] [US3] Implement leagues page with joinable/private sections and guest read-only messaging in `packages/frontend/src/pages/LeaguesPage.js`
- [X] T032 [P] [US3] Implement private league action panel (invite token accept + request-to-join) in `packages/frontend/src/components/PrivateLeagueActions.js`
- [X] T033 [US3] Implement backend leagues listing and join/join-request/invitation endpoints per contract in `packages/backend/src/app.js`
- [X] T034 [US3] Enforce membership action authorization and conflict handling in `packages/backend/src/services/leagueAccessService.js`
- [X] T035 [US3] Add frontend post-action feedback and login redirect/prompt behavior in `packages/frontend/src/pages/LeaguesPage.js`

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: User Story 4 - Learn Game Structure (Priority: P3)

**Goal**: Users can read a clear, sequenced How to Play page explaining game phases and where to begin.

**Independent Test**: Open How to Play on desktop/mobile and verify complete ordered instructional sections with readable formatting.

### Tests for User Story 4

- [X] T036 [P] [US4] Add backend content endpoint test for ordered how-to-play sections in `packages/backend/__tests__/app.test.js`
- [X] T037 [P] [US4] Add frontend how-to-play rendering and sequence tests in `packages/frontend/src/__tests__/HowToPlayPage.test.js`

### Implementation for User Story 4

- [X] T038 [P] [US4] Implement backend how-to-play content route and ordering logic in `packages/backend/src/app.js`
- [X] T039 [P] [US4] Implement frontend how-to-play API service wrapper in `packages/frontend/src/services/howToPlayService.js`
- [X] T040 [US4] Implement How to Play page UI with sequenced sections in `packages/frontend/src/pages/HowToPlayPage.js`
- [X] T041 [US4] Wire How to Play route into app navigation and page shell in `packages/frontend/src/App.js`

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, accessibility, contract alignment, and quickstart validation across stories.

- [X] T042 [P] Run and stabilize frontend/backend test suites and coverage checks from root scripts in `package.json`
- [X] T043 [P] Add accessibility polish for focus order, labels, and contrast across primary pages in `packages/frontend/src/App.css`
- [X] T044 Validate OpenAPI contract alignment against implemented handlers in `specs/001-frontend-auth-leagues/contracts/frontend-auth-leagues.openapi.yaml`
- [X] T045 [P] Update feature quickstart notes with final command and verification tweaks in `specs/001-frontend-auth-leagues/quickstart.md`
- [X] T046 Add/verify backend observability logs for login attempts, join attempts, and major page-load errors in `packages/backend/src/services/auditLogService.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phases 3-6 (User Stories)**: Depend on Phase 2 completion; can run in parallel by staffing, though listed in priority order.
- **Phase 7 (Polish)**: Depends on completion of all targeted user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2. No dependency on other stories.
- **US2 (P1)**: Starts after Phase 2. Uses shared auth/session foundation; independent of US1 implementation details.
- **US3 (P2)**: Starts after Phase 2; can proceed in parallel with US1/US2 but benefits from completed auth context.
- **US4 (P3)**: Starts after Phase 2; independent of auth and league mutation flows.

### Within Each User Story

- Tests should be created before implementation and should initially fail.
- API/data services before page integration.
- Page/component implementation before route wiring and UX polish.

### Parallel Opportunities

- Setup tasks marked [P] can run concurrently.
- Foundational frontend/backend tracks can run concurrently on separate files.
- Story-level test tasks marked [P] can run in parallel.
- Within each story, service/page/component tasks marked [P] can run in parallel where they touch different files.

---

## Parallel Example: User Story 3

```bash
# Backend and frontend tests in parallel:
Task: "T028 [US3] backend league endpoint tests in packages/backend/__tests__/app.test.js"
Task: "T029 [US3] frontend leagues behavior tests in packages/frontend/src/__tests__/LeaguesPage.test.js"

# Frontend implementation parallelization:
Task: "T030 [US3] leagues API wrappers in packages/frontend/src/services/leaguesService.js"
Task: "T032 [US3] private league action panel in packages/frontend/src/components/PrivateLeagueActions.js"
```

---

## Parallel Example: User Story 4

```bash
Task: "T038 [US4] backend how-to-play route in packages/backend/src/app.js"
Task: "T039 [US4] frontend how-to-play service wrapper in packages/frontend/src/services/howToPlayService.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1 and Phase 2.
2. Deliver US1 for entry-point navigation.
3. Deliver US2 for working authentication.
4. Validate with story-level tests and quick manual checks.

### Incremental Delivery

1. Add US3 league discovery and join flows.
2. Add US4 how-to-play instructional content.
3. Run polish phase for accessibility, observability, and contract verification.

### Team Parallelization

1. One developer drives backend foundations and contract handlers.
2. One developer drives frontend routing/auth shell.
3. After foundation, assign US3 and US4 to separate developers while maintaining test-first discipline.

---

## Notes

- [P] means no dependency conflict and different-file parallel work.
- [USx] labels maintain traceability from spec stories to implementation.
- Tasks are written to be executable by an LLM or engineer without extra context.
