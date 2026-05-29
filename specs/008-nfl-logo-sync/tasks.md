---
description: "Task list for NFL Team Logo Sync & Draft Room Display"
---

# Tasks: NFL Team Logo Sync & Draft Room Display

**Input**: Design documents from `/specs/008-nfl-logo-sync/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/nfl-logo-sync.openapi.yaml ✅, quickstart.md ✅

**Tests**: Test tasks are included for each user story per constitution requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths listed for every implementation task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the npm script entry and establish the logo directory so the sync script and static serving path are ready before any implementation begins.

- [ ] T001 Add `"sync:nfl-logos": "node scripts/syncNflLogos.js"` to the `scripts` section in `packages/backend/package.json`
- [ ] T002 [P] Create `packages/frontend/public/logos/nfl/.gitkeep` to establish the static logo directory tracked by git

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `nflTeamsStore` service module that both the sync script (US2) and the `GET /api/nfl-teams` endpoint (US1) depend on. No user story can begin until this is complete.

**⚠️ CRITICAL**: Both US1 backend work and US2 sync script depend on this module. No user story implementation can begin until T003 is complete.

- [ ] T003 Create `packages/backend/src/services/nflTeamsStore.js` — open/create `packages/backend/data/capstone.db` via `better-sqlite3` (programmatically create `data/` dir if absent), run `CREATE TABLE IF NOT EXISTS nfl_teams` DDL per data-model.md, and export `upsertTeam(team)` and `getAllTeams()` helpers

**Checkpoint**: Foundation ready — all user story implementation can now begin

---

## Phase 3: User Story 1 — View Team Logos in the Draft Room (Priority: P1) 🎯 MVP

**Goal**: Each player card in the draft pool displays the player's NFL team logo image and abbreviation side by side. Missing logos fall back to abbreviation text with no broken image indicator.

**Independent Test**: Run the logo sync ahead of time, open the Draft Room, and confirm each player card shows the team logo and abbreviation. Logos missing for a player fall back to abbreviation text without a broken image icon.

### Tests for User Story 1 ⚠️

> **Write these tests FIRST and confirm they FAIL before implementing T007–T010**

- [ ] T004 [P] [US1] Add failing `GET /api/nfl-teams` test asserting `{ success: true, data: [...] }` shape to `packages/backend/__tests__/app.test.js`
- [ ] T005 [P] [US1] Add failing tests for team logo `<img>` rendering, descriptive `alt` text, and `onError` fallback (abbreviation shown, image hidden) to `packages/frontend/src/__tests__/DraftPlayerRow.test.js`
- [ ] T006 [P] [US1] Add failing tests for `fetchNflTeams` call on mount and `nflTeamLogoMap` derivation passed to player rows to `packages/frontend/src/__tests__/DraftRoomPage.test.js`

### Implementation for User Story 1

- [ ] T007 [US1] Add `GET /api/nfl-teams` route to `packages/backend/src/app.js` — call `nflTeamsStore.getAllTeams()`, return `{ success: true, data: teams }` (no auth middleware, matches OpenAPI contract in `contracts/nfl-logo-sync.openapi.yaml`)
- [ ] T008 [P] [US1] Create `packages/frontend/src/services/nflTeamsService.js` exporting `fetchNflTeams()` that calls `GET /api/nfl-teams` via `axios` and returns the `data` array
- [ ] T009 [US1] Update `packages/frontend/src/pages/DraftRoomPage.js` — call `fetchNflTeams()` on mount, build `Map<abbreviation, logoPath>` (`nflTeamLogoMap`), and pass each player's `logoPath` (from map by `player.nflTeamAbbr`) as a prop to `DraftPlayerRow`
- [ ] T010 [US1] Update `packages/frontend/src/components/DraftPlayerRow.js` — render `<img src={logoPath} alt="{location} {name} logo" onError={handleImgError} />` alongside a team abbreviation `<span>`; `handleImgError` toggles state to hide the `<img>` and show abbreviation-only fallback (no broken image icon)

**Checkpoint**: User Story 1 is fully functional and testable — the Draft Room displays logos with fallback for missing images

---

## Phase 4: User Story 2 — Run Logo Sync to Download and Store Logos Locally (Priority: P2)

**Goal**: A developer can run `npm run sync:nfl-logos` in `packages/backend` to fetch all 32 NFL teams from the ESPN API, download each logo, save it to `packages/frontend/public/logos/nfl/<abbr>.png`, and persist team metadata in the `nfl_teams` table. Individual failures are caught, execution continues, and a summary is printed at the end.

**Independent Test**: Run `cd packages/backend && npm run sync:nfl-logos`; verify 32 `.png` files exist under `packages/frontend/public/logos/nfl/` and that `GET /api/nfl-teams` returns all teams with non-null `logoPath` values. Re-run the script to confirm existing files are overwritten without error.

### Implementation for User Story 2

- [ ] T011 [US2] Create `packages/backend/scripts/syncNflLogos.js` — fetch `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=1000`, for each team download logo via `https.get()` to `packages/frontend/public/logos/nfl/<abbr>.png` (lowercase abbreviation, PNG), upsert team record via `nflTeamsStore.upsertTeam()`, apply 500ms delay between downloads, catch per-team errors without halting, print completion summary (`N succeeded, M failed; Failed teams: ...`) per NFR-005

**Checkpoint**: Developer can run the sync script end-to-end; logo files and DB records are populated; User Story 1 now shows real logos

---

## Phase 5: User Story 3 — Team Logos in NFL Team Filter (Priority: P3)

**Goal**: Each team option in the Draft Room's NFL team filter displays the team logo thumbnail alongside the team name or abbreviation. Missing logos show name/abbreviation only without layout breakage.

**Independent Test**: Open the Draft Room, open the NFL team filter, and confirm each team option shows a logo thumbnail (or abbreviation text if logo is absent) without layout issues.

### Tests for User Story 3 ⚠️

> **Write these tests FIRST and confirm they FAIL before implementing T013–T014**

- [ ] T012 [P] [US3] Add failing tests for logo `<img>` thumbnails rendered per team option and graceful missing-logo fallback to `packages/frontend/src/__tests__/DraftFilters.test.js`

### Implementation for User Story 3

- [ ] T013 [US3] Update `packages/frontend/src/components/DraftFilters.js` — accept `nflTeamLogoMap` prop (`Map<abbreviation, logoPath>`); for each NFL team option render a logo `<img>` thumbnail when `logoPath` is non-null, otherwise show name/abbreviation text only; no broken image indicators
- [ ] T014 [US3] Update `packages/frontend/src/pages/DraftRoomPage.js` to pass the already-built `nflTeamLogoMap` as a prop to `DraftFilters`

**Checkpoint**: All three user stories are independently functional and testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all stories

- [ ] T015 [P] Verify `packages/frontend/public/logos/nfl/*.png` files are handled correctly in `.gitignore` (PNG logo files should typically be gitignored or explicitly tracked depending on team preference — confirm and document the decision)
- [ ] T016 Run quickstart.md end-to-end validation: execute `npm run sync:nfl-logos` in `packages/backend`, start both servers, open Draft Room, confirm player cards show logos and abbreviations, confirm team filter shows thumbnails, confirm fallback renders without broken images; run `CI=1 npm test -- --watchAll=false` in both packages and confirm all tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Phase 2 (needs `nflTeamsStore.getAllTeams()`)
- **User Story 2 (Phase 4)**: Depends on Phase 2 (needs `nflTeamsStore.upsertTeam()`); independent of US1
- **User Story 3 (Phase 5)**: Depends on Phase 3 US1 completion (`nflTeamLogoMap` built in `DraftRoomPage`)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — independent of US2 and US3
- **US2 (P2)**: Can start after Phase 2 — independent of US1 and US3
- **US3 (P3)**: Depends on US1 completion (needs `nflTeamLogoMap` established in `DraftRoomPage`)

### Within Each User Story

- Tests MUST be written and confirmed FAILING before implementation begins
- `nflTeamsService.js` (T008) before `DraftRoomPage` update (T009)
- `DraftRoomPage` update (T009) before `DraftPlayerRow` update (T010) — logo prop flows down
- `DraftFilters` update (T013) before `DraftRoomPage` prop pass (T014)

### Parallel Opportunities

**Phase 1**: T001 and T002 can run in parallel
**Phase 3 tests**: T004, T005, T006 can all run in parallel (different files)
**Phase 3 impl**: T007 (backend) and T008 (frontend service) can run in parallel; T009 depends on T008
**Phase 5**: T012 (test) can start immediately; T013 and T014 are sequential within the story

---

## Implementation Strategy

**MVP Scope**: Complete Phase 1 + Phase 2 + Phase 3 (US1) to deliver the primary user-facing outcome — team logos visible in the Draft Room. US2 (sync script) and US3 (filter thumbnails) add operational tooling and polish but do not block the core user value.

**Incremental Delivery Order**:
1. Phase 1 + 2: Infrastructure (T001–T003) — ~1 session
2. Phase 3: Draft Room logo display (T004–T010) — ~1-2 sessions; **delivers MVP**
3. Phase 4: Sync script (T011) — ~1 session; enables real logo data
4. Phase 5: Filter thumbnails (T012–T014) — ~1 session; quality-of-life polish
5. Phase 6: Verification (T015–T016) — ~1 session; confirm everything works end-to-end
