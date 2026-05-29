# Implementation Plan: Draft Room Enhancements

**Branch**: `006-draft-room-enhancements` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-draft-room-enhancements/spec.md`

## Summary

Enhance the Draft Room with two additions: (1) an "on the clock" indicator that highlights the
active team in the league header bar with a distinct border/background and a bold "ON THE CLOCK"
label below the team slot, automatically advancing after each pick; and (2) mock NFL season
statistics (TDs, Pass Yards, Rush Yards, Rec Yards) displayed as inline columns on each player
row in the player list. Stats are position-appropriate integer constants embedded directly in
`draftMockData.js` (deterministic by design). All changes are frontend-only in `packages/frontend`.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2

**Primary Dependencies**: React, react-router-dom 6.26, @testing-library/react 13 (test), Jest 27
(via react-scripts)

**Storage**: In-memory React state (useReducer) — no persistence; stat values are compile-time
integer constants in `draftMockData.js`

**Testing**: Jest + @testing-library/react; `CI=1 npm test -- --watchAll=false` in `packages/frontend`

**Target Platform**: Web SPA (Create React App, `packages/frontend`)

**Project Type**: Frontend web application (monorepo package, frontend only)

**Performance Goals**: Active team highlight updates within one rendered frame of a pick completing;
stat rendering has no perceptible delay (synchronous, pre-computed constants)

**Constraints**: No new npm dependencies; no backend changes; deterministic stat values (compile-time
integer literals per player); draft state resets on refresh (existing documented edge case)

**Scale/Scope**: 12 fantasy teams, ~100 mock players with 4 stat fields each

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery**: ✅ All requirements (FR-001–FR-012, NFR-001–NFR-004) in spec.md are
  traceable to specific component and data changes. No out-of-scope work planned.
- **Frontend/Backend Boundaries**: ✅ Frontend-only changes; no backend endpoints added; mock stat
  data lives in the frontend constants module; API contract boundary unchanged.
- **Test Discipline**: ✅ Both user stories have independently testable acceptance scenarios. Tests
  planned for `DraftTeamSlot` (isActive prop), `DraftLeagueBar` (activeTeamId propagation,
  draftComplete), `DraftPlayerRow` (stat columns), and `DraftPlayerList` (stats visible after
  filter). Coverage impact: positive.
- **Reliability and Transparency**: ✅ Stat values are compile-time integer constants, ensuring
  deterministic behavior across renders (FR-011, NFR-003). Active team index uses the existing
  tested `getActiveTeam()` function.
- **Simplicity and Maintainability**: ✅ Minimal additions — `isActive` prop on `DraftTeamSlot`,
  `activeTeamId`+`draftComplete` on `DraftLeagueBar`, 4 stat fields on player objects, 4 stat
  columns in `DraftPlayerRow`. No new abstractions introduced.

## Project Structure

### Documentation (this feature)

```text
specs/006-draft-room-enhancements/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/src/
├── components/
│   ├── DraftTeamSlot.js      ← Add isActive prop, --active CSS class, "ON THE CLOCK" label
│   ├── DraftLeagueBar.js     ← Add activeTeamId + draftComplete props; derive isActive per slot
│   └── DraftPlayerRow.js     ← Add 4 stat columns (TDs, Pass Yds, Rush Yds, Rec Yds)
├── constants/
│   └── draftMockData.js      ← Add touchdowns, passYards, rushYards, recYards to each player
└── pages/
    └── DraftRoomPage.js      ← Derive activeTeamId from getActiveTeam(); pass to DraftLeagueBar

packages/frontend/src/__tests__/
├── DraftTeamSlot.test.js     ← NEW: tests for isActive prop and "ON THE CLOCK" label
├── DraftLeagueBar.test.js    ← EXTEND: tests for activeTeamId, draftComplete banner
├── DraftPlayerRow.test.js    ← NEW: tests for stat columns per position
└── DraftPlayerList.test.js   ← EXTEND: verify stats remain visible after position filter
```

**Structure Decision**: Web application (Option 2 pattern). Frontend package only; no backend
changes required.

## Complexity Tracking

*No constitution violations requiring justification.*
