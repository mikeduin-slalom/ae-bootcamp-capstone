# Data Model: Leagues Table View

**Feature**: 007-leagues-table-view
**Date**: 2026-05-29

---

## Entities

### League (existing, API shape unchanged)

Sourced from `GET /api/leagues`. Shape is unchanged per spec Assumptions.

| Field | Type | Values / Notes |
|-------|------|----------------|
| `id` | `string` | Unique identifier (e.g., `"league-joinable-1"`) |
| `name` | `string` | Human-readable league name |
| `accessType` | `"joinable" \| "private"` | Maps to "Public" / "Private" badge |
| `status` | `string` | `"pending"` \| `"draft_ready"` \| `"drafting"` \| etc. |
| `memberCount` | `number` | Current member count |
| `maxEntrants` | `number` | Maximum capacity |

**Display mapping**:

| `accessType` value | User-facing label | Badge class |
|--------------------|-------------------|-------------|
| `"joinable"` | Public | `badge--public` |
| `"private"` | Private | `badge--private` |
| any other value | Unknown | `badge--unknown` |

---

### MockLeagueMetadata (frontend-only, compile-time constant)

Stored in `packages/frontend/src/constants/leaguesMockData.js` as a plain object keyed by
league `id`. Not persisted; not fetched from any API.

| Field | Type | Example |
|-------|------|---------|
| `commissioner` | `string` | `"Alex Runner"` |
| `draftStartTime` | ISO 8601 string | `"2026-06-15T19:00:00.000Z"` |

**Fallback**: when a league `id` is not present in the lookup, display `"—"` for both fields.

**Example constant structure**:

```js
// leaguesMockData.js
export const LEAGUE_MOCK_METADATA = {
  'league-joinable-1': {
    commissioner: 'Alex Runner',
    draftStartTime: '2026-06-15T19:00:00.000Z'
  },
  'league-private-1': {
    commissioner: 'Casey Coach',
    draftStartTime: '2026-07-01T18:00:00.000Z'
  },
  'league-private-2': {
    commissioner: 'Jordan Blake',
    draftStartTime: '2026-07-10T20:00:00.000Z'
  }
};
```

---

### UserMembership (existing backend model, new API surface)

Stored in `packages/backend/src/services/dataStore.js` as `memberships[]`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Unique membership ID |
| `leagueId` | `string` | Foreign key → League.id |
| `userId` | `string` | Foreign key → User.id |
| `role` | `"commissioner" \| "entrant"` | Role in the league |
| `joinedAt` | ISO 8601 string | Timestamp of membership creation |

**New API surface**: `GET /api/leagues/my` (authenticated) returns:

```json
{
  "success": true,
  "data": ["league-private-1"]
}
```

The `data` array contains only the `leagueId` strings for leagues the authenticated user is a
member of. The full membership object is not exposed.

---

## State Transitions

### Per-row Action cell state (frontend, derived on each render)

```
isAuthenticated = false
  → show action button (same label as authenticated), redirect to /login on click

isAuthenticated = true AND isJoined = true (any accessType)
  → "Joined" indicator — non-interactive <span> (FR-012)

isAuthenticated = true AND isJoined = false AND accessType = "joinable"
  → "Sign Up" <button> → triggers handleJoin(league.id) (FR-006)

isAuthenticated = true AND isJoined = false AND accessType = "private"
  → "Request to Join" <button> → triggers handleRequestJoin(league.id) (FR-007)
  → "Have an invite? Enter code" text-link <button> → toggles inline token input (FR-008)
     └─ "Accept Invitation" <button> → triggers handleAcceptInvitation(token) (FR-008)
```

### `joinedLeagueIds` derivation (frontend, page mount)

```
isAuthenticated = false
  → skip listMyLeagues call entirely; joinedLeagueIds = new Set()

isAuthenticated = true
  → Promise.allSettled([listLeagues(), listMyLeagues()])
     listLeagues fulfilled  → setLeagues(result.value.data)
     listLeagues rejected   → setFeedback error; setLeagues([])
     listMyLeagues fulfilled → joinedLeagueIds = new Set(result.value.data)
     listMyLeagues rejected  → joinedLeagueIds = new Set()  [graceful degradation]
```

---

## Validation Rules

- `accessType` values outside `"joinable"` / `"private"` → display `"Unknown"` badge
  (graceful fallback, Edge Cases in spec).
- Missing `commissioner` or `draftStartTime` in `LEAGUE_MOCK_METADATA` → display `"—"`.
- `isJoined` defaults to `false` when `listMyLeagues` call fails or user is unauthenticated.
- Invitation token input is trimmed before submission; the "Accept Invitation" button is
  disabled when the trimmed value is empty (preserves existing `PrivateLeagueActions` behaviour).
