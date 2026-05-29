---

description: "Task list for Draft Room Enhancements"
---

# Tasks: Draft Room Enhancements

**Input**: Design documents from `/specs/006-draft-room-enhancements/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included for each user story per constitution (meaningful behavior changes require tests).

**Organization**: Tasks grouped by user story — US1 (active team indicator) and US2 (player statistics) are fully independent and can be implemented in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Baseline Verification)

**Purpose**: Confirm the existing frontend environment and test suite pass before making changes.

- [X] T001 Verify baseline by running `CI=1 npm test -- --watchAll=false` in `packages/frontend` and confirming all existing tests pass

**Checkpoint**: Baseline confirmed — enhancement work can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No shared infrastructure blockers exist for this feature — US1 and US2 are independently implementable.

*Both user stories can begin immediately after Phase 1. Proceed to Phase 3 and Phase 4 in priority order or in parallel.*

---

## Phase 3: User Story 1 — Active Team Highlighted in League Bar (Priority: P1) 🎯 MVP

**Goal**: Visually highlight the team whose turn it is in the league header bar with a distinct border/background and a bold "ON THE CLOCK" label; automatically advance to the next team after each pick; replace with a "Draft Complete" indicator when all picks are done.

**Independent Test**: Load the Draft Room, confirm Team 1 is visually highlighted with the "ON THE CLOCK" label; draft a player and confirm the highlight moves to the next team; exhaust all picks and confirm the active highlight is replaced by a "Draft Complete" indicator.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T002 [P] [US1] Create `packages/frontend/src/__tests__/DraftTeamSlot.test.js` with tests for: `isActive=true` applies `draft-team-slot--active` CSS class; `isActive=true` renders bold "ON THE CLOCK" label below slot; `isActive=false` renders no label and no active class
- [X] T003 [P] [US1] Extend `packages/frontend/src/__tests__/DraftLeagueBar.test.js` with tests for: `activeTeamId` prop causes matching slot to receive `isActive=true`; all other slots receive `isActive=false`; `draftComplete=true` renders "Draft Complete" banner and no slot is active; `draftComplete=false` with valid `activeTeamId` highlights exactly one slot

### Implementation for User Story 1

- [X] T004 [P] [US1] Add `isActive` prop to `packages/frontend/src/components/DraftTeamSlot.js`: apply `draft-team-slot--active` CSS modifier class to the slot container when `isActive` is true; render a bold `<span>` with text "ON THE CLOCK" below the team slot button when `isActive` is true; render nothing extra when `isActive` is false
- [X] T005 [US1] Add `activeTeamId` (string|null) and `draftComplete` (boolean) props to `packages/frontend/src/components/DraftLeagueBar.js`: derive `isActive` per slot as `team.id === activeTeamId`; pass `isActive` to each `DraftTeamSlot`; when `draftComplete` is true, render a "Draft Complete" banner inside the bar and pass `isActive=false` to all slots (depends on T004)
- [X] T006 [US1] Update `packages/frontend/src/pages/DraftRoomPage.js`: derive `activeTeamId` using existing `getActiveTeam(state.teams, state.currentPickIndex)`; set `activeTeamId` to `null` when `state.draftComplete` is true; pass `activeTeamId` and `draftComplete={state.draftComplete}` as new props to `DraftLeagueBar` (depends on T005)

**Checkpoint**: User Story 1 fully functional — league bar highlights the active team, advances after each pick, and shows "Draft Complete" at end of draft

---

## Phase 4: User Story 2 — Player Statistics Displayed in Player List (Priority: P2)

**Goal**: Display four mock NFL season statistics inline on each player row — TDs, Pass Yards (non-zero for QBs only), Rush Yards, and Rec Yards — as additional columns to the right of the existing player name and team abbreviation. Stats must be deterministic compile-time integer constants.

**Independent Test**: Load the Draft Room player list and confirm all four stat columns appear on every row; filter by QB and confirm non-zero Pass Yds; filter by RB and confirm zero Pass Yds; confirm Kicker and DEF rows all show 0 for TDs/Rush/Rec and DEF shows ≥1 TD; reload the page and confirm the same player's stats are unchanged.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US2] Create `packages/frontend/src/__tests__/DraftPlayerRow.test.js` with tests for: all four stat columns rendered on a sample player row; QB player shows non-zero Pass Yds; non-QB player shows 0 for Pass Yds; K player shows 0 for TDs, Rush Yds, Rec Yds; DEF player shows ≥1 TD and 0 for Rush Yds and Rec Yds; stat `<span>` elements have correct BEM class names (`draft-player-row__stat--tds`, `draft-player-row__stat--pass-yards`, `draft-player-row__stat--rush-yards`, `draft-player-row__stat--rec-yards`)
- [X] T008 [P] [US2] Extend `packages/frontend/src/__tests__/DraftPlayerList.test.js` with tests for: stats remain visible when a position filter is applied; stats remain visible after filter is cleared; no stat rows rendered when filter produces an empty player list

### Implementation for User Story 2

- [X] T009 [US2] Add `touchdowns`, `passYards`, `rushYards`, and `recYards` integer literal fields to every player object in `packages/frontend/src/constants/draftMockData.js` — values must follow position-archetype ranges from data-model.md (QB: 25–45 TDs, 3500–5000 passYards, 200–800 rushYards, 0 recYards; RB: 8–20 TDs, 0 passYards, 800–1800 rushYards, 200–600 recYards; WR: 6–15 TDs, 0 passYards, 0–100 rushYards, 700–1500 recYards; TE: 4–12 TDs, 0 passYards, 0 rushYards, 400–900 recYards; K: all 0; DEF: 1–4 TDs, all others 0)
- [X] T010 [P] [US2] Add four stat `<span>` columns to `packages/frontend/src/components/DraftPlayerRow.js` after the existing team abbreviation field: TDs (class `draft-player-row__stat draft-player-row__stat--tds`, value `player.touchdowns`), Pass Yds (`draft-player-row__stat--pass-yards`, value `player.passYards`), Rush Yds (`draft-player-row__stat--rush-yards`, value `player.rushYards`), Rec Yds (`draft-player-row__stat--rec-yards`, value `player.recYards`); use compact display format matching NFR-004 (depends on T009)

**Checkpoint**: User Story 2 fully functional — all player rows show four stat columns with position-appropriate values; stats survive filter interactions

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full implementation, confirm coverage targets, and run the quickstart smoke test.

- [X] T011 [P] Add CSS rules for `draft-team-slot--active` modifier (distinct border and background) in the appropriate stylesheet in `packages/frontend/src/` and verify visual contrast meets WCAG 2.1 AA (NFR-002)
- [X] T012 [P] Run quickstart.md validation for both enhancements in `packages/frontend`: verify "ON THE CLOCK" label on Team 1 at load, highlight advance after a pick, "Draft Complete" indicator at draft end, all four stat columns visible, QB non-zero Pass Yds, non-QB zero Pass Yds, stats persist through filter changes, stats identical on reload
- [X] T013 Run full test suite with `CI=1 npm test -- --watchAll=false` in `packages/frontend` and confirm all new and extended tests pass with ≥80% coverage on new code (NFR per constitution)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No tasks — both user stories can start after Phase 1
- **User Story 1 (Phase 3)**: Depends on Phase 1 only — no dependency on US2
- **User Story 2 (Phase 4)**: Depends on Phase 1 only — no dependency on US1
- **Polish (Phase 5)**: Depends on both Phase 3 and Phase 4 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent — can start immediately after Phase 1
- **User Story 2 (P2)**: Independent — can start immediately after Phase 1; also startable in parallel with US1

### Within Each User Story

- Tests (T002/T003, T007/T008) MUST be written and confirmed failing before implementation tasks
- T004 before T005 before T006 (within US1: slot → bar → page)
- T009 before T010 (within US2: mock data before component)

### Parallel Opportunities

**User Story 1 (once tests pass/fail confirmed)**:
- T004 and T002/T003 tests can be authored in parallel
- T005 depends on T004; T006 depends on T005 — strictly sequential

**User Story 2 (once tests pass/fail confirmed)**:
- T009 (mock data) and T007/T008 (tests) can be authored in parallel
- T010 depends on T009 — sequential after data is ready

**Across stories**:
- All of Phase 3 and all of Phase 4 can proceed in parallel after Phase 1
- T011 and T012 in Phase 5 can run in parallel; T013 must run last

---

## Implementation Strategy

**MVP Scope**: Phase 3 (User Story 1) alone delivers the minimum viable "on the clock" experience.

**Recommended Delivery Order**:
1. Phase 1 (baseline verification) — 5 min
2. Phase 3 tests (T002, T003) — write, confirm failing
3. Phase 3 implementation (T004 → T005 → T006) — wire up active team prop chain
4. Phase 3 checkpoint — confirm US1 tests pass, manual verification
5. Phase 4 tests (T007, T008) — write, confirm failing
6. Phase 4 implementation (T009 → T010) — add stats to data and component
7. Phase 4 checkpoint — confirm US2 tests pass, manual verification
8. Phase 5 polish (T011, T012, T013) — CSS, quickstart smoke, coverage check
