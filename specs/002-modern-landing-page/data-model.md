# Data Model: Modern Landing Page Enhancement

## Entities

### LandingHeroSection
- Purpose: Represents the above-the-fold presentation region that establishes brand tone and exposes key actions.
- Fields:
  - id (string, fixed value such as `landing-hero`)
  - headline (string, required)
  - subheadline (string, required)
  - themeVariant (enum: modern_pitch, neutral_fallback)
  - ctaGroupId (string, foreign key -> PrimaryCtaGroup.id)
- Validation:
  - Headline/subheadline must remain readable on desktop and mobile breakpoints.
  - Hero content must not be obscured by decorative assets.

### PrimaryCtaGroup
- Purpose: Logical grouping for the three required primary actions on the landing page.
- Fields:
  - id (string, fixed value such as `primary-actions`)
  - layoutMode (enum: horizontal, stacked, responsive)
  - emphasisLevel (enum: high)
  - ctaIds (array<string>, required, exactly 3)
- Validation:
  - Must include exactly one CTA for Login, Browse Leagues, and How to Play.
  - Group is visible without deep scrolling on standard desktop and mobile screens.

### PrimaryCta
- Purpose: Represents a prominent call-to-action entry point.
- Fields:
  - id (enum: login, browse_leagues, how_to_play)
  - label (string, required)
  - destinationRoute (string, required)
  - styleVariant (enum: primary, secondary-emphasis)
  - interactionStates (object: default, hover_or_press, focus)
  - analyticsEventName (string, required)
- Validation:
  - Destination route must match existing application routes.
  - Focus indicator must satisfy WCAG 2.1 AA visibility guidance.
  - CTA remains keyboard reachable and programmatically discernible.

### ThemedVisualAsset
- Purpose: Football-themed decorative icon or illustration packaged with the frontend build.
- Fields:
  - id (string, immutable)
  - assetType (enum: icon, illustration, pattern)
  - localPath (string, required, build-packaged path)
  - altText (string, nullable for decorative items)
  - placementArea (enum: hero, supporting-section, background)
  - fallbackBehavior (enum: hide, replace_with_shape)
- Validation:
  - `localPath` must resolve to bundled application asset.
  - Decorative assets must not block CTA interaction.
  - If load fails, fallback preserves readability and CTA usability.

### LandingTelemetryEvent
- Purpose: Structured analytics event generated from landing page view and CTA interactions.
- Fields:
  - eventName (enum: page_view, cta_login_click, cta_browse_leagues_click, cta_how_to_play_click)
  - timestamp (datetime, ISO-8601)
  - pageRoute (string)
  - deviceType (enum: mobile, desktop, tablet, unknown)
  - ctaId (enum or null; null for page_view)
- Validation:
  - `eventName` must map to approved schema values.
  - `deviceType` must always be present.
  - CTA click events must include matching `ctaId`.

## Relationships
- LandingHeroSection 1..1 PrimaryCtaGroup
- PrimaryCtaGroup 1..3 PrimaryCta
- LandingHeroSection 1..* ThemedVisualAsset
- PrimaryCta 1..* LandingTelemetryEvent (for click events)
- LandingHeroSection 1..* LandingTelemetryEvent (for page view events)

## State Transitions

### Primary CTA Interaction
- idle -> hover_or_press -> activated
- idle -> focus_visible -> activated
- activated -> navigation_complete

### Themed Visual Asset Rendering
- configured -> loading -> rendered
- loading -> failed -> fallback_applied

### Landing Event Emission
- page_loaded -> page_view_sent
- cta_activated -> cta_click_event_sent -> route_navigation