# Data Model: Hero Section Redesign

## Entities

### LandingHeroSection (component)
- **Purpose**: Renders the above-the-fold hero with photo background, headline, subheadline, badge, and CTA group. No longer accepts or renders themed visual assets.
- **Props** (post-redesign):
  - `badgeLabel` (string, required) — badge text above the headline
  - `headline` (string, required) — primary hero heading
  - `subheadline` (string, required) — supporting text below headline
  - `ctas` (array\<PrimaryCta\>, required) — CTA button definitions
  - `onCtaActivate` (function, required) — callback fired on CTA click with `ctaId`
- **Removed props**: `assets` — no longer accepted; `ThemedVisualAsset` rendering removed entirely
- **Validation**:
  - `headline` and `subheadline` must render with sufficient contrast (≥4.5:1) against the overlaid photo background
  - Component must not render any `themed-asset-wrap` or `ThemedVisualAsset` elements

---

### LandingTheme (constant — `landingTheme.js`)
- **Purpose**: Supplies static display values for the hero section.
- **Fields**:
  - `sectionId` (string, fixed: `'landing-hero'`)
  - `themeVariant` (string, fixed: `'modern-pitch'`)
  - `badgeLabel` (string, fixed: `'Fantasy Football Hub'`)
  - `headline` (string) — **changed** to `'Play Postseason Fantasy Football'`
  - `subheadline` (string, unchanged)
  - `ctaGroupId` (string, fixed: `'primary-actions'`)
- **Validation**:
  - `headline` must read exactly "Play Postseason Fantasy Football" (FR-003)

---

### LandingAssets (constant — `landingAssets.js`)
- **Purpose**: Defines the set of themed visual assets passed to `LandingHeroSection`. Post-redesign this array is empty; the file is retained so `HomePage.js` import chain is not disturbed.
- **Fields** (unchanged structure, empty data):
  - `LANDING_ASSETS` — array, **set to `[]`** (FR-004)
- **Validation**:
  - Array must be empty; no SVG or illustration entries present

---

### HeroBackground (CSS rule — `App.css`)
- **Purpose**: Visual treatment of the `.landing-hero` section background.
- **Properties** (post-redesign):
  - `background`: `url('../assets/landing/football-hero-img.jpg') center/cover no-repeat, linear-gradient(135deg, #1a1a2e, #0a3d62)`
  - First layer (photo) covers fallback gradient when loaded
  - Second layer (navy gradient) provides WCAG-AA-compliant fallback (FR-001, NFR-004)

---

### HeroOverlay (CSS pseudo-element — `.landing-hero::before`)
- **Purpose**: Semi-transparent dark overlay ensuring foreground text achieves WCAG AA contrast (≥4.5:1) over the photo background.
- **Properties** (post-redesign):
  - `content: ''`
  - `position: absolute; inset: 0; pointer-events: none`
  - `background: rgba(0, 0, 0, 0.52)` — dark overlay replacing the grid-line pattern
  - `z-index: 0` (content sits at z-index: 1)
- **Validation**:
  - Overlay opacity must be sufficient for ≥4.5:1 contrast for white headline text (NFR-002)

---

### PrimaryCtaSecondary (CSS rule — `App.css`)
- **Purpose**: Visual style for the "secondary" variant CTA buttons ("Browse Leagues", "How to Play").
- **Properties** (post-redesign):
  - `background`: `linear-gradient(135deg, #f5a623, #e8890c)`
  - `color`: `#ffffff`
  - `box-shadow`: `0 4px 14px rgba(229, 137, 12, 0.45)`
  - `border-color`: transparent (gradient fill makes border redundant)
- **Hover/active state** (post-redesign):
  - `background`: `linear-gradient(135deg, #e8890c, #d4780a)` — slightly darker
  - `box-shadow`: `0 6px 18px rgba(229, 137, 12, 0.55)`
- **Reduced motion**:
  - CTA `transition` animations scoped to `@media (prefers-reduced-motion: no-preference)` (NFR-005)
- **Validation**:
  - Gradient + white text must meet WCAG AA contrast (≥4.5:1) (NFR-002)
  - Button `id`, routing, and telemetry behavior unchanged (FR-007)

---

## State Transitions

No state transitions applicable — this feature is a pure CSS/constant change with no interactive state machine.

## Relationships

```
LandingTheme ──────────────────────────── supplies headline/badge/subheadline
                                                       │
                                                       ▼
                                          LandingHeroSection (component)
                                           │                  │
                                    renders │           renders │
                                           ▼                  ▼
                                  HeroBackground          PrimaryCtaGroup
                                  + HeroOverlay             (unchanged)
                                  (CSS only)
                                           
LandingAssets (empty []) ─── passed as prop ──► LandingHeroSection (ignored, no rendering)
```
