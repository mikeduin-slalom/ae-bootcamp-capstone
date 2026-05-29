# Data Model: Draft Room

**Feature**: `005-draft-room` | **Date**: 2026-05-29

All entities are frontend-only (in-memory React state or static mock data). No backend schema
changes in this phase.

---

## Entities

### Player (Mock Data — Static)

Represents an available NFL player in the draft pool.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique player ID (e.g., `'p_001'`) |
| `name` | `string` | Full player name (e.g., `'Patrick Mahomes'`) |
| `position` | `string` | One of: `'QB'`, `'RB'`, `'WR'`, `'TE'`, `'K'`, `'DEF'` |
| `nflTeam` | `string` | NFL team full name (e.g., `'Kansas City Chiefs'`) |
| `nflTeamAbbr` | `string` | NFL team abbreviation (e.g., `'KC'`) |

**Source**: `packages/frontend/src/constants/draftMockData.js` — `MOCK_PLAYERS` export

**Coverage**: ~100 players; 6 positions; 12 NFL teams for meaningful filter demonstration:
- QB: ~15 players
- RB: ~22 players
- WR: ~28 players
- TE: ~12 players
- K: ~10 players
- DEF: ~13 players

---

### FantasyTeam (Mock Data — Static)

Represents one of the 12 fantasy teams in the league.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique team ID (e.g., `'team_1'`) |
| `name` | `string` | Fantasy team display name (e.g., `'Gridiron Ghosts'`) |
| `initials` | `string` | 2-character initials for logo fallback (e.g., `'GG'`) |

**Source**: `packages/frontend/src/constants/draftMockData.js` — `MOCK_TEAMS` export

---

### DraftState (Runtime — React `useReducer`)

In-memory state tree managed by `useReducer` in `DraftRoomPage`. Defined and initialized in
`packages/frontend/src/pages/draftReducer.js`.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `teams` | `FantasyTeam[]` | `MOCK_TEAMS` | 12 fantasy teams; read-only after init |
| `rosters` | `{ [teamId: string]: Player[] }` | `{}` (all empty) | Drafted players keyed by team ID |
| `availablePlayers` | `Player[]` | `MOCK_PLAYERS` | Players not yet drafted |
| `currentPickIndex` | `number` | `0` | 0-based global pick counter; drives snake-order and timer reset |
| `draftComplete` | `boolean` | `false` | Set to `true` when `availablePlayers` is empty after an auto-pick |
| `selectedTeamId` | `string \| null` | `null` | Team ID whose roster panel is open; `null` = panel hidden |
| `positionFilter` | `string \| null` | `null` | Active position filter; `null` = no filter |
| `nflTeamFilter` | `string \| null` | `null` | Active NFL team filter; `null` = no filter |

---

## State Transitions

| Action | Payload | Result |
|--------|---------|--------|
| `DRAFT_PLAYER` | `{ playerId: string }` | Removes player from `availablePlayers`; appends player to `rosters[activeTeamId]`; increments `currentPickIndex`; if `availablePlayers` becomes empty, sets `draftComplete: true` |
| `AUTO_PICK` | _(none)_ | Dispatches `DRAFT_PLAYER` with the first player in the unfiltered `availablePlayers` array; if pool empty, sets `draftComplete: true` |
| `SELECT_TEAM` | `{ teamId: string }` | Toggles `selectedTeamId`: sets to `teamId` if different from current, or back to `null` if same team is clicked again |
| `SET_POSITION_FILTER` | `{ value: string \| null }` | Sets `positionFilter` |
| `SET_NFL_TEAM_FILTER` | `{ value: string \| null }` | Sets `nflTeamFilter` |
| `CLEAR_FILTERS` | _(none)_ | Sets both `positionFilter` and `nflTeamFilter` to `null` |

---

## Snake Draft Order Algorithm

The active team for any pick is determined by `currentPickIndex` and the fixed team count (12).

```js
// packages/frontend/src/pages/draftReducer.js

export function getActiveTeamIndex(pickIndex, numTeams) {
  const round = Math.floor(pickIndex / numTeams);
  const positionInRound = pickIndex % numTeams;
  return round % 2 === 0
    ? positionInRound                    // rounds 1, 3, 5… → left to right
    : (numTeams - 1) - positionInRound;  // rounds 2, 4, 6… → right to left
}

export function getActiveTeam(teams, pickIndex) {
  return teams[getActiveTeamIndex(pickIndex, teams.length)];
}
```

**Examples** (12 teams, picks 0-23):
- Pick 0 → team index 0 (round 1, first pick)
- Pick 11 → team index 11 (round 1, last pick)
- Pick 12 → team index 11 (round 2, snake back)
- Pick 23 → team index 0 (round 2, last snake pick)

**Draft completion**: The spec does not define a fixed roster size. The draft ends when
`availablePlayers` is empty (all mock players have been drafted). An `AUTO_PICK` on an empty pool
sets `draftComplete: true` without advancing the pick.

---

## Derived / Computed Values

| Value | Derived From | Notes |
|-------|-------------|-------|
| `activeTeam` | `getActiveTeam(teams, currentPickIndex)` | Computed in component; not stored in state |
| `filteredPlayers` | `availablePlayers` filtered by `positionFilter` + `nflTeamFilter` | Computed in `DraftPlayerList`; not stored in state |
| `rosterCount(teamId)` | `rosters[teamId].length` | Displayed in `DraftTeamSlot` badge |

---

## Validation Rules

- A player may only be drafted once: `availablePlayers` is the source of truth; players are
  removed on draft and never re-added.
- `AUTO_PICK` selects the first entry of the **unfiltered** `availablePlayers` array, regardless
  of active UI filters (consistent with spec user story 5).
- `positionFilter` must be one of `['QB', 'RB', 'WR', 'TE', 'K', 'DEF']` or `null`.
- `nflTeamFilter` must be a valid `nflTeam` value from `MOCK_PLAYERS` or `null`.
- `selectedTeamId` must be a valid `teams[*].id` or `null`.
