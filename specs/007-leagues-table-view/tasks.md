---
description: "Task list for 007-leagues-table-view"
---

# Tasks: Leagues Table View

**Input**: Design documents from `/specs/007-leagues-table-view/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included per constitution requirement for meaningful behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the compile-time mock data constants file that every table row depends on.

- [X] T001 Create `packages/frontend/src/constants/leaguesMockData.js` with `LEAGUE_MOCK_METADATA` static lookup object keyed by league `id`, containing `commissioner` (string) and `draftStartTime` (ISO 8601 string) for all known league IDs (`league-joinable-1`, `league-private-1`, `league-private-2`)

**Checkpoint**: Mock data constants available for import by `LeaguesTable`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend endpoint + frontend service function that all user stories depend on for per-row membership status. Must be complete before user stories begin.

**⚠️ CRITICAL**: The parallel fetch in `LeaguesPage` and the "Joined" indicator across all stories require this foundation.

- [X] T002 Add exported `getUserLeagueIds(userId)` function to `packages/backend/src/services/leagueAccessService.js` — filters `memberships` array by `userId` and returns array of `leagueId` strings
- [X] T003 Add authenticated `GET /api/leagues/my` route to `packages/backend/src/app.js` — validates Bearer token via `authService`, calls `getUserLeagueIds(userId)`, returns `{ success: true, data: [...leagueIds] }` (401 if unauthenticated)
- [X] T004 [P] Add `listMyLeagues()` function to `packages/frontend/src/services/leaguesService.js` — calls `GET /api/leagues/my` with `Authorization: Bearer <token>` header; returns `{ data: [...leagueIds] }`
- [X] T005 [P] Add backend tests for `GET /api/leagues/my` (authenticated user returns 200 with league ID array; missing/invalid token returns 401) to `packages/backend/__tests__/app.test.js`

**Checkpoint**: Foundation complete — `listMyLeagues()` callable from frontend; backend endpoint tested and passing

---

## Phase 3: User Story 1 — Browse All Leagues in Table Format (Priority: P1) 🎯 MVP

**Goal**: Replace the existing split-list Leagues page with a single unified semantic HTML table displaying League Name, Type (public/private badge), Commissioner, Draft Start, and Action columns.

**Independent Test**: Open `/leagues`; confirm a single `<table>` renders with all 5 column headers, every row shows a commissioner name and human-readable draft start time from mock data, and public/private badges are visible with text labels.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Write `LeaguesTable` unit tests covering: 5-column header rendering (`<th scope="col">`), public badge (`badge--public` + "Public" label) on `accessType: "joinable"` rows, private badge (`badge--private` + "Private" label) on `accessType: "private"` rows, "Unknown" badge fallback, commissioner and draft start time mock data display with "—" fallback, empty-state message when leagues array is empty, and non-interactive row body (no click navigation) in `packages/frontend/src/__tests__/LeaguesTable.test.js`
- [X] T007 [P] [US1] Update `LeaguesPage` tests for `Promise.allSettled` parallel fetch (mock both `listLeagues` and `listMyLeagues`), table element rendered instead of separate lists, and empty-state scenario in `packages/frontend/src/__tests__/LeaguesPage.test.js`

### Implementation for User Story 1

- [X] T008 [US1] Create `LeaguesTable` component with semantic HTML structure — `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">` — and 5 columns: League Name, Type, Commissioner, Draft Start, Action — in `packages/frontend/src/components/LeaguesTable.js`
- [X] T009 [US1] Add public/private badge rendering in the Type column: `<span>` with text label ("Public" / "Private" / "Unknown"), CSS class (`badge--public` / `badge--private` / `badge--unknown`), and matching `aria-label` in `packages/frontend/src/components/LeaguesTable.js`
- [X] T010 [US1] Implement draft start time formatter using `Intl.DateTimeFormat` (`{ month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }`) producing output like "Jun 15, 2026 at 7:00 PM"; render "—" fallback when league ID is absent from `LEAGUE_MOCK_METADATA` in `packages/frontend/src/components/LeaguesTable.js`
- [X] T011 [US1] Add empty-state row (`<tr><td colSpan={5}>No leagues available.</td></tr>`) when the `leagues` prop array is empty in `packages/frontend/src/components/LeaguesTable.js`
- [X] T012 [US1] Refactor `LeaguesPage.js` to call `Promise.allSettled([listLeagues(), listMyLeagues()])` on mount when authenticated (skip `listMyLeagues` for unauthenticated users; default `joinedLeagueIds` to `new Set()`); derive `joinedLeagueIds` Set from settled result; replace existing list rendering with `<LeaguesTable leagues={leagues} joinedLeagueIds={joinedLeagueIds} ... />` in `packages/frontend/src/pages/LeaguesPage.js`

