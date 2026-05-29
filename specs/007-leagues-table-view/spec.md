# Feature Specification: Leagues Table View

**Feature Branch**: `007-leagues-table-view`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Refine the leagues page into a table format. There should be indicators for public and private leagues. There should be a column showing the Commissioner in each league (use mock data). There should be a column showing the draft's start time, nicely formatted as a date/time field (use mock data). There should be a button to request to join if it's a private league, or to sign up if it's a public league. The table should be modern and attractive."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse All Leagues in Table Format (Priority: P1)

A user visiting the Leagues page sees all available leagues presented in a structured, scannable table with clearly labelled columns for league name, visibility type, commissioner, draft start time, and an action button. Each row clearly communicates whether the league is public or private via a visual indicator.

**Why this priority**: The table layout is the core deliverable of this feature. Without it, no other story can be meaningfully tested.

**Independent Test**: Can be fully tested by opening the Leagues page and confirming the table renders with all required columns, mock data is populated for Commissioner and Draft Start Time, and public/private indicators are visible on each row.

**Acceptance Scenarios**:

1. **Given** a user opens the Leagues page, **When** the page loads, **Then** all leagues are displayed in a single unified table with columns: League Name, Type, Commissioner, Draft Start, and Action.
2. **Given** a public league row, **When** the user views it, **Then** a clear visual indicator (e.g., badge or icon) identifies it as public and the Commissioner name and a nicely formatted draft start date/time are shown.
3. **Given** a private league row, **When** the user views it, **Then** a distinct visual indicator identifies it as private and the Commissioner name and formatted draft start date/time are shown.
4. **Given** the table is loaded with mock data, **When** the user inspects it, **Then** each row shows a plausible commissioner name and a human-readable date/time for the draft start (e.g., "Jun 15, 2026 at 7:00 PM").

---

### User Story 2 - Join a Public League (Priority: P1)

A user can click a "Sign Up" button on a public league row to join that league, matching the existing join flow.

**Why this priority**: Public league sign-up is the primary conversion action on this page and must work in the new table layout.

**Independent Test**: Can be fully tested by clicking "Sign Up" on a public league row and confirming the existing join flow is triggered (success message, or login prompt if unauthenticated).

**Acceptance Scenarios**:

1. **Given** a public league row, **When** the user views the Action column, **Then** a "Sign Up" button is displayed.
2. **Given** an authenticated user clicks "Sign Up" on a public league, **When** the request succeeds, **Then** a success confirmation is shown and the leagues list refreshes.
3. **Given** an unauthenticated user clicks "Sign Up", **When** the action is triggered, **Then** the user is prompted to sign in before joining.

---

### User Story 3 - Request to Join a Private League (Priority: P1)

A user can click a "Request to Join" button on a private league row to submit a join request, matching the existing request flow.

**Why this priority**: Private league access via request is the other core action; it must remain accessible in the new table layout.

**Independent Test**: Can be fully tested by clicking "Request to Join" on a private league row and confirming the existing request-to-join flow is triggered.

**Acceptance Scenarios**:

1. **Given** a private league row, **When** the user views the Action column, **Then** a "Request to Join" button is displayed.
2. **Given** an authenticated user clicks "Request to Join" on a private league, **When** the request succeeds, **Then** a confirmation message is shown.
3. **Given** an unauthenticated user clicks "Request to Join", **When** the action is triggered, **Then** the user is prompted to sign in first.

---

### User Story 4 - Visually Attractive and Responsive Table (Priority: P2)

The table presents a modern, polished appearance that fits the platform's visual style, with sufficient spacing, readable typography, and responsive behaviour on common screen sizes.

**Why this priority**: Visual quality is important for brand perception but does not block the functional stories above.

**Independent Test**: Can be fully tested by viewing the Leagues page on desktop and tablet viewports and confirming the table is readable, well-spaced, and visually consistent with the rest of the application.

**Acceptance Scenarios**:

1. **Given** the user views the table on a desktop browser, **When** the page is rendered, **Then** the table has clear column headers, consistent row spacing, and alternating row styling or border separation for readability.
2. **Given** the user views the table on a narrow viewport (tablet), **When** the page is rendered, **Then** the table remains readable with no critical content cut off or overflowing.

---

### Edge Cases

