# Feature Specification: Hero Section Redesign

**Feature Branch**: `004-hero-redesign`

**Created**: 2026-05-29

**Status**: Draft

**Input**: Update the home page hero section with a photographic background image, revised headline, removal of decorative SVG assets, and upgraded CTA button styling.

## Clarifications

### Session 2026-05-29

- Q: What specific CSS fallback should the hero display when the external background image fails to load? → A: Dark navy gradient matching existing theme (e.g., `linear-gradient(135deg, #1a1a2e, #0a3d62)`)
- Q: Should the background image use the external URL or a local asset? → A: Use local asset at `assets/landing/football-hero-img.jpg`
- Q: What visual treatment should the upgraded CTA buttons use? → A: Gradient fill (e.g., `linear-gradient(135deg, #f5a623, #e8890c)`) with elevated box shadow
- Q: How should SC-004's reviewer rating success criterion be validated? → A: PR reviewer approval — at least one approving reviewer confirms buttons are visually improved
- Q: Should `ThemedVisualAsset` import be fully removed or conditionally kept? → A: Remove the import and all references from `LandingHeroSection.js` entirely

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-time visitor sees an engaging hero with photo background (Priority: P1)

A prospective user lands on the home page for the first time. The hero section displays a football action photo as a background, creating an immediate visual impression of the product's theme. The headline clearly communicates the product name, and the CTA buttons are visually prominent against the photo background.

**Why this priority**: The hero is the primary impression for new visitors. A compelling visual treatment directly impacts conversion to registration or league browsing.

**Independent Test**: Navigate to the home page in a browser and confirm the hero section renders with the background photo, the revised headline text, and styled CTA buttons — without any SVG icon or illustration elements.

**Acceptance Scenarios**:

1. **Given** a user navigates to the home page, **When** the page finishes loading, **Then** the hero section background displays the football photo image from the external URL with a semi-transparent dark overlay visible on top of it.
2. **Given** a user views the hero section, **When** they read the main headline, **Then** it reads exactly "Play Postseason Fantasy Football".
3. **Given** a user views the hero section, **When** they inspect the visual layout, **Then** no SVG football icon, stadium illustration, or playbook pattern decorative elements are present anywhere in the hero.
4. **Given** a user views the hero section, **When** they look at the CTA buttons ("Browse Leagues" and "How to Play"), **Then** both buttons display with a visually upgraded style (gradient fill, prominent shadow, or distinct accent color) that stands out against the photo background.

---

### User Story 2 - Text remains readable over the photo background (Priority: P1)

A user views the hero on any supported screen size. The overlay on the background photo ensures sufficient contrast between the background and all text elements (headline, subheadline, badge) so that content is legible.

**Why this priority**: Accessibility and readability are non-negotiable for any content change. WCAG AA compliance is a baseline requirement.

**Independent Test**: Use an accessibility contrast checker on the rendered hero with the photo background and overlay applied, and verify all text elements meet WCAG AA contrast ratios.

**Acceptance Scenarios**:

1. **Given** the hero section is rendered with the background photo, **When** an automated accessibility audit is run, **Then** all foreground text (headline, subheadline, badge label) achieves at least 4.5:1 contrast ratio against the background.
2. **Given** the background image fails to load (network error or blocked external URL), **When** the hero renders, **Then** a fallback background color or gradient ensures text remains readable at WCAG AA contrast levels.

---

### User Story 3 - CTA buttons remain accessible and functional (Priority: P2)

A user interacts with the upgraded CTA buttons using mouse, keyboard, or assistive technology. The visual upgrade does not break button accessibility, keyboard focus indicators, or navigation routing.

**Why this priority**: Style changes must not regress existing interaction behavior. CTA function is critical to user journeys.

**Independent Test**: Tab through the page and activate each CTA button via keyboard; verify navigation works and focus rings are visible.

**Acceptance Scenarios**:

1. **Given** a user focuses a CTA button via keyboard, **When** they view the button, **Then** a visible focus indicator is present and meets WCAG AA focus contrast requirements.
2. **Given** a user clicks or activates "Browse Leagues", **When** the action fires, **Then** the user is navigated to the leagues page and the telemetry click event is tracked as before.
3. **Given** a user clicks or activates "How to Play", **When** the action fires, **Then** the user is navigated to the how-to-play page and the telemetry click event is tracked as before.

---

### User Story 4 - Existing automated tests continue to pass (Priority: P1)

A developer applies the hero redesign changes. All pre-existing frontend unit and component tests pass without modification to test files.

**Why this priority**: Test regression is a blocking concern for merge. The spec must constrain the implementation to not break existing test assertions.

**Independent Test**: Run the full frontend test suite after implementing all changes and confirm zero failing tests.

**Acceptance Scenarios**:

