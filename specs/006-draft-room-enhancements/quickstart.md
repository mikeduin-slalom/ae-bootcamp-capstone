# Quickstart: Draft Room Enhancements

**Feature**: `006-draft-room-enhancements` | **Date**: 2026-05-29

---

## Prerequisites

- Node.js 18+
- Repo cloned and dependencies installed:
  ```bash
  npm install
  cd packages/frontend && npm install
  ```

---

## Running the App

```bash
cd packages/frontend
npm start
```

Navigate to `http://localhost:3000/draft-room`.

### Verify Enhancement 1 — Active Team Indicator

1. On page load, the first team slot ("Gridiron Ghosts") should have a distinct border and
   background highlight, with a bold **"ON THE CLOCK"** label displayed below the slot.
2. All other team slots should have no active highlight.
3. Draft any player by clicking **Draft** in the player list. The highlight should immediately
   move to the next team in snake-draft order.
4. After all picks are exhausted, the active highlight is replaced by a **"Draft Complete"**
   indicator in the league bar.

### Verify Enhancement 2 — Player Statistics

1. Each player row should display four stat columns to the right of the player name/team:
   **TDs**, **Pass Yds**, **Rush Yds**, **Rec Yds**.
2. QB players (filter by position QB) should show a non-zero value for Pass Yds
   (e.g., Patrick Mahomes: 5250 yds).
3. All non-QB players should show **0** for Pass Yds.
4. Apply a position filter (e.g., RB) — stats should remain visible on all filtered rows.
5. Clear the filter — stats should still be visible on all rows.
6. Reload the page — the same player's stat values should be identical (deterministic).

---

## Running Tests

```bash
cd packages/frontend
CI=1 npm test -- --watchAll=false
```

### Key test files for this feature

| File | Status | What it covers |
|------|--------|----------------|
| `src/__tests__/DraftTeamSlot.test.js` | NEW | `isActive` prop; `--active` CSS class; "ON THE CLOCK" label |
| `src/__tests__/DraftLeagueBar.test.js` | EXTENDED | `activeTeamId` propagation; `draftComplete` banner; no active slot when draft done |
| `src/__tests__/DraftPlayerRow.test.js` | NEW | Stat columns present; correct values per position; QB pass yards non-zero; K/DEF zeros |
| `src/__tests__/DraftPlayerList.test.js` | EXTENDED | Stats remain visible when position filter applied |
| `src/__tests__/draftReducer.test.js` | EXTENDED (optional) | Verify `getActiveTeam()` drives correct `activeTeamId` derivation |

### Coverage target

New code for both enhancements should maintain ≥80% test coverage (constitution principle III).

---

## Key Files Changed

| File | Change summary |
|------|----------------|
| `packages/frontend/src/constants/draftMockData.js` | Add `touchdowns`, `passYards`, `rushYards`, `recYards` integer fields to every player in `MOCK_PLAYERS` |
| `packages/frontend/src/components/DraftTeamSlot.js` | Add `isActive` prop; apply `draft-team-slot--active` CSS modifier; render "ON THE CLOCK" label below slot when active |
| `packages/frontend/src/components/DraftLeagueBar.js` | Add `activeTeamId` and `draftComplete` props; derive `isActive` per slot; render "Draft Complete" banner when `draftComplete` is true |
| `packages/frontend/src/components/DraftPlayerRow.js` | Add four stat `<span>` columns after team abbreviation |
| `packages/frontend/src/pages/DraftRoomPage.js` | Derive `activeTeamId` using `getActiveTeam()`; pass `activeTeamId` and `draftComplete` to `DraftLeagueBar` |

---

## Stat Reference (sample values)

| Player | Position | TDs | Pass Yds | Rush Yds | Rec Yds |
|--------|----------|-----|----------|----------|---------|
| Patrick Mahomes | QB | 38 | 5250 | 358 | 0 |
| Christian McCaffrey | RB | 17 | 0 | 1459 | 564 |
| Tyreek Hill | WR | 13 | 0 | 0 | 1799 |
| Travis Kelce | TE | 10 | 0 | 0 | 984 |
| Justin Tucker | K | 0 | 0 | 0 | 0 |
| San Francisco 49ers | DEF | 3 | 0 | 0 | 0 |

---

## Architecture Notes

- **No backend changes** — this feature is entirely frontend-only.
- **No new npm dependencies** — all additions use existing React patterns.
- **Active team derivation** — `activeTeamId` is derived on render in `DraftRoomPage` via
  `getActiveTeam(state.teams, state.currentPickIndex)`, not stored in reducer state.
- **Stat determinism** — stat values are integer literals in source; no runtime seeding needed.
