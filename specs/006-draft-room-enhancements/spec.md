# Feature Specification: Draft Room Enhancements

**Feature Branch**: `006-draft-room-enhancements`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "enhance the Draft Room by adding an indicator that shows which team is up for selection by highlighting their team in the team bar up top. Make an additional enhancement by adding mock NFL-applicable statistics for each player -- TDs, Pass Yards (should be 0 for all positions but QBs), and Rush and Rec Yards for all positions"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Active Team Highlighted in League Bar (Priority: P1)

While the draft is in progress, the fantasy team whose turn it is to pick is visually distinguished from all other teams in the league header bar at the top of the Draft Room. As turns advance after each pick or timer expiry, the highlight automatically moves to the next team in draft order.

**Why this priority**: Without a clear "on the clock" indicator, users cannot tell whose turn it is — this is the minimum visual feedback required for the draft to be usable.

**Independent Test**: Can be tested by loading the Draft Room, observing that exactly one team slot in the league header bar has a distinct visual treatment compared to the others, drafting a player, and confirming the highlight moves to the next team in sequence.

**Acceptance Scenarios**:

1. **Given** the Draft Room is loaded and a draft is in progress, **When** a user views the league header bar, **Then** exactly one team slot is visually highlighted to indicate it is that team's turn to pick.
2. **Given** a user or the auto-pick timer completes a pick for the current team, **When** the turn advances, **Then** the highlight moves from the previous team to the next team in draft order.
3. **Given** the first pick is pending, **When** the Draft Room loads, **Then** the first team slot (Team 1) is highlighted.
4. **Given** a highlighted team slot is visible, **When** a user views it, **Then** the entire team box is visually highlighted (e.g., distinct border and background color) AND a bold "ON THE CLOCK" label appears directly below the team's box container, so the active state is conveyed through both visual styling and text.

---

### User Story 2 - Player Statistics Displayed in Player List (Priority: P2)

Each player entry in the player list shows their key mock NFL season statistics: total touchdowns (TDs), passing yards (QBs only; zero for all other positions), rushing yards, and receiving yards. Users can use these stats to compare players and make informed draft decisions without leaving the player list.

**Why this priority**: Player statistics are essential draft decision-making context. Without them, the player list is a name-and-position roster with no comparative information to guide picks.

**Independent Test**: Can be tested independently by loading the Draft Room player list and verifying that every player row displays the four stat fields. Verify QBs show a non-zero passing yards value and that all non-QB players show zero for passing yards. Verify all positions show values for TDs, rushing yards, and receiving yards.

**Acceptance Scenarios**:

1. **Given** the player list is displayed, **When** a user views any player entry, **Then** four statistics are shown inline on the same row as the player name and position as additional columns to the right: TDs, Pass Yards, Rush Yards, and Rec Yards.
2. **Given** a QB player entry is displayed, **When** a user views the Pass Yards stat, **Then** the value is a non-zero mock figure consistent with a typical NFL quarterback season.
3. **Given** a non-QB player entry (RB, WR, TE, K, DEF, etc.) is displayed, **When** a user views the Pass Yards stat, **Then** the value is 0.
4. **Given** any player entry is displayed, **When** a user views TDs, Rush Yards, and Rec Yards, **Then** values are present and reflect position-appropriate mock NFL season figures (e.g., RBs have higher rushing yards; WRs and TEs have higher receiving yards; Ks and DEFs have 0 for rushing and receiving yards with TDs reflecting scoring plays).
5. **Given** a user applies a position filter (e.g., QB), **When** the filtered player list is shown, **Then** statistics remain visible and correctly reflect the filtered players.

---

### Edge Cases

