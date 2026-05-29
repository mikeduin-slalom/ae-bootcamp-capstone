# Implementation Plan: Leagues Table View

**Branch**: `007-leagues-table-view` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-leagues-table-view/spec.md`

## Summary

Replace the existing split-list Leagues page (separate Joinable / Private sections) with a single
unified, semantically accessible HTML table. Each row shows: League Name, a Public/Private badge,
a mock Commissioner name, a formatted mock Draft Start date/time, and a context-sensitive Action
cell ("Sign Up", "Request to Join" + invite link, or "Joined"). A new authenticated
`GET /api/leagues/my` backend endpoint returns the current user's joined league IDs; the frontend
fetches it in parallel with `listLeagues` via `Promise.all` to determine per-row membership status
client-side. All mock data (commissioner names, draft start times) is a static lookup in
`packages/frontend/src/constants/leaguesMockData.js`.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2

**Primary Dependencies**: React, react-router-dom 6.26, @testing-library/react 13 (test), Jest 27
(via react-scripts)

**Storage**: In-memory React state (useState) — no persistence; mock commissioner and draft-time
data live as compile-time constants in `leaguesMockData.js`

**Testing**: Jest + @testing-library/react; `CI=1 npm test -- --watchAll=false` in
`packages/frontend`; `CI=1 npm test -- --watchAll=false` in `packages/backend`

**Target Platform**: Web SPA (Create React App, `packages/frontend`) + Express API
(`packages/backend`)

**Project Type**: Full-stack web application (monorepo; frontend + minimal backend endpoint
addition)

**Performance Goals**: Parallel `Promise.all([listLeagues(), listMyLeagues()])` fetch; table
renders in the same frame budget as the existing list layout

**Constraints**: No new npm dependencies; mock data is compile-time static; backend change is
strictly additive (new route only, no changes to existing routes or data shapes)

**Scale/Scope**: 3–10 leagues typical; no pagination needed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery**: ✅ All requirements (FR-001–FR-013, NFR-001–NFR-005) in spec.md are
  traceable to specific component, service, and backend changes. No out-of-scope work planned.
- **Frontend/Backend Boundaries**: ✅ The new `GET /api/leagues/my` backend endpoint is additive;
  its contract is documented in `contracts/leagues-table-view.openapi.yaml`. The frontend consumes
  it only through the `leaguesService` abstraction.
- **Test Discipline**: ✅ All four user stories have independently testable acceptance scenarios.
  Tests planned for `LeaguesTable` (columns, badges, action buttons, "Joined" state),
  `LeaguesPage` (parallel fetch, empty state, error feedback), and backend `app.test.js` for
  `GET /api/leagues/my`. Coverage impact: positive.
- **Reliability and Transparency**: ✅ Parallel fetch via `Promise.allSettled`; a rejected
  `listMyLeagues` call degrades gracefully (defaults to empty joined set so action buttons still
  render). `FeedbackBanner` continues to surface all error/warning/success messages.
- **Simplicity and Maintainability**: ✅ One new component (`LeaguesTable`), one new constants
  file (`leaguesMockData.js`), one new service function (`listMyLeagues`), one new backend route.
  No new abstractions beyond what is necessary.

## Project Structure

### Documentation (this feature)

```text
specs/007-leagues-table-view/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── leagues-table-view.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/backend/src/
├── app.js                           ← ADD GET /api/leagues/my (authenticated)
└── services/
    └── leagueAccessService.js       ← ADD getUserLeagueIds(userId) helper

packages/frontend/src/
├── components/
│   └── LeaguesTable.js              ← NEW: table rendering (columns, badges, action cell)
├── constants/
│   └── leaguesMockData.js           ← NEW: static commissioner names + draft start times
├── pages/
│   └── LeaguesPage.js               ← REFACTOR: parallel fetch, replace list with <LeaguesTable>
└── services/
    └── leaguesService.js            ← ADD listMyLeagues()

packages/frontend/src/__tests__/
├── LeaguesPage.test.js              ← UPDATE: parallel fetch, table queries, joined-state
└── LeaguesTable.test.js             ← NEW: unit tests for table component

packages/backend/__tests__/
└── app.test.js                      ← ADD: GET /api/leagues/my tests
```

**Structure Decision**: Web application (Option 2 pattern). One new authenticated backend
endpoint and a frontend table component replacement. Both `packages/frontend` and
`packages/backend` have minimal, scoped changes.

## Complexity Tracking

*No constitution violations requiring justification.*
