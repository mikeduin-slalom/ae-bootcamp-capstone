# Implementation Plan: NFL Team Logo Sync & Draft Room Display

**Branch**: `008-nfl-logo-sync` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-nfl-logo-sync/spec.md`

## Summary

Introduce a developer-run sync script (`packages/backend/scripts/syncNflLogos.js`) that fetches
all 32 NFL teams from the ESPN public teams API, downloads each team's PNG logo, and writes it to
`packages/frontend/public/logos/nfl/<abbr>.png`. Team metadata (ESPN ID, name, abbreviation,
colors, logo path) is persisted in a new `nfl_teams` SQLite table and exposed via a new public
`GET /api/nfl-teams` endpoint. The Draft Room is updated to display each player's team logo and
abbreviation side by side with a text fallback for missing logos. The NFL team filter gains logo
thumbnails per team option.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+, ES2020), React 18.2

**Primary Dependencies**: Express 4.18 (backend API), better-sqlite3 11.10 (nfl_teams table),
React 18.2 + react-router-dom 6.26 (frontend), axios 1.9 (frontend HTTP), Node built-in
`https`/`fs` modules (sync script — no new npm packages required)

**Storage**: SQLite via better-sqlite3 for the `nfl_teams` table (first active use in this
project); PNG files stored at `packages/frontend/public/logos/nfl/` and served as static browser
assets by Create React App

**Testing**: Backend — Jest + supertest (`CI=1 npm test -- --watchAll=false` in
`packages/backend`); Frontend — Jest + @testing-library/react (`CI=1 npm test -- --watchAll=false`
in `packages/frontend`)

**Target Platform**: Web SPA (Create React App, `packages/frontend`) + Express API
(`packages/backend`)

**Project Type**: Full-stack web application (monorepo; new backend CLI script + new API endpoint
+ frontend Draft Room UI enhancements)

**Performance Goals**: 500ms delay between individual logo downloads during sync; logos served as
static assets at runtime with no per-request external calls; total sync for 32 teams acceptable
up to a few minutes

**Constraints**: No AWS/S3; no new npm packages (Node built-in `https`/`fs` for sync,
better-sqlite3 already installed, axios already in frontend); logo files stored as PNG under
frontend `public/logos/nfl/`

**Scale/Scope**: 32 NFL teams; sync is a one-time developer CLI operation; no pagination required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery**: ✅ All requirements (FR-001–FR-010, NFR-001–NFR-005) in spec.md are
  traceable to specific new files and changes listed in Project Structure below. No out-of-scope
  work is planned.
- **Frontend/Backend Boundaries**: ✅ The new `GET /api/nfl-teams` endpoint is documented in an
  OpenAPI contract. The frontend consumes it only through a dedicated `nflTeamsService`. The sync
  script is a backend-only CLI tool that writes directly to the frontend `public/` directory as a
  developer operation; no frontend code calls the sync script.
- **Test Discipline**: ✅ All three user stories have independently testable acceptance scenarios.
  Tests planned for `DraftPlayerRow` (logo display, alt text, fallback on error),
  `DraftFilters` (team logo thumbnails), `DraftRoomPage` (nfl teams fetch, logo lookup by
  abbreviation), and backend `app.test.js` for `GET /api/nfl-teams`. Coverage impact: positive.
- **Reliability and Transparency**: ✅ Sync script handles per-team failures gracefully (continues
  on error, reports summary at completion — NFR-005). Draft Room degrades cleanly when logos are
  absent via `onError` fallback (NFR-002). Missing directory detected early with a clear error
  message.
- **Simplicity and Maintainability**: ✅ One new script, one new service file, one new API
  endpoint, one new DB table. Frontend changes are confined to three existing component/page files
  plus one new service module. No new abstractions beyond what is necessary.

## Project Structure

### Documentation (this feature)

```text
specs/008-nfl-logo-sync/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── nfl-logo-sync.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/backend/
├── scripts/
│   └── syncNflLogos.js              ← NEW: CLI sync script; run via `npm run sync:nfl-logos`
├── src/
│   ├── app.js                       ← ADD GET /api/nfl-teams (public, no auth required)
│   └── services/
│       └── nflTeamsStore.js         ← NEW: better-sqlite3 DB init + nfl_teams CRUD helpers

packages/frontend/public/logos/nfl/  ← NEW: directory created by sync script; PNG per team abbr

packages/frontend/src/
├── components/
│   ├── DraftPlayerRow.js            ← UPDATE: add <img> logo + abbreviation + onError fallback
│   └── DraftFilters.js              ← UPDATE: show logo thumbnail per NFL team option
├── pages/
│   └── DraftRoomPage.js             ← UPDATE: fetch NFL teams; pass logoUrl map to children
└── services/
    └── nflTeamsService.js           ← NEW: fetchNflTeams() → GET /api/nfl-teams

packages/frontend/src/__tests__/
├── DraftPlayerRow.test.js           ← UPDATE: logo display, alt text, fallback behavior
├── DraftFilters.test.js             ← UPDATE: team logo thumbnails in filter options
└── DraftRoomPage.test.js            ← UPDATE: nfl teams fetch, logo lookup by abbreviation

packages/backend/__tests__/
└── app.test.js                      ← UPDATE: GET /api/nfl-teams returns team array
```

**Structure Decision**: Web application (Option 2). Backend gains a `scripts/` directory for the
standalone sync CLI (standard Node.js pattern) alongside a new `nflTeamsStore.js` service that
initialises the SQLite database file and provides CRUD helpers. Frontend adds `nflTeamsService.js`
and updates Draft Room components in-place.