- What happens when there are no leagues to display? The table should show an empty-state message rather than an empty or broken table.
- What happens when the leagues list fails to load? The existing error feedback banner must still appear.
- What happens when a league has neither `joinable` nor `private` access type? The Type indicator should fall back gracefully (e.g., display "Unknown").
- What happens when mock data is absent for commissioner or draft start time? Each field should render a sensible placeholder (e.g., "—") rather than blank or undefined.
- What happens when an authenticated user has already joined a league? The Action column displays a non-interactive "Joined" indicator instead of an action button.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Leagues page MUST display all leagues in a single table replacing the current separate lists for joinable and private leagues.
- **FR-002**: The table MUST include columns: League Name, Type (public/private), Commissioner, Draft Start, and Action.
- **FR-003**: Each league row MUST display a visual indicator (e.g., coloured badge or labelled icon) showing "Public" for leagues with `accessType: "joinable"` and "Private" for leagues with `accessType: "private"`.
- **FR-004**: Each league row MUST display a Commissioner name sourced from mock data.
- **FR-005**: Each league row MUST display the draft's scheduled start time formatted as a human-readable date and time (e.g., "Jun 15, 2026 at 7:00 PM"), sourced from mock data.
- **FR-006**: Public league rows MUST display a "Sign Up" button in the Action column that triggers the existing join flow.
- **FR-007**: Private league rows MUST display a "Request to Join" button in the Action column that triggers the existing request-to-join flow.
- **FR-008**: The existing invitation-link acceptance flow for private leagues MUST remain accessible via a secondary text link (e.g., "Have an invite? Enter code") displayed beneath the "Request to Join" button within the same Action cell for private league rows.
- **FR-009**: When there are no leagues, the table MUST display an empty-state message.
- **FR-010**: The existing `FeedbackBanner` component MUST continue to surface success, error, and warning messages as before.
- **FR-011**: Unauthenticated users MUST be able to view the table in read-only mode; action buttons MUST redirect to sign-in when clicked.
- **FR-012**: League rows for leagues the authenticated user has already joined MUST display a non-interactive "Joined" indicator (label or badge) in the Action column in place of any action button. Membership is determined client-side by cross-referencing the `listLeagues` response with the user's joined-leagues list fetched in parallel.
- **FR-013**: Clicking on a league row outside the Action column MUST NOT trigger any navigation or interaction; only the Action button and invitation text link are interactive elements within a row.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The table MUST render within the same time frame as the existing list-based layout. One additional parallel API call to retrieve the current user's joined leagues is permitted; it MUST be made in parallel with `listLeagues`, not sequentially, to avoid added latency.
- **NFR-002 (Accessibility)**: The table MUST use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th scope="col">`) to support screen readers.
- **NFR-003 (Accessibility)**: Colour alone MUST NOT be the sole differentiator for public vs. private; a text label or icon with aria-label must accompany any colour indicator.
- **NFR-004 (Responsiveness)**: The table MUST remain usable on viewports as narrow as 768px (tablet) without horizontal scroll cutting off the Action column.
- **NFR-005 (Visual Consistency)**: The table styling MUST be consistent with the existing platform design language (colours, typography, spacing).

### Key Entities

- **League**: Represents a fantasy sports league. Key attributes for display: `id`, `name`, `accessType` (`joinable` | `private`), `status`, `memberCount`, `maxEntrants`. The `accessType` value `"joinable"` maps to the user-facing label **"Public"**; `"private"` maps to **"Private"**.
- **Mock Commissioner**: A display-only name string associated with each league row (not persisted or fetched from the API in this feature).
- **Mock Draft Start Time**: A display-only ISO 8601 date-time string associated with each league row (not persisted or fetched from the API in this feature).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All leagues are visible in a single table on the Leagues page — no separate "Joinable" and "Private" sections exist.
- **SC-002**: Every league row shows a public or private badge/indicator, a commissioner name, and a formatted draft start date/time without blank or undefined values.
- **SC-003**: Clicking "Sign Up" on a public league row completes the full join interaction (success or appropriate error/redirect) with no regression from the pre-existing behaviour.
- **SC-004**: Clicking "Request to Join" on a private league row completes the full request interaction (success or appropriate error/redirect) with no regression from the pre-existing behaviour.
- **SC-005**: The table renders without layout breakage on both 1280px desktop and 768px tablet viewport widths.
- **SC-006**: The page passes an automated accessibility check with no critical violations related to table structure or colour contrast.

## Assumptions

- The existing `listLeagues` API service call and response shape (`id`, `name`, `accessType`, `status`, `memberCount`, `maxEntrants`) are unchanged; this feature only modifies the presentation layer.
- An existing endpoint returning the current user's joined leagues is available and fetched in parallel with `listLeagues` on page load to enable client-side membership cross-referencing.
- Mock data for Commissioner and Draft Start Time will be defined as static arrays or objects in the frontend code and keyed to league `id`; no backend changes are required.
- The invitation-link flow already handled by `PrivateLeagueActions` is preserved as a secondary text link beneath the "Request to Join" button within the Action cell; it is de-emphasised relative to the primary button but remains in-row.
- Mobile viewports narrower than 768px are out of scope for this feature; a horizontal-scroll fallback is acceptable below that breakpoint.
- The table does not require server-side pagination for the expected number of leagues at this stage.

## Clarifications

### Session 2026-05-29

- Q: Should already-joined leagues appear in the table, and if so, what does the Action column show? → A: Already-joined leagues appear in the table with a "Joined" label/badge in the Action column instead of a button.
- Q: Where should the existing private-league invitation-link flow appear in the table layout? → A: Secondary text link beneath the "Request to Join" button within the same Action cell.
- Q: Should clicking a league row (outside the Action column) navigate to a league detail page? → A: No row-level navigation; only the Action button and invitation text link are interactive.
- Q: What user-facing labels should the public/private badge display? → A: "Public" (for `accessType: "joinable"`) and "Private" (for `accessType: "private"`).
- Q: How should the frontend determine which leagues the current user has already joined, given no `isMember` field in the `listLeagues` response? → A: Cross-reference with a separate user's joined-leagues API call made in parallel on page load.
