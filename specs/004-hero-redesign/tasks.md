# Tasks: Hero Section Redesign

**Input**: Design documents from `/specs/004-hero-redesign/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Manual and automated test tasks included for each user story. No test files are to be modified.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Confirm local dev environment is ready (`npm install`, `npm run start`) in project root
- [ ] T002 [P] Validate presence of football hero image at packages/frontend/src/assets/landing/football-hero-img.jpg

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 [P] Ensure all existing frontend tests pass before changes by running `npm run test:frontend` in packages/frontend

---

## Phase 3: User Story 1 - Engaging hero with photo background (Priority: P1) 🎯 MVP

**Goal**: Home page hero displays football photo, new headline, no SVG assets, upgraded CTA buttons
**Independent Test**: Load home page, confirm hero section matches spec (photo, headline, no SVG, styled CTAs)

- [ ] T004 [P] [US1] Update LandingHeroSection.js to remove ThemedVisualAsset import, themed-asset-wrap div, and assets prop in packages/frontend/src/components/LandingHeroSection.js
- [ ] T005 [P] [US1] Update headline to "Play Postseason Fantasy Football" in packages/frontend/src/constants/landingTheme.js
- [ ] T006 [P] [US1] Set LANDING_ASSETS to empty array in packages/frontend/src/constants/landingAssets.js
- [ ] T007 [P] [US1] Update .landing-hero CSS for background image and fallback gradient in packages/frontend/src/App.css
- [ ] T008 [P] [US1] Update .landing-hero::before overlay for dark semi-transparent contrast in packages/frontend/src/App.css
- [ ] T009 [P] [US1] Update .primary-cta-secondary for orange gradient, box shadow, and hover/active states in packages/frontend/src/App.css
- [ ] T010 [P] [US1] Scope CTA transition animations to @media (prefers-reduced-motion: no-preference) in packages/frontend/src/App.css
- [ ] T011 [US1] Manual test: Home page hero renders as specified (photo, headline, no SVG, styled CTAs)

---

## Phase 4: User Story 2 - Text remains readable (Priority: P1)

**Goal**: All hero text achieves ≥4.5:1 contrast over background/overlay
**Independent Test**: Use accessibility checker to verify contrast

- [ ] T012 [P] [US2] Verify overlay opacity and text color in App.css for WCAG AA compliance in packages/frontend/src/App.css
- [ ] T013 [US2] Manual test: Run accessibility audit (Lighthouse/axe) for contrast

---

## Phase 5: User Story 3 - CTA buttons accessible and functional (Priority: P2)

**Goal**: CTA buttons retain focus, routing, telemetry, and accessibility
**Independent Test**: Tab to CTAs, check focus ring, activate, confirm navigation and telemetry

- [ ] T014 [P] [US3] Confirm CTA button focus indicators are visible and meet contrast in packages/frontend/src/App.css
- [ ] T015 [US3] Manual test: Tab/activate CTAs, confirm navigation and telemetry unchanged

---

## Phase 6: User Story 4 - All tests pass (Priority: P1)

**Goal**: No test files changed, all tests pass
**Independent Test**: Run `npm run test:frontend` after changes

- [ ] T016 [P] [US4] Run frontend test suite after changes, confirm zero failures in packages/frontend

---

## Final Phase: Polish & Cross-Cutting

- [ ] T017 [P] Review for dead code, unused imports, and spec conformance in all 4 files
- [ ] T018 [P] Manual test: Simulate image load failure, confirm navy gradient fallback in packages/frontend/src/App.css
- [ ] T019 [P] Manual test: Enable "Reduce Motion" in OS, confirm no CTA animation in packages/frontend/src/App.css

---

## Dependencies

- T001 → T002 → T003 → [T004–T010] (parallel) → [T011–T019] (parallel)

## Parallel Execution Examples

- T004–T010 can be implemented in parallel (different files)
- T011–T019 (manual/test/polish) can be executed in parallel after implementation

## Implementation Strategy

- MVP: Complete all Phase 3 (User Story 1) tasks for a functional, testable hero redesign
- Each user story phase includes a manual or automated test task for independent verification

---

**All tasks follow strict checklist format.**