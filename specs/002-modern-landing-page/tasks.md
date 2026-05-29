# Tasks: Modern Landing Page Enhancement

**Input**: Design documents from `/specs/002-modern-landing-page/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare frontend structure and feature scaffolding for landing page modernization.

- [ ] T001 Create landing page feature asset directory in packages/frontend/src/assets/landing/
- [ ] T002 Create landing theme token module in packages/frontend/src/constants/landingTheme.js
- [ ] T003 [P] Create landing asset manifest module in packages/frontend/src/constants/landingAssets.js
- [ ] T004 [P] Create telemetry event test fixture file in packages/frontend/src/__tests__/fixtures/landingTelemetryEvents.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared telemetry, device metadata, and reusable CTA primitives before story implementation.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T005 Create telemetry contract guard module aligned with schema in packages/frontend/src/services/landingTelemetryContract.js
- [ ] T006 [P] Create device type detection utility in packages/frontend/src/services/deviceType.js
- [ ] T007 [P] Implement landing telemetry service for page and CTA events in packages/frontend/src/services/landingTelemetryService.js
- [ ] T008 Create reusable primary CTA button component API in packages/frontend/src/components/PrimaryCtaButton.js
- [ ] T009 [P] Create reusable CTA group component shell in packages/frontend/src/components/PrimaryCtaGroup.js
- [ ] T010 Add baseline landing responsive and focus-visible style scaffolding in packages/frontend/src/App.css

**Checkpoint**: Foundation ready; user stories can now be implemented and tested independently.

---

## Phase 3: User Story 1 - Create a Strong First Impression (Priority: P1) 🎯 MVP

**Goal**: Deliver a polished, modern, professional hero experience that communicates football context immediately.

**Independent Test**: Render home route and verify modern hierarchy (headline/subheadline/hero composition) is present and readable without navigating elsewhere.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add hero structure and semantic landmark test coverage in packages/frontend/src/__tests__/HomePage.test.js
- [ ] T012 [P] [US1] Add accessibility assertions for headings and readable content hierarchy in packages/frontend/src/__tests__/HomePage.test.js

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement landing hero section component in packages/frontend/src/components/LandingHeroSection.js
- [ ] T014 [US1] Refactor home page composition to use LandingHeroSection in packages/frontend/src/pages/HomePage.js
- [ ] T015 [US1] Implement modern visual hierarchy styles (typography, spacing, emphasis) in packages/frontend/src/App.css
- [ ] T016 [US1] Add responsive hero layout behavior for desktop/mobile in packages/frontend/src/index.css

**Checkpoint**: User Story 1 is complete and independently demoable as the MVP slice.

---

## Phase 4: User Story 2 - Drive Primary User Actions (Priority: P1)

**Goal**: Make Login, Browse Leagues, and How to Play dominant, keyboard-accessible, and route-compatible CTAs with telemetry.

**Independent Test**: From the landing page alone, verify all three CTAs are prominent, keyboard-focusable, and navigate to expected destinations.

### Tests for User Story 2

- [ ] T017 [P] [US2] Add CTA visibility and prominence assertions in packages/frontend/src/__tests__/HomePage.test.js
- [ ] T018 [P] [US2] Add keyboard focus traversal and focus-visible state tests in packages/frontend/src/__tests__/HomePage.test.js
- [ ] T019 [P] [US2] Add CTA destination routing tests for Login/Browse/How-to-Play in packages/frontend/src/__tests__/App.test.js
- [ ] T020 [P] [US2] Add telemetry payload contract tests for CTA click events in packages/frontend/src/__tests__/landingTelemetryService.test.js

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement primary CTA button behavior and variants in packages/frontend/src/components/PrimaryCtaButton.js
- [ ] T022 [US2] Implement emphasized CTA grouping and layout modes in packages/frontend/src/components/PrimaryCtaGroup.js
- [ ] T023 [US2] Wire CTA group into landing home route with existing route constants in packages/frontend/src/pages/HomePage.js
- [ ] T024 [US2] Implement CTA default/hover/press/focus states with WCAG-compliant contrast in packages/frontend/src/App.css
- [ ] T025 [US2] Emit page_view and CTA click events from landing interactions in packages/frontend/src/pages/HomePage.js
- [ ] T026 [US2] Enforce analytics schema mapping (`event_name`, `device_type`, `cta_id`) in packages/frontend/src/services/landingTelemetryService.js

**Checkpoint**: User Story 2 is complete and independently testable for navigation and interaction outcomes.

---

## Phase 5: User Story 3 - Reinforce Product Theme with Football Visuals (Priority: P2)

**Goal**: Add football-themed graphics/icons that enhance branding while preserving readability and interaction reliability.

**Independent Test**: Verify themed visuals appear on desktop/mobile and confirm CTA usability/readability is preserved when assets fail.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add themed visual rendering tests for hero/supporting areas in packages/frontend/src/__tests__/HomePage.test.js
- [ ] T028 [P] [US3] Add visual asset failure fallback behavior tests in packages/frontend/src/__tests__/HomePage.test.js
- [ ] T029 [P] [US3] Add mobile viewport resilience tests for visual/CTA non-overlap in packages/frontend/src/__tests__/HomePage.test.js

### Implementation for User Story 3

- [ ] T030 [P] [US3] Add local football icons/illustrations to packages/frontend/src/assets/landing/
- [ ] T031 [US3] Implement themed visual asset component with fallback modes in packages/frontend/src/components/ThemedVisualAsset.js
- [ ] T032 [US3] Integrate themed asset composition into LandingHeroSection in packages/frontend/src/components/LandingHeroSection.js
- [ ] T033 [US3] Implement non-obstructive themed visual placement and graceful fallback styles in packages/frontend/src/App.css

**Checkpoint**: User Story 3 is complete and independently testable with resilient themed presentation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, consistency checks, and delivery verification across all stories.

- [ ] T034 [P] Add final landing-page manual validation checklist updates in specs/002-modern-landing-page/quickstart.md
- [ ] T035 [P] Document finalized landing visual guidance and CTA emphasis rules in docs/ui-guidelines.md
- [ ] T036 Add regression assertions for unaffected route behavior in packages/frontend/src/__tests__/App.test.js
- [ ] T037 Verify and tune landing telemetry schema examples and constraints in specs/002-modern-landing-page/contracts/landing-page-analytics.schema.json
- [ ] T038 Run frontend test suite and address landing feature regressions in packages/frontend/src/__tests__/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; can run in parallel with US1 after shared components are available.
- **Phase 5 (US3)**: Depends on Phase 2 completion; can run in parallel with US1/US2 if coordinated.
- **Phase 6 (Polish)**: Depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: No user-story dependency; first MVP slice.
- **US2 (P1)**: No strict dependency on US1, but shares landing component surface.
- **US3 (P2)**: Builds on landing hero structure and can proceed once foundational UI primitives are in place.

### Within Each User Story

- Write/update tests first and confirm they fail for new behavior.
- Implement components/services next.
- Integrate into HomePage routing flow after base pieces exist.
- Re-run story-specific tests before moving to next story.

---

## Parallel Opportunities

- **Setup**: T003 and T004 run in parallel after T001.
- **Foundational**: T006, T007, and T009 can run in parallel; converge before T010.
- **US1**: T011/T012 parallel; T013 can proceed while tests are authored.
- **US2**: T017-T020 parallel as test track; T021 can run parallel with T020.
- **US3**: T027-T029 parallel as test track; T030 parallel with T031.
- **Polish**: T034 and T035 parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel test authoring
Task T011: Update packages/frontend/src/__tests__/HomePage.test.js (hero structure semantics)
Task T012: Update packages/frontend/src/__tests__/HomePage.test.js (readability/accessibility assertions)

# Parallel implementation kickoff
Task T013: Create packages/frontend/src/components/LandingHeroSection.js
Task T016: Update packages/frontend/src/index.css (responsive layout rules)
```

