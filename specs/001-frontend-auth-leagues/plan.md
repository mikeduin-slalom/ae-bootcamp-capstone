# Implementation Plan: Frontend Auth and League Access

**Branch**: `001-initial-ui-setup` | **Date**: 2026-05-29 | **Spec**: `specs/001-frontend-auth-leagues/spec.md`

**Input**: Feature specification from `specs/001-frontend-auth-leagues/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Deliver a basic but production-aligned frontend entry experience with Homepage, Login,
Leagues, and How to Play pages. Users can browse leagues while signed out, must authenticate
with email/password to join leagues, and private leagues support invitation-link acceptance
and request-to-join flows. Implementation will preserve frontend/backend package boundaries,
add explicit API contracts for auth and league access, and include test coverage for each
user story with resilient error handling and observable auth/join events.

## Technical Context

**Language/Version**: JavaScript (Node.js 16+ runtime, React 18 frontend, Express 4 backend)

**Primary Dependencies**: React, react-scripts, Express, cors, morgan, better-sqlite3, axios

**Storage**: SQLite (better-sqlite3) for backend persistence; static content for How to Play may be file- or DB-backed

**Testing**: Jest, React Testing Library (frontend), Supertest (backend)

**Target Platform**: Modern desktop/mobile browsers + local Node.js API server

**Project Type**: Web application (monorepo with separate frontend and backend packages)

**Performance Goals**: Primary pages usable within 3 seconds for p95 requests; auth/join interactions provide immediate feedback

**Constraints**: Preserve package boundaries, enforce auth on membership actions, WCAG 2.2 AA keyboard/contrast support, maintain >=80% coverage

**Scale/Scope**: MVP entry slice covering 4 pages, email/password auth, guest league discovery, and two private-league access pathways

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec-Driven Delivery: PASS. Plan traces directly to `specs/001-frontend-auth-leagues/spec.md` and aligns with docs-defined MVP behaviors.
- Frontend/Backend Boundaries: PASS. Frontend page flows and backend auth/league APIs are separated via explicit contract artifact.
- Test Discipline: PASS. Unit/integration strategy defined per story in quickstart; repository coverage target maintained.
- Reliability and Transparency: PASS. Error states, denied/pending join paths, and auth/join event observability are included.
- Simplicity and Maintainability: PASS. Uses existing React + Express stack and incremental route/page additions without speculative abstractions.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-auth-leagues/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   └── index.js
│   └── __tests__/
│       └── app.test.js
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   └── __tests__/
    │       └── App.test.js
    └── public/
        └── index.html
```

**Structure Decision**: Use the existing npm-workspaces web monorepo structure in `packages/frontend` and `packages/backend`; add feature pages/components and API routes within those package boundaries while keeping contracts documented in `specs/001-frontend-auth-leagues/contracts/`.

## Complexity Tracking

No constitution violations identified; no complexity exemptions required.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Post-Design Constitution Check

- Spec-Driven Delivery: PASS. `research.md`, `data-model.md`, `quickstart.md`, and API contracts remain traceable to approved feature stories.
- Frontend/Backend Boundaries: PASS. Public/private responsibilities remain separated across `packages/frontend` and `packages/backend` with explicit interface contract.
- Test Discipline: PASS. Story-level validation steps and package-level test commands are documented; no reduction in coverage expectations.
- Reliability and Transparency: PASS. Contract and model include failure outcomes for auth, invitation, and request-to-join paths with observable events.
- Simplicity and Maintainability: PASS. Design keeps to existing stack and project conventions with minimal new abstractions.