1. **Given** all code changes from this spec are applied, **When** the frontend test suite is executed, **Then** all tests pass with no failures or skipped tests introduced by this change.
2. **Given** the `LandingHeroSection` component is updated, **When** tests that render it (e.g., `App.test.js`, `HomePage.test.js`) run, **Then** they pass without changes to the test files.

---

### Edge Cases

- What happens when the local background image fails to load (missing file, build error)? The hero must degrade gracefully with the dark navy gradient fallback (`linear-gradient(135deg, #1a1a2e, #0a3d62)`) that still passes contrast requirements.
- What if a user has "prefers-reduced-motion" set? Transition animations on CTA buttons should respect this media query and not animate.
- What if the local image is slow to load (large file size)? The navy gradient fallback background should display until the image loads so the hero does not flash blank white.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `.landing-hero` section MUST display the local image at `assets/landing/football-hero-img.jpg` as a CSS background image.
- **FR-002**: The background image MUST be covered by a semi-transparent dark overlay so that all hero text remains readable and meets WCAG AA contrast (minimum 4.5:1 for normal text).
- **FR-003**: The `headline` value in `landingTheme.js` MUST be changed to "Play Postseason Fantasy Football".
- **FR-004**: The `LANDING_ASSETS` array in `landingAssets.js` MUST be cleared of all entries (or left as an empty array), so no SVG icon, illustration, or pattern assets are rendered in the hero.
- **FR-005**: The `LandingHeroSection` component MUST NOT render the `themed-asset-wrap` container or any `ThemedVisualAsset` components; the `ThemedVisualAsset` import and all references MUST be fully removed from `LandingHeroSection.js`.
- **FR-006**: The `primary-cta-secondary` CSS class (applied to "Browse Leagues" and "How to Play" buttons) MUST receive a gradient fill (e.g., `linear-gradient(135deg, #f5a623, #e8890c)`) with an elevated box shadow, making the buttons visually prominent against the photo background.
- **FR-007**: Both CTA buttons ("Browse Leagues" and "How to Play") MUST retain their existing `id`, routing destination, telemetry tracking behavior, and accessible label.
- **FR-008**: No existing test files MUST be modified as part of this change; all tests MUST continue to pass.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The background image MUST be loaded as a CSS `background-image` (not an `<img>` element) so it does not affect the document's LCP candidate unless it becomes the LCP element; a `background-size: cover` pattern is expected.
- **NFR-002 (Accessibility)**: All text in the hero MUST meet WCAG 2.1 AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text) after the overlay is applied.
- **NFR-003 (Accessibility)**: CTA buttons MUST maintain visible keyboard focus indicators with sufficient contrast.
- **NFR-004 (Resilience)**: If the local background image fails to load, the hero MUST display a dark navy gradient fallback — `linear-gradient(135deg, #1a1a2e, #0a3d62)` — as the CSS `background` on `.landing-hero`, ensuring text remains readable and passes WCAG AA contrast requirements.
- **NFR-005 (Reduced Motion)**: CTA button hover/transition animations MUST be suppressed when the user's OS has "prefers-reduced-motion: reduce" set.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The hero section displays the local football photo (`assets/landing/football-hero-img.jpg`) as a background image on first page load in all supported browsers (Chrome, Firefox, Safari, Edge — latest 2 versions).
- **SC-002**: All hero text elements (headline, subheadline, badge) achieve at least 4.5:1 contrast ratio against the overlaid background, as measured by an automated accessibility audit.
- **SC-003**: The headline text reads exactly "Play Postseason Fantasy Football" with no SVG icon or illustration elements present in the hero.
- **SC-004**: The CTA buttons display a gradient fill with elevated box shadow, visually distinct from the previous flat style — validated by at least one PR reviewer explicitly confirming the visual improvement in their approval.
- **SC-005**: 100% of existing frontend automated tests pass after all changes are applied.
- **SC-006**: When the local background image fails to load, the hero text remains readable with the navy gradient fallback (contrast still passes WCAG AA).

## Assumptions

- The background image is sourced from the local asset at `assets/landing/football-hero-img.jpg`; no external URL or CDN dependency is introduced.
- The dark semi-transparent overlay will be implemented as a CSS pseudo-element or layered `background` property on `.landing-hero`, not as a separate DOM element, to keep markup clean.
- The `ThemedVisualAsset` component import and all usages are fully removed from `LandingHeroSection.js` to avoid lint errors.
- The `LANDING_ASSETS` constant and SVG asset imports in `landingAssets.js` can be emptied but the file itself is retained to avoid breaking any existing import chains.
- "Visually upgraded CTA" means applying one or more of: gradient background fill, more prominent box shadow, a brighter or higher-contrast accent color — the exact visual treatment is left to implementation discretion provided contrast and focus requirements are met.
- No changes are required to backend services, routing, or the telemetry service.
- Mobile responsiveness of the hero section is expected to be preserved (the existing responsive grid behavior is not regressed).
- The `landingTheme.js` `subheadline` and `badgeLabel` values remain unchanged.