## Parallel Example: User Story 2

```bash
# Parallel test track
Task T017: CTA prominence tests in packages/frontend/src/__tests__/HomePage.test.js
Task T018: Keyboard/focus tests in packages/frontend/src/__tests__/HomePage.test.js
Task T019: Routing tests in packages/frontend/src/__tests__/App.test.js
Task T020: Telemetry tests in packages/frontend/src/__tests__/landingTelemetryService.test.js

# Parallel implementation track
Task T021: Primary CTA component in packages/frontend/src/components/PrimaryCtaButton.js
Task T026: Telemetry schema mapping in packages/frontend/src/services/landingTelemetryService.js
```

## Parallel Example: User Story 3

```bash
# Parallel test + asset preparation
Task T027: Visual rendering tests in packages/frontend/src/__tests__/HomePage.test.js
Task T028: Fallback behavior tests in packages/frontend/src/__tests__/HomePage.test.js
Task T030: Add local assets in packages/frontend/src/assets/landing/
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) as the first shippable increment.
3. Validate US1 independently using quickstart acceptance checks.

### Incremental Delivery

1. Build foundation (Phases 1-2).
2. Ship US1 (first impression).
3. Ship US2 (primary CTA emphasis + navigation + telemetry).
4. Ship US3 (themed visuals + fallbacks).
5. Finish with Phase 6 polish and regression validation.

### Team Parallelization

1. One engineer handles telemetry foundation (T005-T007).
2. One engineer handles CTA component primitives (T008-T009, T021-T024).
3. One engineer handles themed visual implementation (T030-T033).
4. Merge at checkpoints after each story test pass.

---

## Notes

- `[P]` tasks indicate safe parallelism (separate files or no direct blocking dependency).
- `[US1]`, `[US2]`, `[US3]` labels map tasks to independent story delivery.
- Story checkpoints are intended demo/validation gates.
- Keep route compatibility with existing frontend constants and router behavior.
- Keep analytics payloads conformant to the contract schema in `contracts/`.
