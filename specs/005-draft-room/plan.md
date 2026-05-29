# Implementation Plan: Draft Room

**Branch**: `005-draft-room` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-draft-room/spec.md`

## Summary

Add a Draft Room page to the fantasy football capstone. The homepage gains a new "Draft Room"
primary CTA. The new `/draft-room` route renders a full fantasy football draft interface: a 12-team
league header bar (mock data), a filterable player list (position + NFL team), a 5-minute pick
timer with auto-pick on expiry, draft-player action with snake-order assignment, and a team roster
panel that shows drafted players when a team slot is clicked. All data is mock; no backend
endpoints are added in this phase.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2, Node 18 (build only)

**Primary Dependencies**: React, react-router-dom 6.26, @testing-library/react 13 (test), Jest 27
(via react-scripts)

**Storage**: In-memory React state (useReducer) — no persistence; draft state resets on page
refresh by design

**Testing**: Jest + @testing-library/react (existing setup); `CI=1 npm test --watchAll=false`

**Target Platform**: Web SPA (Create React App, `packages/frontend`)

**Project Type**: Frontend web application (monorepo package, frontend only)

**Performance Goals**: Timer accuracy ±1 second; UI re-render < 100ms on pick; filter response
immediate (synchronous)

**Constraints**: No new npm dependencies; no new backend endpoints; no persistence layer; draft
state resets on refresh (documented edge case in spec)

**Scale/Scope**: 12-team league, ~100 mock players, single draft session per page load

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery**: ✅ All 5 user stories in spec.md are traceable to specific components
  and acceptance scenarios; no out-of-scope work planned.
- **Frontend/Backend Boundaries**: ✅ Frontend-only implementation; no backend changes; mock data
  via static JS modules; API contract boundary preserved for future real integration.
- **Test Discipline**: ✅ Each user story has independently testable behavior per spec. Plan
  targets unit tests for components and logic (snake order, timer, filter), plus integration tests
  for the draft flow. Target ≥80% coverage on new code.
- **Reliability and Transparency**: ✅ Timer uses setInterval with cleanup on unmount; auto-pick
  on expiry defined in reducer; page refresh resets state (documented in spec edge cases); no
  external data provider risk in this phase.
- **Simplicity and Maintainability**: ✅ useReducer for draft state (predictable transitions);
  presentational component tree with clear prop interfaces; no external state library; CSS follows
  existing App.css global-class pattern.

*Post-design re-check*: ✅ Phase 1 design confirms all principles satisfied. Component tree and
data model are the minimum needed to fulfill all 5 user stories.

## Project Structure

### Documentation (this feature)

```text
specs/005-draft-room/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

Note: No `contracts/` directory — this feature uses mock data only; no new API endpoints.

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── constants/
│   │   ├── routes.js              # Modified: add ROUTES.draftRoom = '/draft-room'
│   │   └── draftMockData.js       # New: mock player pool + 12 fantasy teams
│   ├── pages/
│   │   ├── DraftRoomPage.js       # New: main container (useReducer + timer state)
│   │   └── draftReducer.js        # New: extracted reducer for unit testing
│   ├── components/
│   │   ├── DraftLeagueBar.js      # New: 12-team header bar
│   │   ├── DraftTeamSlot.js       # New: single team slot (initials logo + name)
│   │   ├── DraftRosterPanel.js    # New: selected team's roster list
│   │   ├── DraftPlayerList.js     # New: filterable player pool
│   │   ├── DraftFilters.js        # New: position + NFL team filter controls
│   │   ├── DraftPlayerRow.js      # New: single player row with Draft button
│   │   └── DraftPickTimer.js      # New: countdown timer display
│   ├── App.js                     # Modified: add /draft-room route
│   └── App.css                    # Modified: add draft room component styles
└── src/__tests__/
    ├── DraftRoomPage.test.js       # New: integration tests (CTA → page, draft flow)
    ├── DraftLeagueBar.test.js      # New: unit tests (slots render, click → roster panel)
    ├── DraftPlayerList.test.js     # New: unit tests (filter, draft action)
    ├── DraftPickTimer.test.js      # New: unit tests (countdown, auto-pick trigger)
    └── draftReducer.test.js        # New: unit tests (DRAFT_PLAYER, snake order, AUTO_PICK)
```

**Structure Decision**: Web application (frontend-only, `packages/frontend`). Backend package is
not modified. No `contracts/` directory in this spec (mock-only phase).

## Complexity Tracking

No constitution violations requiring justification.
