# Research: Draft Room Enhancements

**Feature**: `006-draft-room-enhancements` | **Date**: 2026-05-29

---

## Topic 1: Deterministic Player Stat Generation

**Question**: How should mock NFL statistics be generated so values are stable across renders
and filter changes (FR-011, NFR-003)?

**Decision**: Embed stat values directly as compile-time integer constants in `draftMockData.js`
for each player object.

**Rationale**: The player roster is small (~100 players) and static. Hardcoding position-
appropriate integer values is the simplest approach — no seeding algorithm required, no risk of
subtle hash collisions producing unrealistic values, and values are trivially auditable by
reviewers. A deterministic hash function would also work, but adds cognitive overhead with no
benefit over explicit constants for a fixed ~100-player list.

**Alternatives considered**:
- Seeded hash function (e.g., sum char codes of player id, modulo a range): technically
  deterministic, but values are opaque and harder to review or adjust. Overkill for ~100
  static entries.
- Random per-render: violates FR-011 and NFR-003 explicitly. Rejected.

---

## Topic 2: Active Team Indicator Pattern

**Question**: How should the "on the clock" state be propagated from `draftReducer` state to
the league bar highlight?

**Decision**: Derive `activeTeamId` in `DraftRoomPage` using the existing `getActiveTeam()`
utility, then pass `activeTeamId` and `draftComplete` as new props to `DraftLeagueBar`.
`DraftLeagueBar` passes `isActive` (boolean, `team.id === activeTeamId`) to each
`DraftTeamSlot`. `DraftTeamSlot` renders a `draft-team-slot--active` CSS modifier and a bold
"ON THE CLOCK" `<span>` below the slot button when `isActive` is true. When `draftComplete`
is true, `activeTeamId` is passed as `null` so no slot receives `isActive=true`; the bar
instead renders a "Draft Complete" message.

**Rationale**: The `getActiveTeam()` function already exists, is tested, and correctly handles
snake-draft ordering. Propagating `activeTeamId` as a prop mirrors the existing `selectedTeamId`
pattern — consistent and minimal. Deriving the active team on render (rather than storing it in
reducer state) follows React's "avoid derived state" best practice.

**Alternatives considered**:
- Add `activeTeamId` to reducer state: unnecessary — it is purely derived from `currentPickIndex`
  and `teams`. Storing derived values in reducers adds duplication risk. Rejected.
- Lift highlight into a Context: overkill for a single prop-pass through two component levels.
  Rejected.

---

## Topic 3: Stats Columns Layout in DraftPlayerRow

**Question**: How should TDs, Pass Yards, Rush Yards, and Rec Yards be displayed inline in
`DraftPlayerRow` without overflowing at standard viewport widths (≥1280px)?

**Decision**: Add four `<span>` elements with BEM class names (e.g.,
`draft-player-row__stat draft-player-row__stat--tds`) after the existing name/team fields in
`DraftPlayerRow`. Display values as plain integers. Use the existing flex layout on
`draft-player-row`; the four stat spans are narrow fixed-width columns. No layout restructuring
of `DraftPlayerList` or `DraftPlayerRow` required.

**Rationale**: `DraftPlayerRow` already uses a flex row of `<span>` elements — adding four more
spans is the minimal, consistent extension. A flex row with `min-width` stat columns fits within
1280px for the existing player card width. No new layout primitives needed.

**Alternatives considered**:
- Convert player list to `<table>`: would satisfy column alignment perfectly but requires
  restructuring `DraftPlayerList` and all related tests. Excessive scope for this feature.
  Rejected.
- Tooltip/popover for stats: hides stats on initial view, defeats the purpose (FR-005 requires
  stats visible inline). Rejected.

---

## Topic 4: Draft Complete Indicator in League Bar

**Question**: How should the "Draft Complete" state replace the "ON THE CLOCK" indicator once
all picks are made?

**Decision**: `DraftRoomPage` passes `draftComplete={state.draftComplete}` to `DraftLeagueBar`.
When `draftComplete` is true, `DraftLeagueBar` passes `activeTeamId={null}` (so no slot is
active) and renders a "Draft Complete" banner or label within the bar itself, replacing the
indicator.

**Rationale**: The `draftComplete` flag already exists in reducer state. Passing it through
props is zero-cost and keeps the signal localized to the bar component. The spec states the
last team's highlight is replaced (not retained), so no team should remain highlighted.

**Alternatives considered**:
- Show "Draft Complete" inside the last `DraftTeamSlot`: spec explicitly says the indicator
  is replaced, not relabeled on the active slot. Rejected.

---

## Constitution Check (Post-Research)

All NEEDS CLARIFICATION entries from Technical Context are resolved:

| Item | Resolution |
|------|------------|
| Stat generation approach | Compile-time integer constants in `draftMockData.js` |
| Active team propagation | Derive in `DraftRoomPage` via `getActiveTeam()`; pass as props |
| Stats display layout | 4 flex `<span>` columns in `DraftPlayerRow` |
| Draft complete state | `draftComplete` prop on `DraftLeagueBar`; null `activeTeamId` |

No constitution violations identified. Proceeding to Phase 1 design.
