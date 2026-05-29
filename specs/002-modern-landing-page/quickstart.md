# Quickstart: Modern Landing Page Enhancement

## 1. Install and run

1. Install dependencies from repository root:
   - `npm install`
2. Start frontend and backend workspaces:
   - `npm run start`
3. Open the app in browser:
   - `http://localhost:3000`

## 2. Run tests

1. Run all workspace tests:
   - `npm test`
2. Run frontend tests only:
   - `npm run test:frontend`
3. Optionally run backend tests to confirm no regressions:
   - `npm run test:backend`

## 3. Validate user stories manually

### Story 1: Strong first impression
1. Load the landing page as a first-time user.
2. Confirm modern, professional visual hierarchy (headline, subheadline, CTA focus).
3. Confirm football-themed visuals are present and do not obscure key text.

### Story 2: Primary CTA clarity and navigation
1. Confirm `Login`, `Browse Leagues`, and `How to Play` are all visible without deep scrolling on desktop and mobile viewport presets.
2. Activate each CTA and verify route destination behavior remains compatible with existing app routes.
3. Verify default, hover/press, and focus-visible states for all three CTAs.

### Story 3: Themed visuals with resilient fallback
1. Simulate one or more asset load failures (for example by temporarily renaming local asset path).
2. Confirm content remains readable and all primary CTAs remain usable.
3. Confirm no broken-state layout overlap with CTA controls.

## 4. Accessibility and performance checks

1. Use keyboard-only navigation to tab through all primary actions; confirm visible focus indicators.
2. Verify contrast for CTA labels and primary text meets WCAG 2.1 AA targets.
3. Validate that all three CTAs are visible and clickable within 3 seconds for normal local test conditions.

## 5. Observability checks

1. Confirm one `page_view` event is emitted on landing page load.
2. Confirm each CTA click emits its corresponding event:
   - `cta_login_click`
   - `cta_browse_leagues_click`
   - `cta_how_to_play_click`
3. Confirm each event includes `device_type` and route context as specified in the contract.

## 6. Definition of done for this feature slice

- All acceptance scenarios in the feature specification pass.
- Frontend test suite passes with repository coverage threshold maintained.
- Landing analytics payloads conform to the feature contract.
- Constitution gates remain satisfied in implementation and review.
