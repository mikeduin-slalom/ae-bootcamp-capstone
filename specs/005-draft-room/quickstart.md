# Quickstart: Draft Room

**Feature**: `005-draft-room` | **Date**: 2026-05-29

---

## Prerequisites

- Node 18+
- From the repo root, dependencies are already installed (`npm install` at workspace root or
  `cd packages/frontend && npm install`).
- No new npm packages are required for this feature.

---

## Running the App

```bash
# From repo root
cd /path/to/ae-bootcamp-capstone
cd packages/frontend && npm start
```

App runs at **http://localhost:3000**.

- Click the "Draft Room" CTA on the homepage to navigate to `/draft-room`.
- Or navigate directly to **http://localhost:3000/draft-room**.

---

## Running Tests

```bash
# All frontend tests (CI mode, no watch)
cd packages/frontend && CI=1 npm test

# Watch mode for development
cd packages/frontend && npm run test:watch
```

---

## Key Files for This Feature

| File | Status | Purpose |
|------|--------|---------|
| `packages/frontend/src/constants/routes.js` | Modified | Add `draftRoom: '/draft-room'` |
| `packages/frontend/src/constants/draftMockData.js` | New | Mock player pool + 12 fantasy teams |
| `packages/frontend/src/App.js` | Modified | Register `/draft-room` route |
| `packages/frontend/src/pages/draftReducer.js` | New | Reducer + initial state (extracted for testability) |
| `packages/frontend/src/pages/DraftRoomPage.js` | New | Stateful container (useReducer + timer) |
| `packages/frontend/src/components/DraftLeagueBar.js` | New | 12-team header bar |
| `packages/frontend/src/components/DraftTeamSlot.js` | New | Single team slot (initials logo + name) |
| `packages/frontend/src/components/DraftRosterPanel.js` | New | Selected team's drafted-player list |
| `packages/frontend/src/components/DraftPlayerList.js` | New | Filterable available player pool |
| `packages/frontend/src/components/DraftFilters.js` | New | Position + NFL team filter dropdowns |
| `packages/frontend/src/components/DraftPlayerRow.js` | New | Single player row with "Draft" button |
| `packages/frontend/src/components/DraftPickTimer.js` | New | Countdown timer display |
| `packages/frontend/src/App.css` | Modified | Draft room component styles |

---

## Implementation Order (by user story priority)

### P1 — Homepage CTA + Draft Room page skeleton
1. Add `draftRoom: '/draft-room'` to `routes.js`.
2. Add "Draft Room" CTA to the `ctas` array in `HomePage.js`.
3. Register `<Route path={ROUTES.draftRoom} element={<DraftRoomPage />} />` in `App.js`.
4. Create `draftMockData.js` with `MOCK_PLAYERS` and `MOCK_TEAMS`.
5. Create `draftReducer.js` with `initialDraftState` and `draftReducer`.
6. Create `DraftRoomPage.js` as container skeleton with `useReducer`.
7. Create `DraftLeagueBar.js` and `DraftTeamSlot.js` — render 12 team slots from mock data.

### P2 — Draft a player
8. Create `DraftPlayerRow.js` with "Draft" button dispatching `DRAFT_PLAYER`.
9. Create `DraftPlayerList.js` rendering `DraftPlayerRow` for each available player.
10. Wire `DRAFT_PLAYER` in reducer: remove from `availablePlayers`, add to `rosters`.

### P3 — View team roster
11. Create `DraftRosterPanel.js` showing drafted players for `selectedTeamId`.
12. Wire `SELECT_TEAM` action to `DraftTeamSlot` click in `DraftLeagueBar`.

### P4 — Filter player list
13. Create `DraftFilters.js` with position and NFL team `<select>` controls.
14. Wire filter actions (`SET_POSITION_FILTER`, `SET_NFL_TEAM_FILTER`, `CLEAR_FILTERS`).
15. Apply filters in `DraftPlayerList` computed render.

### P5 — Pick timer
16. Create `DraftPickTimer.js` displaying `mm:ss` countdown from `secondsLeft` prop.
17. Add `secondsLeft` state + `useEffect` interval in `DraftRoomPage`.
18. Wire `AUTO_PICK` dispatch on timer expiry.

---

## Draft State Architecture

The `useReducer` hook in `DraftRoomPage` manages all draft state. The reducer is extracted to
`draftReducer.js` for independent unit testing.

```js
// DraftRoomPage.js
import { draftReducer, initialDraftState } from './draftReducer';

const [state, dispatch] = useReducer(draftReducer, initialDraftState);
```

The pick timer uses a separate `useState` for `secondsLeft` and a `useEffect` with `setInterval`.
The timer resets when `state.currentPickIndex` changes.

```js
const PICK_TIMER_SECONDS = 300;
const [secondsLeft, setSecondsLeft] = useState(PICK_TIMER_SECONDS);

// Reset on new pick
useEffect(() => {
  setSecondsLeft(PICK_TIMER_SECONDS);
}, [state.currentPickIndex]);

// Countdown interval
useEffect(() => {
  if (state.draftComplete) return;
  const id = setInterval(() => {
    setSecondsLeft(s => {
      if (s <= 1) {
        dispatch({ type: 'AUTO_PICK' });
        return PICK_TIMER_SECONDS;
      }
      return s - 1;
    });
  }, 1000);
  return () => clearInterval(id);
}, [state.currentPickIndex, state.draftComplete]);
```

---

## Known Limitations (By Design)

- Draft state resets on page refresh (no persistence in this phase).
- The draft has no fixed round limit; it runs until all mock players are drafted or the user
  navigates away.
- No real-time multiplayer; all 12 team picks are controlled by the single user in the browser.
