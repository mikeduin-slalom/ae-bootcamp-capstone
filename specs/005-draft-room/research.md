# Research: Draft Room

**Feature**: `005-draft-room` | **Date**: 2026-05-29

All NEEDS CLARIFICATION items resolved. No external API or backend integration required for this
phase.

---

## Timer Implementation

**Decision**: `useEffect` + `setInterval` with `useState` for the countdown value.

**Rationale**: React's built-in hooks are sufficient for a 1-second resolution countdown timer.
The pattern is well-established: a `useEffect` starts and clears the interval, `useState` holds
the remaining seconds, and `currentPickIndex` in the dependency array resets the timer
automatically when the active pick advances.

**Alternatives considered**:
- `react-timer-hook` (npm): Rejected — adds a dependency for behavior achievable with built-in
  hooks. Constitution principle V (simplicity) and constraint of no new npm packages.
- `requestAnimationFrame` loop: Rejected — overkill for 1-second granularity; harder to test.

**Implementation pattern**:
```js
const PICK_TIMER_SECONDS = 300; // 5 minutes

const [secondsLeft, setSecondsLeft] = useState(PICK_TIMER_SECONDS);

// Reset when pick advances
useEffect(() => {
  setSecondsLeft(PICK_TIMER_SECONDS);
}, [currentPickIndex]);

// Countdown
useEffect(() => {
  if (draftComplete) return;
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
}, [currentPickIndex, draftComplete]);
```

---

## State Management

**Decision**: `useReducer` for draft state; `useState` for simple UI state.

**Rationale**: The draft state has complex, interdependent transitions (draft player → assign to
team → advance pick → reset timer signal). A reducer provides predictable, testable state
transitions and is extractable to its own module (`draftReducer.js`). Aligns with the
codebase's React-only approach and constitution principle V (no speculative abstractions).

**Alternatives considered**:
- Flat `useState` for everything: Rejected — 6+ interdependent state fields cause race conditions
  and prop-drilling at this component depth.
- Redux Toolkit: Rejected — no Redux in existing codebase; overkill for single-page state.
- Zustand / Jotai: Rejected — external library; constitution principle V + no-new-deps
  constraint.

**State shape**:
```js
{
  teams: FantasyTeam[],               // 12 mock teams; immutable
  rosters: { [teamId]: Player[] },    // drafted picks keyed by team
  availablePlayers: Player[],         // undrafted pool
  currentPickIndex: number,           // drives snake order + timer reset
  draftComplete: boolean,
  selectedTeamId: string | null,      // team whose roster panel is open
  positionFilter: string | null,
  nflTeamFilter: string | null,
}
```

---

## Mock Data Structure

**Decision**: Static JS modules with inline arrays of NFL player and fantasy team objects.

**Rationale**: Spec explicitly states "utilize mock data for now." Static modules require no API
call, no loading state, and no error handling. They are importable directly into components and
into test fixtures without mocking.

**Player coverage**: ~100 NFL players across 6 positions (QB ~15, RB ~22, WR ~28, TE ~12, K ~10,
DEF ~13) spanning 12 NFL teams to enable meaningful position and team filter demonstration.

**Player fields**: `id`, `name`, `position`, `nflTeam`, `nflTeamAbbr`

**Fantasy team fields**: `id`, `name`, `initials` (2-char logo fallback)

**Location**: `packages/frontend/src/constants/draftMockData.js`

---

## Component Architecture

**Decision**: `DraftRoomPage.js` as the stateful container; child components are presentational
(receive props, dispatch callbacks).

**Rationale**: Mirrors the existing pattern (`HomePage` → `LandingHeroSection` →
`PrimaryCtaGroup`). Presentational children are independently unit-testable without mocking
context or reducer state.

**Component tree**:
```
DraftRoomPage          (useReducer state, timer state)
├── DraftLeagueBar     (12 team slots, click → SELECT_TEAM)
│   └── DraftTeamSlot  (logo initials + name, active highlight)
├── DraftRosterPanel   (conditional on selectedTeamId; lists drafted players for that team)
├── DraftPlayerList    (filterable available player pool)
│   ├── DraftFilters   (position dropdown + NFL team dropdown)
│   └── DraftPlayerRow (player name/pos/team + "Draft" button)
└── DraftPickTimer     (countdown display, "Pick X of N" label)
```

**Reducer extraction**: The reducer function and `initialDraftState` are defined in
`packages/frontend/src/pages/draftReducer.js` so they can be unit-tested in isolation
without mounting a component.

---

## Snake Draft Order

**Decision**: Compute the active team index from `currentPickIndex` using standard snake math.

**Rationale**: No library needed. A two-line calculation is the simplest correct implementation.

```js
function getActiveTeamIndex(pickIndex, numTeams) {
  const round = Math.floor(pickIndex / numTeams);
  const positionInRound = pickIndex % numTeams;
  return round % 2 === 0
    ? positionInRound
    : (numTeams - 1) - positionInRound;
}
```

---

## CSS Strategy

**Decision**: Extend the existing `App.css` global stylesheet with draft-room-scoped class names.

**Rationale**: The project uses a single `App.css` file for all components (no CSS Modules,
no Tailwind). New classes use `.draft-room-*`, `.league-bar-*`, `.player-list-*`,
`.pick-timer-*`, and `.roster-panel-*` prefixes to avoid collisions.

**Color anchors** (from `ui-guidelines.md`):
- Primary green: `#1F6F43`
- Surface white: `#FFFFFF`
- Border: `#D9DDD5`
- Danger/auto-pick warning: `#B42318`
- Timer monospace font: `Roboto Mono`
