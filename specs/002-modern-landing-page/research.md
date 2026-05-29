# Research: Modern Landing Page Enhancement

## Decision 1: Keep implementation frontend-local and route-compatible
- Decision: Implement the enhancement inside existing frontend route/component structure, centered on `HomePage` and shared app styles, while preserving existing CTA destinations.
- Rationale: FR-010 requires route compatibility and the current architecture already supports page-level routing through `react-router-dom`.
- Alternatives considered:
  - Introduce new route paths for CTA destinations: rejected because it risks regressions against existing flows.
  - Add backend-driven content assembly for landing page: rejected as unnecessary for this UI-focused feature.

## Decision 2: Use locally packaged football assets only
- Decision: Use football-themed icons/graphics bundled with the app build (for example, SVG/PNG under frontend source assets) and avoid runtime external media dependencies.
- Rationale: Meets clarification and NFR-004 security constraints while keeping load behavior deterministic.
- Alternatives considered:
  - Load icons from third-party CDN: rejected due to trust and availability risk.
  - Pure emoji/text treatment for football theme: rejected because it is unlikely to satisfy the desired polished visual outcome.

## Decision 3: Emphasize primary CTAs through hierarchy, not clutter
- Decision: Design a clear hero hierarchy with the three primary CTAs as dominant interactive elements, including distinct default/hover/focus states and keyboard visibility.
- Rationale: Directly satisfies FR-003, FR-004, FR-006, and NFR-003 while keeping readability high.
- Alternatives considered:
  - Add many competing secondary links in hero: rejected because it dilutes CTA emphasis.
  - Use decorative-heavy hero with subdued buttons: rejected due to lower action discoverability.

## Decision 4: Define graceful degradation for missing decorative assets
- Decision: Treat football visuals as supportive decoration with resilient fallbacks so text content and CTAs remain fully usable when graphics fail.
- Rationale: Required by FR-007 and FR-008 and aligned with reliability expectations.
- Alternatives considered:
  - Block render until all visuals load: rejected because it harms perceived performance and CTA availability.
  - Hide primary hero section on asset error: rejected because it breaks core landing behavior.

## Decision 5: Instrument analytics with explicit CTA event contract
- Decision: Capture `page_view`, `cta_login_click`, `cta_browse_leagues_click`, and `cta_how_to_play_click` with `device_type` and route metadata using a documented event schema.
- Rationale: Satisfies NFR-005 and gives measurable success feedback for SC-003 and SC-005.
- Alternatives considered:
  - Track only aggregate page view: rejected because CTA-level attribution is required.
  - Track events with ad hoc payloads: rejected due to inconsistent observability and harder downstream analysis.