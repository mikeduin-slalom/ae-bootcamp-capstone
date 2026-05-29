# Research: Leagues Table View

**Feature**: 007-leagues-table-view
**Date**: 2026-05-29

---

## Findings

### 1. Semantic HTML table for accessibility (FR-002, NFR-002)

**Decision**: Use native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, `<td>`.

**Rationale**: NFR-002 explicitly mandates semantic HTML. Native table elements provide built-in
screen-reader support through header-cell association via the `scope` attribute. No additional
ARIA roles are needed when native semantics are used correctly.

**Alternatives considered**: CSS Grid / Flexbox "table-like" layout — rejected because it requires
manual ARIA role additions and is harder to maintain long-term.

---

### 2. Mock data strategy for Commissioner and Draft Start Time (FR-004, FR-005)

**Decision**: Static lookup object in `packages/frontend/src/constants/leaguesMockData.js`,
keyed by league `id`. Falls back to `"—"` for any key not present.

**Rationale**: Matches the pattern already established by `draftMockData.js` in the same
constants folder. No backend changes or extra API calls needed for mock data; values are
deterministic by design (identical across renders).

**Alternatives considered**:
- Adding mock fields to the backend `leagues` dataStore — rejected because the spec states
  "no backend changes required" for mock data; the backend dataStore shape is intentionally
  unchanged.
- Generating values at render time with `Math.random()` — rejected because non-deterministic
  values complicate snapshot testing and violate the "deterministic mock data" principle from
  the 006 plan.

---

### 3. Determining per-row membership status client-side (FR-012, NFR-001)

**Decision**: Add `GET /api/leagues/my` backend endpoint (authenticated, Bearer token required).
Frontend calls `Promise.allSettled([listLeagues(), listMyLeagues()])` on mount. Unauthenticated
users skip `listMyLeagues` entirely (no auth token in context, no request made).

**Rationale**: The spec explicitly requires "a separate user's joined-leagues API call made in
parallel on page load." `Promise.allSettled` satisfies NFR-001 (no sequential latency) while
enabling graceful degradation when `listMyLeagues` rejects (treat joined set as empty).

The backend already tracks memberships in the `memberships` array in `dataStore.js`.
`leagueAccessService.js` has the private `hasMembership` helper; a new exported
`getUserLeagueIds(userId)` function simply filters `memberships` by `userId` and returns the
`leagueId` array.

**Alternatives considered**:
- Adding `isMember` field to the `listLeagues` response — rejected per spec Assumption:
  "The existing `listLeagues` API service call and response shape are unchanged."
- Client-side-only state tracking after join actions — rejected because it does not handle
  stale page loads (e.g., user joined a league in a prior session).

---

### 4. Graceful degradation when `listMyLeagues` fails (FR-012)

**Decision**: Use `Promise.allSettled` and check each result's `status`. If `listMyLeagues`
settles as `"rejected"`, treat `joinedLeagueIds` as an empty Set. The user will see action
buttons instead of "Joined" badges — safe, slightly over-permissive, non-blocking behavior.

**Rationale**: Avoids blocking the entire Leagues page because of a non-critical membership
lookup failure.

**Alternatives considered**: Hard-fail the whole page — rejected because `listLeagues` data is
still useful and the join actions remain functional.

---

### 5. Public/Private badge visual design (FR-003, NFR-003)

**Decision**: Inline `<span>` badge with text label ("Public" / "Private"), colour-coded via CSS
class, with an `aria-label` attribute matching the text label.

**Rationale**: NFR-003 forbids colour-only differentiation. The text label inside the badge
satisfies that constraint. `aria-label` duplicates the visible text for explicit accessibility
coverage. Plain CSS classes are sufficient — no new dependency needed.

**Alternatives considered**:
- Icon-only approach (e.g., lock icon) — rejected because it requires an icon library or inline
  SVG and adds complexity; text badges are simpler and equally accessible.
- Semantic UI Label component — rejected because no Semantic UI dependency exists in the
  frontend package.

---

### 6. Invitation flow preservation in the table (FR-008)

**Decision**: Within the Action `<td>` for private league rows (when not joined), render
"Request to Join" as the primary `<button>`, followed by a secondary `<button>` styled as a
text link ("Have an invite? Enter code") that toggles an inline token input + "Accept" button.
This consolidates the existing `PrivateLeagueActions` functionality into a single table cell
without importing the existing component unchanged (its card-style layout overflows a table
cell).

**Rationale**: The spec requires "a secondary text link beneath the 'Request to Join' button
within the same Action cell." An inline toggle is the simplest implementation that keeps
everything within one `<td>`.

**Alternatives considered**: Keeping `PrivateLeagueActions` as-is and embedding it — possible,
but the existing component expands to a large card that breaks table row height. The inline
approach avoids that issue with minimal added logic.

---

### 7. Date/time formatting for Draft Start Time (FR-005)

**Decision**: Use the built-in `Intl.DateTimeFormat` API with options
`{ month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }`
to produce output like "Jun 15, 2026 at 7:00 PM".

**Rationale**: Built-in browser API with no additional dependency. Locale-aware by default;
deterministic for a fixed input string.

**Alternatives considered**: `date-fns` or `dayjs` — rejected because no new npm dependencies
are permitted (per constraints matching the 006 plan convention).

---

### 8. Responsive layout at 768px (NFR-004)

**Decision**: Apply `min-width` CSS on the table container; use percentage-based column widths
with the Action column given a fixed minimum. At viewports ≥ 768px the table renders without
horizontal scroll. Below 768px a horizontal-scroll container is an acceptable fallback per the
spec Assumptions.

**Rationale**: NFR-004 requires the table to remain usable at 768px without the Action column
being cut off. The existing `App.css` max-width of 980px provides the outer container; inner
column widths can be tuned with CSS.

**Alternatives considered**: Hiding columns on mobile — rejected because the spec scope only
goes down to 768px and column hiding adds unnecessary complexity.

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|-----------|
| No existing `GET /api/leagues/my` endpoint | Add additive route; expose `getUserLeagueIds` from `leagueAccessService` |
| Mock commissioner/draft-time data source | Static lookup in `leaguesMockData.js` keyed by league id |
| Date formatting without a date library | `Intl.DateTimeFormat` (built-in) |
| Invitation flow in a table cell | Inline toggle button expands token input within the `<td>` |
| How `isJoined` degrades if `listMyLeagues` fails | `Promise.allSettled` → empty Set default |
