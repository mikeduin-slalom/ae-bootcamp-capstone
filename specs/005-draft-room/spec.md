# Feature Specification: Draft Room

**Feature Branch**: `005-draft-room`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Add the Draft Room as an additional CTA on the site homepage. This CTA should take us to a modern- and attractive-looking fantasy football draft room, which will be a new page we should create. The top section of the Draft Room page should have a header-like bar with slots for up to a 12-team league, which each slot indicating each team (include space for a logo and the team name — utilize mock data for now, but we will want this mock data to be functional as if the league were real). Other features the Draft Room should include are a pick timer (5 minutes per pick), and a list of players which can be filtered by position and NFL team (utilize mock data for now). It should also incorporate functionality that allows a player to be drafted, and then saved to a fantasy team, and when a user clicks a specific fantasy team at the top of the draft room, the user should see a list of their players."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter the Draft Room from the Homepage (Priority: P1)

A visitor on the site homepage sees a "Draft Room" call-to-action (CTA) button alongside existing CTAs. Clicking it navigates to the new Draft Room page, where they see the full draft interface: a league header bar showing up to 12 team slots, a player list with filters, and a pick timer.

**Why this priority**: The CTA entry point is the gateway to the entire feature. Without it, no user can access the Draft Room; all other stories depend on this navigation existing.

**Independent Test**: Can be tested by loading the homepage, verifying the Draft Room CTA is visible, clicking it, and confirming the Draft Room page loads with the league bar, player list, and timer visible.

**Acceptance Scenarios**:

1. **Given** a user is on the homepage, **When** they view the CTA section, **Then** a "Draft Room" CTA button is displayed alongside the existing primary CTAs.
2. **Given** a user clicks the "Draft Room" CTA, **When** the navigation occurs, **Then** they are taken to the Draft Room page and see a league header bar with up to 12 team slots, a player list, and a running pick timer.
3. **Given** a user lands on the Draft Room page, **When** the page loads, **Then** all 12 team slots are populated with mock team names and logo placeholders.

---

### User Story 2 - Draft a Player and Assign to a Fantasy Team (Priority: P2)

A user browsing the player list in the Draft Room selects a player to draft. The player is marked as drafted and assigned to the currently active fantasy team's roster. The player can no longer be selected again.

**Why this priority**: Drafting players is the core interaction of the Draft Room. Without it the page is a read-only display.

**Independent Test**: Can be tested independently by loading the Draft Room, clicking "Draft" on any player, verifying the player moves to the active team's roster, and confirming the player is no longer available in the player list.

**Acceptance Scenarios**:

1. **Given** a player is available in the player list, **When** a user clicks the "Draft" action for that player, **Then** the player is removed from the available player list and assigned to the currently active fantasy team.
2. **Given** a player has been drafted, **When** a user views the player list, **Then** that player no longer appears as selectable.
3. **Given** a player is drafted, **When** the pick is saved, **Then** the active team slot in the league header reflects the updated roster count or visual indicator.

---

### User Story 3 - View a Fantasy Team's Drafted Roster (Priority: P3)

A user clicks on a specific fantasy team slot in the league header bar. A panel or view appears showing the complete list of players that have been drafted to that team so far.

**Why this priority**: Roster visibility is essential for meaningful drafting decisions and validates that the draft-and-save flow works end-to-end.

**Independent Test**: Can be tested by drafting one or more players to a team, then clicking that team's slot in the header bar, and confirming the drafted player(s) appear in the team's roster view.

**Acceptance Scenarios**:

1. **Given** a fantasy team has drafted players, **When** a user clicks that team's slot in the league header bar, **Then** a roster list displays all players currently assigned to that team.
2. **Given** no players have been drafted to a team, **When** a user clicks that team's slot, **Then** an empty roster state is shown (e.g., "No players drafted yet").
3. **Given** a team's roster panel is open, **When** a new player is drafted to that team, **Then** the roster list updates to include the new player.

---

### User Story 4 - Filter the Player List by Position and NFL Team (Priority: P4)

A user wants to quickly find players at a specific position (e.g., QB, RB, WR, TE, K, DEF) or on a particular NFL team. They use filter controls on the player list to narrow down results.

**Why this priority**: Filtering is a productivity feature that becomes important once the player pool is large; it improves the draft experience but does not block MVP functionality.

