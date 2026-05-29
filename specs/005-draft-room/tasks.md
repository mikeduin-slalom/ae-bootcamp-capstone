---

description: "Task list for Draft Room feature implementation"
---

# Tasks: Draft Room

**Input**: Design documents from `/specs/005-draft-room/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Test tasks are included per user story per the constitution's test discipline requirement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths are included in all task descriptions

## Path Conventions

- **Package root**: `packages/frontend/`
- **Source**: `packages/frontend/src/`
- **Tests**: `packages/frontend/src/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Routing registration and page skeleton — the minimal scaffolding that enables every user story to land in the browser.

- [x] T001 Add `draftRoom: '/draft-room'` constant to `packages/frontend/src/constants/routes.js`
- [x] T002 Register `<Route path={ROUTES.draftRoom} element={<DraftRoomPage />} />` in `packages/frontend/src/App.js` (depends on T001)
- [x] T003 [P] Create empty `DraftRoomPage.js` container shell (imports, `useReducer` stub, returns placeholder `<div>`) in `packages/frontend/src/pages/DraftRoomPage.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core mock data and state reducer — all user story phases depend on these modules being correct before implementation begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Create `packages/frontend/src/constants/draftMockData.js` with `MOCK_PLAYERS` (~100 players: QB ×15, RB ×22, WR ×28, TE ×12, K ×10, DEF ×13 across 12 NFL teams) and `MOCK_TEAMS` (12 fantasy teams with `id`, `name`, `initials` fields)
- [x] T005 [P] Create `packages/frontend/src/pages/draftReducer.js` with `initialDraftState`, `getActiveTeamIndex`, `getActiveTeam`, and `draftReducer` handling actions: `DRAFT_PLAYER`, `AUTO_PICK`, `SELECT_TEAM`, `SET_POSITION_FILTER`, `SET_NFL_TEAM_FILTER`, `CLEAR_FILTERS`

**Checkpoint**: Mock data and reducer are ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Enter the Draft Room from the Homepage (Priority: P1) 🎯 MVP

**Goal**: A visitor on the homepage sees a "Draft Room" CTA, clicks it, and lands on the Draft Room page showing the league header bar with 12 team slots, a player list placeholder, and a timer placeholder.

**Independent Test**: Load the homepage → verify "Draft Room" CTA is visible → click it → confirm `/draft-room` loads with league bar (12 team slots), a player list area, and a timer area visible.

### Tests for User Story 1

- [x] T006 [P] [US1] Write `packages/frontend/src/__tests__/DraftRoomPage.test.js` — integration tests: homepage renders "Draft Room" CTA; clicking CTA navigates to `/draft-room`; Draft Room page renders league bar with 12 team slots, a player list area, and a timer area

### Implementation for User Story 1

- [x] T007 [US1] Add "Draft Room" CTA entry (label + `ROUTES.draftRoom` href) to the CTAs array/list in `packages/frontend/src/pages/HomePage.js` (depends on T001)
- [x] T008 [P] [US1] Create `packages/frontend/src/components/DraftTeamSlot.js` — presentational component rendering a team logo (initials badge) and team name; accepts `team`, `isSelected`, `rosterCount`, and `onClick` props
- [x] T009 [P] [US1] Create `packages/frontend/src/components/DraftLeagueBar.js` — renders a horizontal bar of 12 `DraftTeamSlot` components from props; accepts `teams`, `rosters`, `selectedTeamId`, and `onSelectTeam` props
- [x] T010 [US1] Wire `useReducer(draftReducer, initialDraftState)` and render `<DraftLeagueBar>` with state props in `packages/frontend/src/pages/DraftRoomPage.js` (depends on T003, T005, T008, T009)
- [x] T011 [P] [US1] Add draft room layout and `DraftLeagueBar` CSS classes (`.draft-room`, `.draft-league-bar`, `.draft-team-slot`) to `packages/frontend/src/App.css`

**Checkpoint**: US1 complete — user can navigate from homepage to Draft Room and see all 12 team slots.

---

## Phase 4: User Story 2 — Draft a Player and Assign to a Fantasy Team (Priority: P2)

**Goal**: A user can click "Draft" on any available player; the player is removed from the available list and added to the active fantasy team's roster.

**Independent Test**: Load `/draft-room` → click "Draft" on any player → confirm player no longer appears in the available list → confirm active team slot shows an updated roster count.

### Tests for User Story 2

- [x] T012 [P] [US2] Write `packages/frontend/src/__tests__/draftReducer.test.js` — unit tests: `DRAFT_PLAYER` removes player from `availablePlayers` and adds to `rosters[activeTeam]`; `AUTO_PICK` selects first available player from unfiltered pool; `getActiveTeamIndex` snake-order logic for picks 0–23; `draftComplete` set when pool is empty

### Implementation for User Story 2

- [x] T013 [P] [US2] Create `packages/frontend/src/components/DraftPlayerRow.js` — presentational component rendering player name, position, NFL team, and a "Draft" button; accepts `player` and `onDraft` props; button is disabled when player is already drafted
- [x] T014 [US2] Create `packages/frontend/src/components/DraftPlayerList.js` — renders a list of `DraftPlayerRow` for each player in `availablePlayers` prop; shows "No players available" empty state when list is empty; accepts `availablePlayers` and `onDraft` props (depends on T013)
- [x] T015 [US2] Wire `<DraftPlayerList>` into `packages/frontend/src/pages/DraftRoomPage.js` passing `state.availablePlayers` and a `dispatch(DRAFT_PLAYER)` callback; add CSS classes (`.draft-player-list`, `.draft-player-row`) to `packages/frontend/src/App.css` (depends on T010, T014)

**Checkpoint**: US2 complete — drafting a player works end-to-end and the available pool updates.

---

## Phase 5: User Story 3 — View a Fantasy Team's Drafted Roster (Priority: P3)

**Goal**: Clicking a team slot in the league header bar opens a roster panel listing all players drafted to that team; an empty state is shown if no picks have been made.

**Independent Test**: Draft one player → click the active team's slot in the league bar → confirm the drafted player appears in the roster panel. Click a team with no picks → confirm empty state message appears.

### Tests for User Story 3

- [x] T016 [P] [US3] Write `packages/frontend/src/__tests__/DraftLeagueBar.test.js` — unit tests: renders 12 team slots; clicking a slot calls `onSelectTeam` with the correct team ID; selected slot receives an active/highlighted class; `rosterCount` badge displays correct count

### Implementation for User Story 3

- [x] T017 [P] [US3] Create `packages/frontend/src/components/DraftRosterPanel.js` — presentational component showing the selected team's name and a list of drafted players; shows "No players drafted yet" when roster is empty; accepts `team`, `roster` (Player[]), and `onClose` props
- [x] T018 [US3] Wire `SELECT_TEAM` dispatch to `DraftTeamSlot` onClick in `packages/frontend/src/components/DraftLeagueBar.js` (depends on T009)
- [x] T019 [US3] Render `<DraftRosterPanel>` conditionally in `packages/frontend/src/pages/DraftRoomPage.js` when `state.selectedTeamId` is non-null; pass selected team data and roster from state; add CSS classes (`.draft-roster-panel`) to `packages/frontend/src/App.css` (depends on T010, T017, T018)

**Checkpoint**: US3 complete — clicking a team slot shows that team's drafted roster panel.

---

## Phase 6: User Story 4 — Filter the Player List by Position and NFL Team (Priority: P4)

**Goal**: Position and NFL team filter controls narrow the visible player list in real-time; clearing filters restores the full available pool; an empty-state message appears when filters produce zero results.

**Independent Test**: Select position "QB" → confirm only QBs are shown. Select an NFL team → confirm only that team's players appear. Select both → confirm intersection. Clear filters → confirm full available list returns.

### Tests for User Story 4

- [x] T020 [P] [US4] Write `packages/frontend/src/__tests__/DraftPlayerList.test.js` — unit tests: position filter shows only matching players; NFL team filter shows only matching players; combined filters show intersection; clearing filters restores full list; empty-state message renders when zero results match active filters

### Implementation for User Story 4

- [x] T021 [P] [US4] Create `packages/frontend/src/components/DraftFilters.js` — two `<select>` controls (position: QB/RB/WR/TE/K/DEF and NFL team derived from MOCK_PLAYERS) plus a "Clear Filters" button; accepts `positionFilter`, `nflTeamFilter`, `onPositionChange`, `onNflTeamChange`, `onClearFilters` props; dispatches `SET_POSITION_FILTER`, `SET_NFL_TEAM_FILTER`, `CLEAR_FILTERS`
- [x] T022 [US4] Update `packages/frontend/src/components/DraftPlayerList.js` to accept `positionFilter` and `nflTeamFilter` props and compute `filteredPlayers` by applying both filters to `availablePlayers`; render "No players match your filters" inline empty-state when `filteredPlayers` is empty (depends on T014)
- [x] T023 [US4] Wire `<DraftFilters>` into `packages/frontend/src/components/DraftPlayerList.js` passing filter state and dispatch callbacks from `DraftRoomPage`; pass filter state from `DraftRoomPage` state to `DraftPlayerList`; add CSS classes (`.draft-filters`) to `packages/frontend/src/App.css` (depends on T015, T021, T022)

**Checkpoint**: US4 complete — position and NFL team filters work independently and in combination.

---

## Phase 7: User Story 5 — Pick Timer Counts Down Per Pick (Priority: P5)

**Goal**: A visible 5:00 countdown timer runs during each pick, resets when a pick is made, and auto-drafts the first available player when it reaches 0:00.

**Independent Test**: Load `/draft-room` → confirm timer shows "5:00" and counts down → wait for expiry (or use fake timers in test) → confirm first available player is auto-drafted, turn advances, and timer resets to "5:00".

### Tests for User Story 5

- [x] T024 [P] [US5] Write `packages/frontend/src/__tests__/DraftPickTimer.test.js` — unit tests: renders "5:00" on initial display; formats seconds correctly as `mm:ss`; receives `secondsLeft` prop and displays correctly for values like 299, 60, 1, 0

### Implementation for User Story 5

- [x] T025 [P] [US5] Create `packages/frontend/src/components/DraftPickTimer.js` — displays `mm:ss` formatted countdown from `secondsLeft` prop; displays "Pick X" label using `currentPickIndex + 1`; accepts `secondsLeft` and `currentPickIndex` props
- [x] T026 [US5] Add `secondsLeft` useState (initialized to 300) and two `useEffect` hooks in `packages/frontend/src/pages/DraftRoomPage.js`: one that resets `secondsLeft` when `state.currentPickIndex` changes, and one `setInterval` countdown that dispatches `AUTO_PICK` and resets to 300 when `secondsLeft` reaches 1; clear interval on cleanup; guard on `state.draftComplete` (depends on T010)
- [x] T027 [US5] Render `<DraftPickTimer secondsLeft={secondsLeft} currentPickIndex={state.currentPickIndex} />` in `packages/frontend/src/pages/DraftRoomPage.js`; add CSS classes (`.draft-pick-timer`) to `packages/frontend/src/App.css` (depends on T025, T026)

**Checkpoint**: US5 complete — pick timer counts down, resets on picks, and auto-drafts on expiry.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Visual polish, accessibility, and validation that all user stories work end-to-end.

- [ ] T028 [P] Add polished CSS for all draft room components (`.draft-room`, `.draft-league-bar`, `.draft-team-slot`, `.draft-roster-panel`, `.draft-player-list`, `.draft-player-row`, `.draft-filters`, `.draft-pick-timer`) in `packages/frontend/src/App.css` — ensure modern appearance, desktop layout (1024px+), sufficient color contrast (WCAG AA)
- [ ] T029 [P] Verify all inline empty-state messages render correctly: "No players match your filters" in `DraftPlayerList.js`, "No players drafted yet" in `DraftRosterPanel.js`
- [ ] T030 [P] Add `aria-label`, keyboard focus, and role attributes to interactive elements (Draft button in `DraftPlayerRow.js`, team slots in `DraftTeamSlot.js`, filter selects in `DraftFilters.js`) per NFR-003
- [x] T031 Run quickstart.md validation: `cd packages/frontend && npm start`; verify homepage shows "Draft Room" CTA; navigate to `/draft-room`; confirm all 12 team slots visible; draft a player; click a team slot; apply filters; let timer count down

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No dependencies — can run in parallel with Phase 1
- **User Story Phases (3–7)**: All depend on Phase 1 + Phase 2 completion
  - US1 (Phase 3) must complete before US2–US5 (provides DraftRoomPage container and league bar)
  - US2 (Phase 4) must complete before US3 (provides DraftPlayerList and roster wiring)
  - US3 (Phase 5), US4 (Phase 6), US5 (Phase 7) can proceed after US2
- **Polish (Phase 8)**: Depends on all desired user story phases complete

### User Story Dependencies

| Story | Phase | Depends On | Independent? |
|-------|-------|-----------|-------------|
| US1 (P1) | 3 | Phase 1 + 2 | ✅ Yes |
| US2 (P2) | 4 | Phase 1 + 2 + US1 (container wiring) | ✅ Yes (with US1 done) |
| US3 (P3) | 5 | Phase 1 + 2 + US1 | ✅ Yes (with US1 done) |
| US4 (P4) | 6 | Phase 1 + 2 + US2 (player list exists) | ✅ Yes (with US2 done) |
| US5 (P5) | 7 | Phase 1 + 2 + US1 (container) | ✅ Yes (with US1 done) |

### Parallel Opportunities

- **T003, T004, T005**: All can run in parallel (different files, no shared dependency)
- **T006, T008, T009, T011**: All US1 parallel tasks can run simultaneously
- **T012, T013**: US2 test + component can run in parallel
- **T016, T017**: US3 test + component can run in parallel
- **T020, T021**: US4 test + component can run in parallel
- **T024, T025**: US5 test + component can run in parallel
- **T028, T029, T030**: All polish tasks can run in parallel

### Suggested MVP Scope

Deliver only **User Story 1 (Phase 3)** first:

```
Phase 1 → Phase 2 → Phase 3 (T006–T011)
```

This gives a navigable Draft Room page with all 12 team slots visible in ~13 tasks. All remaining user stories can be layered on incrementally.
