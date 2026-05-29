# Research: Hero Section Redesign

## Decision 1: CSS background-image on .landing-hero, not an <img> element
- **Decision**: Implement the football photo as a CSS `background-image` property on `.landing-hero`, using `background-size: cover` and `background-position: center`.
- **Rationale**: NFR-001 requires the photo to be set as a CSS `background-image` so it does not become the document's LCP candidate. The existing `.landing-hero` rule already owns the section's visual background; replacing the gradient with an image + fallback gradient is the minimal, clean change.
- **Alternatives considered**:
  - `<img>` element with `object-fit: cover`: Would become an LCP candidate and require additional positioning markup. Rejected per NFR-001.
  - Inline `style` prop on the section element in JSX: Creates a JS dependency for a static asset path and requires adding an import to `LandingHeroSection.js`. Rejected — CSS rule is more appropriate for a static background image.

## Decision 2: Semi-transparent overlay via ::before pseudo-element (retain existing pattern)
- **Decision**: Keep and repurpose the existing `.landing-hero::before` pseudo-element as the dark semi-transparent overlay. Replace the current grid-line pattern background with `background: rgba(0, 0, 0, 0.52)` (or similar value tuned for 4.5:1 text contrast).
- **Rationale**: The pseudo-element already exists in `App.css` and has `position: absolute; inset: 0; pointer-events: none;` — the exact properties needed for a full-coverage overlay. Reusing it avoids adding DOM elements or additional CSS rules.
- **Alternatives considered**:
  - Add a `<div class="hero-overlay">` inside the JSX: Adds a presentational DOM node; the pseudo-element achieves the same effect with no markup change.
  - Use `background` with multiple layers (image + gradient): Possible but makes the fallback harder to reason about; pseudo-element approach separates concerns cleanly.

## Decision 3: Fallback gradient in background shorthand, image as second layer
- **Decision**: Set `.landing-hero { background: url('../assets/landing/football-hero-img.jpg') center/cover no-repeat, linear-gradient(135deg, #1a1a2e, #0a3d62); }`. When the image loads, it covers the gradient; when it fails, the navy gradient is visible.
- **Rationale**: CSS `background` shorthand applies layers in order — the first succeeds and paints over subsequent layers. The navy fallback gradient is always present underneath, satisfying NFR-004 with no JavaScript.
- **Alternatives considered**:
  - JavaScript `onerror` on an `<img>` that toggles a class: Requires JS, DOM manipulation, and cannot intercept CSS background failures. Rejected.
  - `@supports` query to detect image load: Not applicable to CSS background load state. Rejected.

## Decision 4: .primary-cta-secondary upgraded to gradient fill with elevated shadow
- **Decision**: Replace the flat `background: #eef5f1` on `.primary-cta-secondary` with `background: linear-gradient(135deg, #f5a623, #e8890c)` and add `box-shadow: 0 4px 14px rgba(229, 137, 12, 0.45)`. Update color to white for legibility against the orange gradient. Adjust hover/active state accordingly.
- **Rationale**: The spec clarification specifies this exact gradient. Using orange/amber creates strong contrast against both the dark photo background overlay and the primary dark-green CTA button. The elevated shadow provides visual depth consistent with SC-004.
- **Alternatives considered**:
  - Accent color change only (no gradient): Less visually distinct against the photo background. Rejected.
  - Match gradient to the hero overlay: Would blend CTAs into the background rather than surfacing them. Rejected.

## Decision 5: Reduce motion via @media (prefers-reduced-motion: reduce)
- **Decision**: Wrap the `.primary-cta { transition: ... }` in an inverse media query (`@media (prefers-reduced-motion: no-preference)`) so that reduced-motion users receive no transition animations on CTA buttons.
- **Rationale**: NFR-005 mandates this. Scoping transitions to `no-preference` is the standard CSS pattern for honoring the OS preference without adding a separate `reduce` override block.
- **Alternatives considered**:
  - `@media (prefers-reduced-motion: reduce) { .primary-cta { transition: none; } }`: Equally valid override pattern but slightly more verbose. Both approaches work; `no-preference` wrapper is marginally cleaner for a new rule.

## Decision 6: Remove ThemedVisualAsset entirely from LandingHeroSection; empty LANDING_ASSETS
- **Decision**: Delete the `import ThemedVisualAsset` line and the `themed-asset-wrap` div from `LandingHeroSection.js`. Remove the `assets` prop from the function signature. Empty `LANDING_ASSETS` to `[]` in `landingAssets.js` (retain the file and its named export to avoid breaking the existing `HomePage.js` import chain).
- **Rationale**: FR-004 and FR-005 require no SVG elements in the hero. Retaining the file and empty export avoids a cascading import change in `HomePage.js`, keeping the diff minimal and tests stable (FR-008).
- **Alternatives considered**:
  - Remove `landingAssets.js` entirely: Would require removing its import from `HomePage.js` and could disturb test snapshots. Rejected — empty array is less invasive.
  - Conditionally render `themed-asset-wrap` based on array length: Leaves dead code and violates FR-005's explicit removal requirement. Rejected.