**Independent Test**: Can be tested independently by applying a position filter and confirming only players at that position are shown, then applying an NFL team filter and confirming only players from that team are shown.

**Acceptance Scenarios**:

1. **Given** the player list is displayed, **When** a user selects a position filter (e.g., "QB"), **Then** only players at that position are shown in the list.
2. **Given** the player list is displayed, **When** a user selects an NFL team filter (e.g., "Kansas City Chiefs"), **Then** only players from that NFL team are shown.
3. **Given** both a position and NFL team filter are active, **When** a user views the player list, **Then** only players matching both criteria are shown.
4. **Given** a filter is active, **When** a user clears all filters, **Then** the full available player list is restored.

---

### User Story 5 - Pick Timer Counts Down Per Pick (Priority: P5)

The Draft Room displays a visible countdown timer set to 5 minutes. The timer runs during each pick. When the timer reaches zero, the first available player in the unfiltered player list is automatically drafted to the active team before the turn advances.

**Why this priority**: The timer adds urgency and realism to the draft experience but is an enhancement over the core draft-and-assign flow.

**Independent Test**: Can be tested independently by loading the Draft Room, observing the timer count down from 5:00, and verifying it reaches 0:00 and triggers a visible state change.

**Acceptance Scenarios**:

1. **Given** the Draft Room is open, **When** the page loads, **Then** a visible timer shows 5:00 and begins counting down.
2. **Given** the timer is running, **When** a user drafts a player, **Then** the timer resets to 5:00 for the next pick.
3. **Given** the timer reaches 0:00 before a pick is made, **When** time expires, **Then** the first available player in the unfiltered player list is automatically drafted to the active team, the turn advances to the next team, and the timer resets to 5:00.

---

### Edge Cases

- What happens when all 12 team roster slots are filled and more players are available — can drafting continue?
- When the player list is empty after filters are applied, the list area displays an inline empty-state message (e.g., "No players match your filters") with no auto-clear or predictive disabling of filter options.
- What happens if a user refreshes the Draft Room mid-draft — is draft state preserved or reset?
- What happens if a user attempts to draft a player who was just drafted by another team simultaneously (concurrency edge case for future real-time implementation)?
- League always has exactly 12 teams via mock data; sub-12 team configurations are out of scope for v1.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST display a "Draft Room" CTA button added to the existing primary CTA group, at equal visual prominence to the other primary CTAs, that navigates to the Draft Room page.
- **FR-002**: The Draft Room page MUST display a league header bar with up to 12 team slots, each showing a team logo placeholder and team name using mock data.
- **FR-003**: The Draft Room page MUST display a scrollable list of available NFL players populated with mock data, each showing player name, position, and NFL team.
- **FR-004**: The player list MUST be filterable by player position (QB, RB, WR, TE, K, DEF) and by NFL team name.
- **FR-005**: The Draft Room MUST display a visible countdown timer initialized to 5 minutes (5:00) per pick that runs continuously.
- **FR-006**: When the timer reaches 0:00, the system MUST automatically draft the first available player in the unfiltered player list to the active team, advance the pick to the next team, and reset the timer to 5:00.
- **FR-007**: When a user drafts a player, the system MUST remove the player from the available player list and assign them to the currently active fantasy team's roster.
- **FR-008**: A drafted player MUST NOT be selectable or draftable again within the same draft session.
- **FR-009**: When a user clicks a team slot in the league header bar, the system MUST display a roster panel listing all players currently assigned to that team.
- **FR-010**: When a team has no drafted players, the roster panel MUST display an empty state message.
- **FR-011**: The Draft Room CTA on the homepage MUST be added to the existing primary CTA group with equal visual weight and the same button style as the other primary CTAs.
- **FR-012**: Mock data for teams and players MUST be structured to represent a realistic fantasy football draft scenario (e.g., realistic player names, positions, NFL team affiliations, team logos as placeholder images).
- **FR-013**: When active filters produce zero matching players, the player list area MUST display an inline empty-state message (e.g., "No players match your filters") instead of a blank area.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The Draft Room page MUST load and become interactive within 3 seconds on a standard broadband connection.
- **NFR-002 (Responsiveness)**: The Draft Room layout MUST be usable on desktop screens (1024px and above); mobile support is out of scope for v1.
- **NFR-003 (Accessibility)**: Interactive elements (draft button, filters, team slots) MUST be keyboard-navigable and have sufficient color contrast (WCAG AA).
- **NFR-004 (Visual Quality)**: The Draft Room page MUST have a modern, polished appearance consistent with the site's design language as defined in the UI guidelines.
- **NFR-005 (State Integrity)**: Drafted player assignments MUST remain consistent within a single browser session (no player appearing on two rosters simultaneously).