- When the player list is filtered and no players match, the stats area is not displayed (no empty stat rows).
- When the draft reaches the last pick and there are no more teams to highlight, the "on the clock" indicator is replaced with a "Draft Complete" indicator displayed in the league header bar (the last team's highlight is replaced, not retained).
- Mock statistics must remain internally consistent — a player's stat values should be stable and not randomly re-generated on each page render.
- Stat values for kickers (K) and defense/special teams (DEF) positions: TDs reflect scoring contributions (defensive TDs, return TDs for DEF; 0 TDs for K); rush and receiving yards are 0 for both K and DEF.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The league header bar MUST visually highlight exactly one team slot at a time to indicate that team is currently "on the clock" during the draft.
- **FR-002**: The highlight MUST automatically advance to the next team in draft order after each pick is made (manual or auto-pick).
- **FR-003**: The highlighted team slot MUST apply a visual highlight to the entire team box (distinct border and background) AND display a bold "ON THE CLOCK" label directly below the team box, so the active state is conveyed through both styling and text.
- **FR-004**: On initial Draft Room load, the team whose turn it is first MUST be highlighted in the league header bar.
- **FR-005**: Each player entry in the player list MUST display four statistics: TDs, Pass Yards, Rush Yards, and Rec Yards.
- **FR-006**: Pass Yards for QB players MUST be a non-zero mock value representative of a typical NFL quarterback season.
- **FR-007**: Pass Yards for all non-QB players MUST be displayed as 0.
- **FR-008**: TDs, Rush Yards, and Rec Yards MUST be present for all player positions with values appropriate to the position archetype (e.g., RBs skewed toward rushing yards; WRs and TEs skewed toward receiving yards).
- **FR-009**: Mock statistics for kickers (K) MUST show 0 for TDs, Rush Yards, and Rec Yards.
- **FR-010**: Mock statistics for defense/special teams (DEF) MUST show TDs reflecting defensive/return scoring opportunities and 0 for Rush Yards and Rec Yards.
- **FR-011**: Mock player statistics MUST be deterministic — the same player always shows the same stat values across renders and filter changes.
- **FR-012**: Statistics MUST remain visible when position or NFL team filters are applied to the player list.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The "on the clock" indicator MUST update without a perceptible delay (within one animation frame) after a pick is confirmed.
- **NFR-002 (Accessibility)**: The active team indicator MUST include the bold text label "ON THE CLOCK" displayed below the team box in addition to the visual highlight, satisfying the non-color differentiator requirement and supporting screen-reader users.
- **NFR-003 (Consistency)**: Mock statistics MUST be seeded in a deterministic manner so values are stable across page reloads and filter interactions.
- **NFR-004 (Readability)**: Stat values MUST be formatted in a compact, scannable format (e.g., "1,234 yds", "12 TDs") displayed as inline columns to the right of the player name and position on the same row, and MUST NOT overflow player list row boundaries at standard viewport widths.

### Key Entities

- **Player (enhanced)**: Existing player entity extended with four stat fields — `touchdowns` (integer), `passYards` (integer, non-zero for QBs only), `rushYards` (integer), `recYards` (integer).
- **DraftTurn**: Represents the currently active team index within the draft order sequence. Drives the highlight state in the league header bar.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every player entry in the player list displays all four stat fields without layout overflow at standard screen widths (1280px and above).
- **SC-002**: The "on the clock" highlight is visible to 100% of users on the Draft Room page immediately upon load and updates within one rendered frame of a pick completing.
- **SC-003**: Zero QB players display a non-zero value for Pass Yards and zero non-QB players display a non-zero Pass Yards value (100% statistical accuracy for position-gated stats).
- **SC-004**: The active team indicator passes WCAG 2.1 AA contrast requirements and includes at least one non-color visual differentiator.
- **SC-005**: Mock stat values for any given player are identical across 10 consecutive page loads (deterministic seeding verified).

---

## Assumptions

- The Draft Room page (spec 005) exists and is implemented with a functional league header bar, player list, and draft pick mechanism prior to this enhancement.
- Mock statistics are generated or seeded at build/load time and do not require a backend API call; they are embedded in the mock data layer.
- Draft order is linear (team 1 → 2 → ... → 12 → repeat); snake draft reversal is out of scope for this enhancement.
- A maximum of 12 teams participate in the draft; the highlight logic handles leagues with fewer than 12 teams by only cycling through the actual enrolled team count.
- Stat fields are display-only and do not factor into draft logic, scoring, or roster assignment in this enhancement.
- Passing yards are defined as forward pass completions only; scramble/rush yards for QBs are captured in Rush Yards.
- "Mock NFL-applicable" statistics means plausible season-level numbers (not per-game), consistent with typical full NFL regular season performance ranges.

---

## Clarifications

### Session 2026-05-29

- Q: When the final pick is made and all teams have completed their rounds, what should happen to the "on the clock" indicator? → A: Replace the last team's highlight with a "Draft Complete" indicator in the league header bar.
- Q: Where in the player list row should the four statistics be displayed? → A: Inline on the same line as the player name and position as additional columns to the right.
- Q: Is the "On the Clock" text label required as part of the active team indicator, or is a visual treatment alone sufficient? → A: Both required — entire team box highlighted visually and a bold "ON THE CLOCK" label displayed below the team's box container.
