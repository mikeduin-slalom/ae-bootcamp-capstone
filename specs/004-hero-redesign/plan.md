# Implementation Plan: Hero Section Redesign

**Branch**: `004-hero-redesign` | **Date**: 2026-05-29 | **Spec**: [specs/004-hero-redesign/spec.md](spec.md)

**Input**: Feature specification from `specs/004-hero-redesign/spec.md`

## Summary

Replace the `LandingHeroSection` light gradient + SVG asset treatment with a local football photo background, a dark overlay for WCAG AA contrast, an updated headline ("Play Postseason Fantasy Football"), removal of all `ThemedVisualAsset` rendering, and upgraded orange-gradient CTA buttons — with no backend changes and no test file modifications.

## Technical Context

**Language/Version**: JavaScript (ES2020), React 17, CSS3

**Primary Dependencies**: React, react-router-dom (existing); no new dependencies required

**Storage**: N/A — pure frontend UI/CSS change

**Testing**: Jest + React Testing Library (existing frontend test suite via `npm run test:frontend`)

**Target Platform**: Web browser — Chrome, Firefox, Safari, Edge (latest 2 versions each)

**Project Type**: Web application — frontend-only change within `packages/frontend`

**Performance Goals**: Background image loaded as CSS `background-image` (not `<img>`); LCP behavior unchanged; image layer hides behind navy gradient until loaded

**Constraints**: No test files modified; WCAG 2.1 AA contrast (≥4.5:1) required for all hero text; `prefers-reduced-motion` must suppress CTA transitions

**Scale/Scope**: 4 files modified — `LandingHeroSection.js`, `landingTheme.js`, `landingAssets.js`, `App.css`; no new files created

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Delivery** ✅ — All 8 functional requirements and 5 NFRs trace directly to the approved spec. No out-of-scope additions. All 4 user stories map to concrete acceptance scenarios.
- **Frontend/Backend Boundaries** ✅ — Pure frontend change. No backend services, API routes, or contracts are modified. No new dependencies cross the package boundary.
- **Test Discipline** ✅ — FR-008 / SC-005 explicitly require all existing frontend tests to continue passing without modification. Coverage is not reduced because no new behavioral logic is added — only CSS and constant changes.
- **Reliability and Transparency** ✅ — NFR-004 documents the image fallback (navy gradient). NFR-005 documents reduced-motion behavior. Edge cases for slow image load and blocked image are addressed in spec and research.
- **Simplicity and Maintainability** ✅ — Change is the minimal viable approach: 4 files, no new components, no new abstractions. ThemedVisualAsset is *removed* (complexity reduction). CSS pseudo-element pattern reused from existing `.landing-hero::before`.

## Project Structure

### Documentation (this feature)

```text
specs/004-hero-redesign/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   └── LandingHeroSection.js     # Remove ThemedVisualAsset import + themed-asset-wrap div; remove assets prop
│   ├── constants/
│   │   ├── landingTheme.js           # Change headline to "Play Postseason Fantasy Football"
│   │   └── landingAssets.js          # Empty LANDING_ASSETS to []
│   └── App.css                       # Update .landing-hero background, .landing-hero::before overlay,
│                                     # .primary-cta-secondary gradient, reduce-motion scoping
└── __tests__/                        # No changes to any test files (FR-008)
```

**Structure Decision**: Frontend-only modification targeting 4 existing source files within `packages/frontend/src`. No new files, no new components, no backend changes. No API contracts affected — this feature has no external interface changes.

## Complexity Tracking

No constitution violations — no entries required.