### Key Entities *(include if feature involves data)*

- **League**: A collection of up to 12 fantasy teams participating in the same draft; has a name and ordered list of teams.
- **FantasyTeam**: A slot in the league header bar; has a team name, logo placeholder, and an ordered list of drafted players.
- **NFLPlayer**: An available player in the draft pool; has a name, position (QB/RB/WR/TE/K/DEF), NFL team affiliation, and a drafted/available status.
- **DraftPick**: An association between an NFLPlayer and a FantasyTeam at a specific pick number; records who was drafted when and to which team.
- **DraftState**: The current state of the draft session including the active team's turn, current pick number, and timer value.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can navigate from the homepage to the Draft Room page in one click.
- **SC-002**: All 12 team slots are visible and labeled in the league header bar without horizontal scrolling on a 1280px-wide screen.
- **SC-003**: A user can draft a player and see that player appear in the target team's roster panel within 1 second of the action.
- **SC-004**: The position and NFL team filters each reduce the visible player list to only matching players with no incorrect inclusions.
- **SC-005**: The pick timer counts down from 5:00 to 0:00 and auto-advances correctly on expiration, verified across 3 consecutive picks.
- **SC-006**: No player appears on more than one team's roster after a complete draft session.
- **SC-007**: The Draft Room page achieves a visual quality rating that is consistent with existing pages in the project (peer review confirms modern, attractive design).

---

## Assumptions

- Mock data will be defined as static JavaScript/JSON files within the frontend package; real API integration is out of scope for this feature.
- The draft order follows a simple sequential rotation (Team 1 → Team 2 → … → Team 12 → Team 1) — snake draft ordering is out of scope for v1.
- Each fantasy team's roster has no hard cap on the number of players for v1 (position limits and roster rules are out of scope).
- The draft operates as a **single-user simulation**: the user makes picks on behalf of all 12 teams in sequential order. There is no team ownership assignment, no CPU auto-pick mechanic, and no distinction between "the user's team" and other teams.
- The "active team" whose turn it is to pick is determined by the current pick number and draft order; it advances automatically after each pick or timer expiration.
- The Draft Room page does not require user authentication — it is accessible to any visitor.
- Draft state is not persisted between browser sessions; a page refresh resets the draft.
- Team logo placeholders will use a generic image/icon; real team logos are out of scope for v1.
- The design will follow the site's existing visual language (color palette, typography, component style) as defined in the UI guidelines.
- The NFL player pool will contain a representative set of players (approximately 100–200 mock players) across all positions and NFL teams.
- Mock league data always defines exactly 12 teams; sub-12 team configurations are out of scope for v1 and the league header always renders all 12 slots as active.

---

## Clarifications

### Session 2026-05-29

- Q: Who controls picks for non-user teams — single-user simulation (user acts for all 12 teams) or user owns one team with CPU/auto-pick for others? → A: Single-user simulation — the user drafts for all 12 teams in sequential order; no CPU auto-pick or team ownership concept exists in v1.
- Q: What should the UI display when active filters yield zero matching players? → A: An inline empty-state message in the player list area (e.g., "No players match your filters"); no auto-clear or predictive filter disabling.
- Q: How should the league header handle fewer-than-12-team configurations — inactive slots or hidden slots? → A: Mock data always defines exactly 12 teams; all 12 slots are always active and visible; sub-12 support is out of scope for v1.
- Q: When the pick timer expires, is the pick skipped (no player assigned) or auto-assigned? → A: Auto-assign — the first available player in the unfiltered player list is automatically drafted to the active team before the turn advances.
- Q: How should the Draft Room CTA be placed on the homepage — in the existing primary CTA group (equal prominence) or as a secondary CTA? → A: Added to the existing primary CTA group at equal visual weight and style as the other primary CTAs.
