# Data Model: Draft Room Enhancements

**Feature**: `006-draft-room-enhancements` | **Date**: 2026-05-29

---

## Enhanced Entities

### Player (enhanced)

Extends the existing `Player` shape in `packages/frontend/src/constants/draftMockData.js` with
four stat fields. No backend schema changes; all fields are frontend mock constants.

| Field         | Type    | Constraints                                           | Notes                                            |
|---------------|---------|-------------------------------------------------------|--------------------------------------------------|
| `id`          | string  | unique, non-null                                      | Existing. e.g. `'p_001'`                        |
| `name`        | string  | non-null                                              | Existing.                                        |
| `position`    | string  | one of: QB, RB, WR, TE, K, DEF                       | Existing.                                        |
| `nflTeam`     | string  | non-null                                              | Existing.                                        |
| `nflTeamAbbr` | string  | non-null                                              | Existing.                                        |
| `touchdowns`  | integer | ≥ 0; 0 for K; ≥ 1 for DEF (defensive/return TDs)    | **NEW** — total TDs scored                       |
| `passYards`   | integer | > 0 for QB; exactly 0 for all other positions        | **NEW** — passing yards (season total)           |
| `rushYards`   | integer | ≥ 0; 0 for K and DEF                                 | **NEW** — rushing yards (season total)           |
| `recYards`    | integer | ≥ 0; 0 for K and DEF                                 | **NEW** — receiving yards (season total)         |

#### Position-archetype stat ranges (mock values)

| Position | TDs   | Pass Yards | Rush Yards | Rec Yards |
|----------|-------|------------|------------|-----------|
| QB       | 25–45 | 3500–5000  | 200–800    | 0         |
| RB       | 8–20  | 0          | 800–1800   | 200–600   |
| WR       | 6–15  | 0          | 0–100      | 700–1500  |
| TE       | 4–12  | 0          | 0          | 400–900   |
| K        | 0     | 0          | 0          | 0         |
| DEF      | 1–4   | 0          | 0          | 0         |

**Stat stability**: Values are integer literals embedded in `MOCK_PLAYERS`. No runtime
generation or seeding. Same player always returns the same stat values (FR-011, NFR-003).

---

### DraftTurn (existing — clarified, no new fields)

The active team for any turn is derived on render via `getActiveTeam(state.teams,
state.currentPickIndex)` and is NOT stored in reducer state (it is purely derived data).
`draftComplete` in existing state signals end-of-draft conditions.

| Field              | Type    | Constraints | Notes                                           |
|--------------------|---------|-------------|-------------------------------------------------|
| `currentPickIndex` | integer | ≥ 0         | Existing. Drives `getActiveTeam()`.             |
| `draftComplete`    | boolean | non-null    | Existing. When true, no team is "on the clock". |

---

## Component Interface Changes

### DraftTeamSlot — new prop

| Prop       | Type    | Required | Default | Notes                                                      |
|------------|---------|----------|---------|------------------------------------------------------------|
| `isActive` | boolean | yes      | false   | **NEW** — true when this team is currently "on the clock". |
|            |         |          |         | Applies `draft-team-slot--active` CSS modifier and renders |
|            |         |          |         | a bold "ON THE CLOCK" label below the slot button.         |

### DraftLeagueBar — new props

| Prop           | Type         | Required | Default | Notes                                                             |
|----------------|--------------|----------|---------|-------------------------------------------------------------------|
| `activeTeamId` | string\|null | yes      | null    | **NEW** — id of the team currently on the clock; null when draft  |
|                |              |          |         | is complete or not yet started.                                   |
| `draftComplete`| boolean      | yes      | false   | **NEW** — when true, renders a "Draft Complete" banner inside the |
|                |              |          |         | bar and passes `isActive=false` to all team slots.                |

### DraftPlayerRow — new stat display (no new props; reads from player object)

The component reads the four new stat fields directly from the `player` prop already passed in.
No new props are added to `DraftPlayerRow`. Rendered as four `<span>` elements after the
existing team abbreviation field.

| Rendered element                    | Class name                           | Value source       |
|-------------------------------------|--------------------------------------|--------------------|
| TDs column                          | `draft-player-row__stat--tds`        | `player.touchdowns`|
| Pass Yds column                     | `draft-player-row__stat--pass-yards` | `player.passYards` |
| Rush Yds column                     | `draft-player-row__stat--rush-yards` | `player.rushYards` |
| Rec Yds column                      | `draft-player-row__stat--rec-yards`  | `player.recYards`  |

---

## Validation Rules

- FR-006: `passYards > 0` for all QB players (enforced by mock data literal values).
- FR-007: `passYards === 0` for all non-QB players (enforced by mock data literal values).
- FR-009: `touchdowns === 0 && rushYards === 0 && recYards === 0` for all K players.
- FR-010: `rushYards === 0 && recYards === 0` for all DEF players; `touchdowns >= 1`.
- FR-011: Values are literals — identical across all renders (no runtime randomness).

---

## State Flow (active team indicator)

```
draftReducer state
  └── currentPickIndex (integer)
  └── draftComplete (boolean)
        ↓
DraftRoomPage
  └── activeTeam = getActiveTeam(state.teams, state.currentPickIndex)
  └── activeTeamId = state.draftComplete ? null : activeTeam.id
        ↓
DraftLeagueBar (activeTeamId, draftComplete)
  └── per slot: isActive = (team.id === activeTeamId)
        ↓
DraftTeamSlot (isActive)
  └── CSS: draft-team-slot--active (when isActive)
  └── Label: "ON THE CLOCK" (when isActive)
  └── Bar: "Draft Complete" banner (when draftComplete)
```
