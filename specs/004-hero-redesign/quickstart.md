# Quickstart: Hero Section Redesign

## 1. Install and run

1. Install dependencies from repository root:
   - `npm install`
2. Start the frontend development server:
   - `npm run start`
3. Open the app in the browser:
   - `http://localhost:3000`

## 2. Run tests

1. Run all workspace tests:
   - `npm test`
2. Run frontend tests only:
   - `npm run test:frontend`
3. Confirm zero test failures before and after implementing changes.

## 3. Validate user stories manually

### Story 1: First-time visitor sees an engaging hero with photo background
1. Navigate to `http://localhost:3000`.
2. Confirm the hero section displays the football photo as the background image.
3. Confirm a semi-transparent dark overlay is visibly applied over the photo.
4. Confirm the headline reads exactly **"Play Postseason Fantasy Football"**.
5. Confirm no SVG football icon, stadium illustration, or playbook pattern appears in the hero.

### Story 2: Text remains readable over the photo background
1. With the hero rendered, use a browser accessibility panel (e.g., Lighthouse, axe DevTools) to audit contrast.
2. Confirm headline, subheadline, and badge label all achieve ≥4.5:1 contrast ratio.
3. Simulate image load failure (e.g., temporarily rename `football-hero-img.jpg`) and confirm the navy gradient fallback (`linear-gradient(135deg, #1a1a2e, #0a3d62)`) renders with readable text.

### Story 3: CTA buttons are visually upgraded and remain accessible
1. Confirm "Browse Leagues" and "How to Play" buttons display with an orange gradient fill and elevated shadow.
2. Tab to each button using keyboard and confirm a visible focus ring is present.
3. Activate each CTA and confirm routing: "Browse Leagues" → `/leagues`, "How to Play" → `/how-to-play`.

### Story 4: Existing automated tests continue to pass
1. Apply all code changes.
2. Run `npm run test:frontend`.
3. Confirm all tests pass with zero modifications to test files.

## 4. Accessibility checks

1. Run a Lighthouse accessibility audit on the home page and confirm no new contrast violations.
2. Verify all hero text meets WCAG 2.1 AA (≥4.5:1 for normal text, ≥3:1 for large text) with the overlay applied.
3. Check CTA focus indicators are visible at sufficient contrast with keyboard navigation.

## 5. Reduced motion check

1. In macOS System Preferences → Accessibility → Display, enable "Reduce Motion".
2. Reload the page and hover over CTA buttons.
3. Confirm no transition animation occurs on hover/active states.

## 6. Definition of done for this feature slice

- [ ] `.landing-hero` displays `football-hero-img.jpg` as CSS background with `background-size: cover`.
- [ ] Dark semi-transparent overlay is applied via `.landing-hero::before`.
- [ ] `LANDING_THEME.headline` reads "Play Postseason Fantasy Football".
- [ ] `LANDING_ASSETS` is an empty array; no SVG assets render in the hero.
- [ ] `ThemedVisualAsset` import and `themed-asset-wrap` div are fully removed from `LandingHeroSection.js`.
- [ ] `.primary-cta-secondary` has orange gradient fill with elevated box shadow.
- [ ] CTA buttons retain existing `id`, routing, and telemetry behavior.
- [ ] Navy gradient fallback renders when image fails to load.
- [ ] `@media (prefers-reduced-motion: reduce)` suppresses CTA transition animations.
- [ ] All frontend tests pass with no modifications to test files.
- [ ] All hero text achieves ≥4.5:1 WCAG AA contrast ratio.