**Checkpoint**: User Story 1 fully functional and independently testable — all leagues shown in a semantic table with correct columns and mock data

---

## Phase 4: User Story 2 — Join a Public League (Priority: P1)

**Goal**: Display a "Sign Up" button on public league rows that triggers the existing join flow for authenticated users and redirects unauthenticated users to sign-in.

**Independent Test**: Click "Sign Up" on a public league row — authenticated user sees a success confirmation; unauthenticated user is redirected to `/login`.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US2] Add tests for "Sign Up" button presence on `accessType: "joinable"` rows (not joined), `onJoin` prop called with correct `league.id` on button click, and absence of "Sign Up" button when row is already joined in `packages/frontend/src/__tests__/LeaguesTable.test.js`

### Implementation for User Story 2

- [X] T014 [US2] Implement "Sign Up" `<button>` in the Action `<td>` for `accessType === "joinable"` rows where `!joinedLeagueIds.has(league.id)` — calls `onJoin(league.id)` prop on click; if unauthenticated, redirect to `/login` in `packages/frontend/src/components/LeaguesTable.js`
- [X] T015 [US2] Wire `onJoin` prop in `LeaguesPage.js` to existing `handleJoin` handler so the `<LeaguesTable>` triggers the correct join API call and `FeedbackBanner` response in `packages/frontend/src/pages/LeaguesPage.js`

**Checkpoint**: User Story 2 independently testable — "Sign Up" button functional for public league rows

---

## Phase 5: User Story 3 — Request to Join a Private League (Priority: P1)

**Goal**: Display a "Request to Join" button on private league rows (with an inline invite code toggle beneath it), and a non-interactive "Joined" indicator for rows the authenticated user has already joined.

**Independent Test**: Click "Request to Join" on a private league row — request flow triggered. Click "Have an invite? Enter code" — inline token input and "Accept Invitation" button appear. Already-joined rows show a "Joined" indicator with no action button.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US3] Add tests for "Request to Join" button on `accessType: "private"` rows (not joined), `onRequestJoin` prop called on click, "Have an invite? Enter code" secondary button present, inline input + "Accept Invitation" button visible after toggle click, `onAcceptInvitation` called with trimmed token value, and "Accept Invitation" button disabled when input is empty in `packages/frontend/src/__tests__/LeaguesTable.test.js`
- [X] T017 [P] [US3] Add tests for "Joined" non-interactive `<span>` indicator displayed in Action column when `joinedLeagueIds` contains the league ID (for both `accessType` values); confirm no action button rendered in that state in `packages/frontend/src/__tests__/LeaguesTable.test.js`

### Implementation for User Story 3

- [X] T018 [US3] Implement "Request to Join" `<button>` (primary) and "Have an invite? Enter code" `<button>` (secondary, text-link style) in the Action `<td>` for `accessType === "private"` rows where `!joinedLeagueIds.has(league.id)` — toggling the secondary button reveals an inline `<input>` + "Accept Invitation" `<button>`; "Accept Invitation" is disabled when trimmed input is empty in `packages/frontend/src/components/LeaguesTable.js`
- [X] T019 [US3] Add "Joined" non-interactive `<span>` in the Action `<td>` when `joinedLeagueIds.has(league.id)` is true for any `accessType`; ensure no action button is rendered for joined rows in `packages/frontend/src/components/LeaguesTable.js`
- [X] T020 [US3] Wire `onRequestJoin` and `onAcceptInvitation` props in `LeaguesPage.js` to existing handlers (`handleRequestJoin`, `handleAcceptInvitation`) so the `<LeaguesTable>` triggers the correct flows and `FeedbackBanner` response in `packages/frontend/src/pages/LeaguesPage.js`

**Checkpoint**: User Story 3 independently testable — Request to Join, invite toggle, and Joined indicator all functional

---

## Phase 6: User Story 4 — Visually Attractive and Responsive Table (Priority: P2)

**Goal**: Apply modern table styling consistent with the platform's design language; ensure the table remains readable and usable at 768px viewport without the Action column being cut off.

**Independent Test**: Open `/leagues` at 1280px and 768px — table has clear column headers, consistent row spacing, visible badges with colour differentiation, and no critical content overflow at 768px.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T021 [P] [US4] Add rendering tests confirming the table wrapper has the `leagues-table-container` CSS class and badges render the correct `badge--public` / `badge--private` class names in `packages/frontend/src/__tests__/LeaguesTable.test.js`

