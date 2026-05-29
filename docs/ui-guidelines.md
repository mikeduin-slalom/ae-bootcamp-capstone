# UI Guidelines

## Overview
Use this document to define the visual system and interaction rules for your capstone frontend.

The visual direction for this product should feel like a modern digital draft board layered on top of a football field aesthetic: confident, high-contrast, and data-forward.

## Design Principles
- Clarity first: users should understand primary actions at a glance.
- Consistency: repeat patterns for controls, feedback, and layout.
- Accessibility by default: keyboard support and sufficient contrast.
- Progressive disclosure: show advanced controls only when needed.

## Visual System Template

### Color Palette

#### Core Colors
- Primary: Field Green `#1F6F43` (primary actions, active tabs, key highlights)
- Secondary: Turf Green `#2E8B57` (supporting actions, chart accents, hover surfaces)
- Accent: Leather Brown `#7A4E2B` (secondary emphasis, badges, divider accents)

#### Surface Colors
- Background: Chalk White `#F7F8F5` (app background for readability)
- Surface: Warm White `#FFFFFF` (cards, modals, tables)
- Border: Yardline Gray `#D9DDD5` (input borders, card outlines, table separators)

#### Semantic Colors
- Success: Endzone Green `#2D9A52`
- Warning: Flag Amber `#B97A18`
- Danger: Penalty Red `#B42318`
- Info: Scoreboard Blue `#1D4ED8`

### Typography
- Heading scale:
	- H1: 40px / 48px
	- H2: 32px / 40px
	- H3: 24px / 32px
	- H4: 20px / 28px
- Body scale:
	- Body large: 18px / 28px
	- Body: 16px / 24px
	- Body small: 14px / 20px
	- Caption: 12px / 16px
- Font families:
	- Headings and score/timer numbers: `Barlow Condensed`, sans-serif
	- Body and form text: `Source Sans 3`, sans-serif
	- Numeric data (pick clock, standings points): `Roboto Mono`, monospace
- Weight usage:
	- 700 for page titles and key scoreboard numbers
	- 600 for section headings and primary action labels
	- 400 for body content

### Spacing and Sizing
- Base spacing unit: 8px
- Component radius tokens:
	- Small controls (inputs, chips): 8px
	- Cards and panels: 12px
	- Modals and drawers: 16px
- Elevation/shadow system:
	- Level 1 (default cards): `0 1px 3px rgba(0,0,0,0.08)`
	- Level 2 (hover cards, menus): `0 6px 18px rgba(0,0,0,0.12)`
	- Level 3 (modals): `0 16px 36px rgba(0,0,0,0.18)`

## Layout Guidelines

### Breakpoints
- Mobile: 0 to 639px
- Tablet: 640px to 1023px
- Desktop: 1024px and up

### Page Structure
- App shell/navigation pattern:
	- Persistent top header with league context and quick actions
	- Left navigation rail on desktop
	- Bottom tab navigation on mobile for Draft, Team, Standings, League
- Content width constraints:
	- Primary content max width: 1200px
	- Data-dense views (draft board, standings): up to 1320px
	- Forms and setup flows: 680px max for readability
- Standard section spacing:
	- 24px vertical spacing between major sections
	- 16px between related cards
	- 8px between label and control

## Component Guidelines

### Inputs and Forms
- Validation visibility timing:
	- Validate required fields on blur and on submit
	- Validate invite code format as user types
- Error message style and placement:
	- Inline error text directly below field in Danger color
	- Add error icon and plain-language corrective guidance
- Required vs optional field indicators:
	- Required fields marked with `*` and helper text: "Required"
	- Optional fields explicitly labeled "Optional"

### Buttons and Actions
- Primary action styling:
	- Filled Primary color with white text
	- Minimum height 44px for touch accessibility
- Secondary action styling:
	- White background, Primary text, 1px Border color stroke
- Destructive action styling:
	- Filled Danger color
	- Requires confirmation for league-cancel and force-draft actions

### Lists, Cards, and Tables
- Density variants:
	- Comfortable (default) for mixed content screens
	- Compact for draft board and standings tables
- Empty state pattern:
	- Empty screens include concise explanation, one primary CTA, and optional learn-more link
	- Use football-themed illustration subtly; never as the only information source
- Loading state pattern:
	- Skeleton rows for standings and draft history
	- Inline spinner for button-triggered actions (refresh, join, submit pick)

### Feedback and Messaging
- Toast/inline/system messages:
	- Toast for transient success states (pick submitted, settings saved)
	- Inline status banners for draft pause, reconnecting, provider delay
	- Persistent system banner when scoring source is degraded
- Error recovery guidance pattern:
	- Every recoverable error includes a clear next action (Retry, Rejoin, Contact Commissioner)
	- Use technical detail toggles for advanced users while keeping default messaging plain

## Interaction Guidelines

### State Behaviors
- Hover:
	- Darken filled buttons by 6%
	- Raise cards from elevation level 1 to level 2
- Focus:
	- 2px focus ring in Scoreboard Blue with 2px offset
	- Never remove browser focus indicator without accessible replacement
- Active:
	- Pressed state darkens button by 10% and removes elevation
- Disabled:
	- 40% opacity plus `not-allowed` cursor for non-interactive controls
	- Disabled controls must still meet minimum contrast where text remains readable

### Motion
- Transition durations:
	- 120ms for hover/focus
	- 180ms for drawers and menus
	- 240ms for modal entrance/exit
- Entrance/exit patterns:
	- Fade + slight upward slide for toasts and modals
	- Staggered list reveal only for non-critical dashboard content
- Reduced-motion behavior:
	- Respect `prefers-reduced-motion`
	- Remove non-essential transforms and stagger effects, keep only opacity changes

## Accessibility Requirements
- WCAG level target: WCAG 2.2 AA for all MVP flows
- Keyboard navigation requirements:
	- All controls reachable and operable by keyboard
	- Visible focus order follows visual reading order
	- Draft room interactions support full keyboard flow
- Screen-reader labels and announcements:
	- Timer updates announced at meaningful intervals, not every second
	- Live region announcements for pick confirmations, auto-picks, and draft pause/resume
	- Commissioner-only controls include explicit role context in labels
- Contrast thresholds:
	- Body text and interactive controls meet or exceed 4.5:1
	- Large text and large iconography meet or exceed 3:1
	- Do not rely on color alone for scoring changes, status, or errors

## Acceptance Checklist
- [x] Core components have defined states
- [x] Responsive behavior is documented
- [x] Accessibility requirements are explicit
- [x] Empty/loading/error patterns are consistent

## Landing Page Addendum (Feature 002)

### Hero visual guidance
- Hero composition must present a badge, one clear H1, one supporting subheadline, and a CTA group in that order.
- Football visuals are supporting decoration only and must never reduce text readability or block CTA hit targets.
- Decorative assets should sit behind content and degrade to neutral shapes when loading fails.

### CTA emphasis rules
- The `Login` CTA is the dominant action and uses the filled primary treatment.
- `Browse Leagues` and `How to Play` use secondary-emphasis styling while preserving equal keyboard reachability.
- CTA labels must remain sentence-case and action-first (`Login`, `Browse Leagues`, `How to Play`).
- CTA interactions must expose default, hover, active, and focus-visible states with WCAG AA contrast.
- The CTA group must remain visibly clustered as one decision area, not split across unrelated sections.

### Landing responsiveness constraints
- Desktop: CTA group may render as three columns when space allows.
- Mobile: CTA group must collapse to one column without overlap from decorative assets.
- Hero must remain meaningful even when decorative assets are hidden by responsive rules.
