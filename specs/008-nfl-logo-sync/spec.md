# Feature Specification: NFL Team Logo Sync & Draft Room Display

**Feature Branch**: `008-nfl-logo-sync`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "I'd like to build out functionality to sync team logos from the ESPN API and show them in the Draft Room along with the team abbreviations. The one difference here is I am not ready to integrate AWS/S3 so we should store and retrieve the images locally."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Team Logos in the Draft Room (Priority: P1)

A user opens the Draft Room and sees each player card in the draft pool displaying the player's NFL team logo and abbreviation. The logos have been pre-synced and are served locally — no external API call happens at page load time.

**Why this priority**: Displaying logos in the Draft Room is the primary visible outcome for end users. All other stories in this feature support this one. If logos are present, the feature delivers user value immediately.

**Independent Test**: Can be tested by running the logo sync ahead of time, then opening the Draft Room and confirming each player card shows the player's NFL team logo and abbreviation side by side. No ESPN API connection is required for this test.

**Acceptance Scenarios**:

1. **Given** logos have been synced and stored locally, **When** a user opens the Draft Room, **Then** each player card in the draft pool displays the player's NFL team logo and abbreviation.
2. **Given** a player card has a locally stored team logo, **When** the Draft Room renders, **Then** logos are sized consistently across all player cards and do not distort the layout.
3. **Given** a player's team logo file is missing or cannot be loaded, **When** the Draft Room renders that player card, **Then** a fallback (team abbreviation text or generic placeholder icon) is displayed instead of a broken image.

---

### User Story 2 - Run Logo Sync to Download and Store Logos Locally (Priority: P2)

A developer runs a sync script on the backend. The script fetches all 32 NFL teams from the ESPN API, downloads each team's logo image, and saves it to a local directory. Team metadata — including name, abbreviation, and relative logo file path — is persisted so the frontend can reference the images.

**Why this priority**: Without the sync having been run, the Draft Room has no logos to display. The sync is a prerequisite to story 1 but is a developer/admin operation rather than an end-user flow, making it P2 by user impact.

**Independent Test**: Can be tested by running the sync script from the command line, then verifying that image files exist on disk for each NFL team and that team records in the data store include the correct logo path and abbreviation.

**Acceptance Scenarios**:

1. **Given** a developer runs the logo sync, **When** the script completes, **Then** logo image files exist locally for all 32 NFL teams, named by team abbreviation (e.g., `min.png`).
2. **Given** the sync runs successfully, **When** a team's record is inspected, **Then** it contains the team name, abbreviation, local logo file path, and primary team color.
3. **Given** a logo download fails for one team during sync, **When** the script continues, **Then** it proceeds with the remaining teams and reports which teams failed at the end without halting execution.
4. **Given** the sync has already been run previously, **When** it is run again, **Then** existing logo files are overwritten with the latest versions from ESPN.

---

### User Story 3 - Team Logos in NFL Team Filter (Priority: P3)

When a user filters the player list in the Draft Room by NFL team, each team option in the filter shows the team's logo alongside the team name or abbreviation. This helps users quickly identify teams visually.

**Why this priority**: This enhances an existing filter interaction. It is a quality-of-life improvement that builds on stories 1 and 2 without blocking them — the filter works without logos but is more usable with them.

**Independent Test**: Can be tested by opening the Draft Room, opening the "NFL Team" filter dropdown or list, and confirming that team logos appear next to each team option.

**Acceptance Scenarios**:

1. **Given** logos are stored locally, **When** a user opens the NFL team filter in the Draft Room, **Then** each team option displays the team's logo image next to the team name or abbreviation.
2. **Given** a team's logo is missing, **When** that team appears in the filter, **Then** only the team name or abbreviation is shown without breaking the filter layout.

---

### Edge Cases