### Implementation for User Story 4

- [X] T022 [P] [US4] Add CSS styles for `.leagues-table` (column headers, row borders/spacing, alternating row styling), `.badge--public`, `.badge--private`, `.badge--unknown` (colour-coded backgrounds with text labels), and `.leagues-table-container` in `packages/frontend/src/App.css`
- [X] T023 [P] [US4] Add responsive CSS for `.leagues-table-container` using `overflow-x: auto` and percentage-based column widths with a fixed minimum for the Action column so the table remains usable at 768px in `packages/frontend/src/App.css`

**Checkpoint**: User Story 4 independently verifiable — table is polished and responsive at 768px

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, regression checks, and quickstart validation

- [X] T024 [P] Verify `FeedbackBanner` continues to surface error, success, and warning messages after the `LeaguesPage` refactor — add or update relevant assertions in `packages/frontend/src/__tests__/LeaguesPage.test.js`
- [X] T025 Run all frontend tests (`CI=1 npm test -- --watchAll=false` from `packages/frontend`) and fix any regressions introduced by the `LeaguesPage` refactor or new `LeaguesTable` component
- [X] T026 Run all backend tests (`CI=1 npm test -- --watchAll=false` from `packages/backend`) and confirm `GET /api/leagues/my` tests pass alongside all existing suite tests
- [X] T027 Validate all quickstart.md scenarios manually at `http://localhost:3000/leagues`: guest view (table visible, action buttons redirect to login), authenticated user (alex@example.com — Sign Up on public, Request to Join on private), already-joined user (casey@example.com — "Friends Invitational" shows Joined indicator), and empty-state view

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **User Stories (Phases 3–6)**: Depend on Phase 2 completion
  - US1 (Phase 3) must complete before US2/US3 (Action cell builds on `LeaguesTable` scaffold)
  - US2 (Phase 4) and US3 (Phase 5) depend on US1's `LeaguesTable` scaffold but are otherwise independent of each other
  - US4 (Phase 6) can start in parallel with US2/US3 (CSS only, different files)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on other user stories
- **US2 (P1)**: Depends on US1 `LeaguesTable` scaffold (adds to Action cell) — independent of US3
- **US3 (P1)**: Depends on US1 `LeaguesTable` scaffold (adds to Action cell) — independent of US2
- **US4 (P2)**: Depends on US1 `LeaguesTable` scaffold for class names — CSS work is independent of US2/US3

### Within Each User Story

- Tests MUST be written and FAIL before implementation begins
- Constants / service functions before component code that imports them
- Component scaffold before action cell additions
- Story complete and all its tests passing before moving to next priority

### Parallel Opportunities

#### Phase 2 (Foundational)
| Parallel Group | Tasks |
|----------------|-------|
| Backend (sequential) | T002 → T003 |
| Frontend + Backend Tests (parallel after T002) | T004 [P], T005 [P] |

#### Phase 3 (US1)
| Parallel Group | Tasks |
|----------------|-------|
| Tests (write-first, parallel) | T006 [P], T007 [P] |
| Component scaffold → badge + formatter + empty-state | T008 → T009, T010, T011 |
| Page refactor (after T008) | T012 |

#### Phase 4 (US2)
| Parallel Group | Tasks |
|----------------|-------|
| Test (write-first) | T013 [P] |
| Implementation | T014 → T015 |

#### Phase 5 (US3)
| Parallel Group | Tasks |
|----------------|-------|
| Tests (write-first, parallel) | T016 [P], T017 [P] |
| Implementation | T018 → T019 → T020 |

#### Phase 6 (US4) — fully parallel with each other
| Parallel Group | Tasks |
|----------------|-------|
| Test + CSS | T021 [P], T022 [P], T023 [P] |

#### Phase 7
| Parallel Group | Tasks |
|----------------|-------|
| Regression check | T024 [P] (with T025) |
| Sequential validation | T025 → T026 → T027 |

---

## Implementation Strategy

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1) — delivers the full table layout with all columns and mock data; sufficient to demo the core feature to stakeholders.

**Incremental delivery order**:
1. **MVP** (Phase 1–3): Unified table with columns, badges, mock data, empty state
2. **Increment 2** (Phase 4): Public league "Sign Up" action
3. **Increment 3** (Phase 5): Private league "Request to Join" + invite toggle + "Joined" indicator
4. **Increment 4** (Phase 6): Visual polish and responsive layout
5. **Hardening** (Phase 7): Regression validation and quickstart verification