- What happens when the ESPN API is unavailable or returns an error during sync? The sync should fail gracefully, log the error, and report which teams could not be fetched.
- What if a logo image URL returns a non-image or empty response? The team is skipped for that run, and the failure is reported in the sync summary.
- What if the local storage directory does not exist or is not writable? The sync should fail early with a clear error message indicating the directory issue.
- What if the Draft Room loads before any logos have been synced? Player cards fall back to showing the abbreviation or a generic placeholder — the page must not break or show broken image elements.
- What if the same sync is run concurrently by two processes? The behavior should be deterministic; files written by whichever process completes last are retained, and no partial/corrupt files persist.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a runnable sync operation that fetches all NFL team data from the ESPN public teams API.
- **FR-002**: System MUST download each team's logo image from the URL provided in the ESPN API response and save it to `packages/frontend/public/logos/nfl/` (written directly by the backend sync script using a relative cross-package path).
- **FR-003**: System MUST name each saved logo file by the team's lowercase abbreviation (e.g., `min.png`, `ne.png`).
- **FR-004**: System MUST persist team metadata — including team name, abbreviation, and relative path to the local logo file — in a backend database table (e.g., `nfl_teams`) so it can be retrieved by the frontend via a backend API endpoint.
- **FR-005**: System MUST also persist each team's primary color (as provided by ESPN) in the same database table alongside the other team metadata.
- **FR-006**: The sync operation MUST continue processing remaining teams if a single team's logo download fails, and MUST report all failures upon completion.
- **FR-007**: Logo image files MUST be stored in the frontend `public/` directory (e.g., `public/logos/nfl/<abbreviation>.png`) so the browser can fetch them as static assets with no backend involvement.
- **FR-008**: The Draft Room MUST display each player card with the player's NFL team logo image and abbreviation side by side.
- **FR-009**: The Draft Room MUST display a fallback (abbreviation text or placeholder icon) for any player card whose team logo cannot be loaded, without showing a broken image indicator.
- **FR-010**: The NFL team filter in the Draft Room MUST display team logos alongside team names or abbreviations when logos are available.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The logo sync MUST include a delay between individual team logo downloads to avoid overwhelming the ESPN CDN; the total sync duration for all 32 teams is acceptable up to a few minutes.
- **NFR-002 (Reliability)**: The Draft Room page MUST load and display player cards correctly regardless of whether logos have been synced, ensuring no runtime errors from missing images.
- **NFR-003 (Accessibility)**: All team logo images in the Draft Room MUST include descriptive alt text containing the team name so screen readers can identify each team.
- **NFR-004 (Security)**: The ESPN API is a public endpoint requiring no authentication; no credentials or API keys should be stored or committed.
- **NFR-005 (Observability)**: The sync operation MUST output a summary upon completion indicating how many teams succeeded, how many failed, and the names of any failed teams.

### Key Entities

- **NFL Team**: Represents a single NFL franchise stored in a backend database table. Key attributes: ESPN team ID, full name, city/location, abbreviation, primary color (hex), alternate color (hex), local logo file path.
- **Logo File**: A PNG image file stored under the frontend `public/logos/nfl/` directory, keyed by lowercase team abbreviation (e.g., `public/logos/nfl/min.png`). Accessed by the browser as a static asset with no backend route required.

---

## Clarifications

### Session 2026-05-29

- Q: Where does the fantasy team → NFL team association come from in the Draft Room? → A: The Draft Room shows each *player's* NFL team logo on the player card, not the fantasy team's logo; there is no fantasy-team-to-NFL-team mapping.
- Q: How are locally stored logo files served to the frontend — static assets or backend endpoint? → A: Logos are stored in the frontend `public/logos/nfl/` directory and served as static assets by the browser; no backend route is needed.
- Q: Where is NFL team metadata persisted — database, JSON file, or frontend constant? → A: In a backend database table (e.g., `nfl_teams`), exposed to the frontend via a backend API endpoint.
- Q: Where does the sync script live and how is it invoked? → A: A standalone Node.js script in `packages/backend/scripts/`, invoked via an npm script (e.g., `npm run sync:nfl-logos`).
- Q: Does the backend sync script write logos directly into the frontend `public/` folder or a shared directory? → A: Directly into `packages/frontend/public/logos/nfl/` via a relative cross-package path; no shared directory needed.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After running the logo sync, logo image files are present on disk for all 32 NFL teams.
- **SC-002**: Every player card in the Draft Room displays a visible team logo (or a clean fallback) — no broken image icons appear.
- **SC-003**: The Draft Room page load time does not increase by more than 1 second compared to the current baseline, since logos are served locally rather than fetched from an external source at runtime.
- **SC-004**: 100% of successfully synced teams show the correct logo matched to the correct abbreviation on player cards in the Draft Room.
- **SC-005**: The sync operation completes for all available NFL teams in a single run with no unhandled exceptions.

---

## Assumptions

- Logo sync is a developer-initiated operation implemented as a standalone Node.js script at `packages/backend/scripts/syncNflLogos.js`, invoked via an npm script (e.g., `npm run sync:nfl-logos` from the backend package). It is not triggered automatically on app startup or by end users through a UI.
- The ESPN public teams API (`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=1000`) does not require authentication and remains publicly accessible.
- The Draft Room currently shows player cards with NFL team abbreviations; this feature will enhance those cards to also display the corresponding NFL team logo alongside the abbreviation.
- Logo files are stored as PNG images; if ESPN returns a different format via the URL, it is treated as-is.
- A 500ms delay between logo downloads is sufficient to avoid rate limiting, consistent with the referenced sync instructions.
- Team metadata (name, abbreviation, color, logo path) is persisted in the backend database and exposed to the frontend via a backend API endpoint (e.g., `GET /api/nfl-teams`).
- Logo files are stored under the frontend `public/logos/nfl/` directory (`packages/frontend/public/logos/nfl/`), written directly by the backend sync script via a relative cross-package path; no shared root-level directory is required.
- Team colors fetched from ESPN are stored but their use in the Draft Room UI is out of scope for this feature; they are persisted for future use.
- Re-running the sync overwrites previously downloaded logos — no versioning or backup of prior files is required.
