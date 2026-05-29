# Functional Requirements

## Overview
Fantasy Football Playoffs Draft is a private-league playoff fantasy platform where users create or join leagues, run a live snake draft, and compete via near-real-time scoring and standings.

This document defines MVP behavior in testable terms. Requirements prioritize draft integrity, scoring correctness, and clear user feedback.

## Functional Scope

### 1. Core Domain Objects
- User: id, displayName, email, authProviderId, createdAt
- League: id, name, commissionerUserId, inviteCode, status, maxEntrants, scoringConfigId, draftConfigId, createdAt
- LeagueMembership: id, leagueId, userId, role, joinedAt
- DraftSession: id, leagueId, status, currentPickNumber, currentRound, pickDeadlineAt, startedAt, completedAt, pausedAt
- DraftPick: id, leagueId, draftSessionId, roundNumber, overallPickNumber, userId, playerExternalId, pickedAt, wasAutoPick
- TeamRoster: id, leagueId, userId, createdAt
- TeamRosterPlayer: id, teamRosterId, playerExternalId, position, draftedAt
- PlayerStatSnapshot: id, playerExternalId, sourceProvider, sourceEventId, snapshotTimestamp, statPayload
- ScoreSnapshot: id, leagueId, userId, totalPoints, computedAt, weekOrStage
- StandingsEntry: id, leagueId, userId, rank, totalPoints, tieBreakerValue, updatedAt
- ScoringConfig: id, leagueId, pointRulesJson, tieBreakerRulesJson

### 1.1 Core Relationship Rules
- One user can belong to many leagues; one league has many users.
- A league has exactly one commissioner role.
- A user has exactly one team roster per league.
- A player can be drafted at most once per league.
- A draft session belongs to exactly one league.
- Score snapshots are append-only and generated from stat snapshots plus scoring config.

### 1.2 League Lifecycle States
- pending: league open for configuration and joining.
- draft_ready: league full or manually marked ready.
- drafting: live draft in progress.
- scoring_live: draft complete and games in progress.
- completed: playoff scoring finalized.
- cancelled: league voided by commissioner before draft completion.

### 2. Core Features

#### 2.1 League Creation, Configuration, and Join
- Description:
	- Commissioners can create private playoff leagues, configure draft and scoring settings, and invite entrants.
	- Entrants can join via invite code while the league is joinable.
- Required inputs:
	- League name
	- Max entrants
	- Draft timer duration (seconds)
	- Draft roster rules (slots and eligible positions)
	- Scoring rules and tie-breaker rules
	- Invite code for join requests
- Behavior:
	- System creates league in pending state.
	- System automatically adds creator as commissioner membership.
	- System generates unique invite code.
	- Users can join until max entrants is reached.
	- Commissioner can edit settings only while league is pending.
	- League transitions to draft_ready when requirements to start draft are met.
- Validation rules:
	- League name required, 3 to 60 characters.
	- Max entrants must be between 2 and 16.
	- Draft timer must be between 15 and 180 seconds.
	- Invite code must match active pending or draft_ready league.
	- Duplicate membership in same league is rejected.
	- Settings updates after drafting begins are rejected except fields explicitly marked runtime-safe.
- Critical edge cases:
	- Join request races when one slot remains.
	- Invalid, expired, or reused invite code.
	- Commissioner leaves league before draft starts.

#### 2.2 Live Snake Draft With Timer and Auto-Pick
- Description:
	- League entrants join a live draft room. Picks happen in deterministic snake order with a visible countdown.
	- If a user times out, the system auto-picks based on configured strategy.
- Required inputs:
	- Draft start command (commissioner)
	- Draft order seed or randomized order accepted at draft start
	- User pick submissions
	- Auto-pick strategy configuration
	- Pause or resume actions (commissioner)
- Behavior:
	- System generates and persists full draft order by round.
	- System activates exactly one pick window at a time.
	- System accepts a pick only from the active drafter before deadline.
	- On timeout, system creates auto-pick for active drafter.
	- Pick result is broadcast to all connected clients.
	- Draft state supports reconnect and resumes from persisted current pick.
	- Draft ends when all roster slots are filled for every entrant.
	- Roster becomes locked after draft completion for MVP playoff mode.
- Validation rules:
	- Player must be available and eligible for remaining roster constraints.
	- Duplicate player selection in same league is rejected atomically.
	- Pick request must include expected pick token or revision to prevent stale submissions.
	- Commissioner pause and resume actions are role-protected.
- Critical edge cases:
	- Two entrants submit same player at nearly the same time.
	- Active drafter disconnects during countdown.
	- Client clock differs from server clock.
	- Draft paused and resumed repeatedly.
	- Auto-pick pool has no valid players for strict position slot.

#### 2.3 Live Scoring, Recalculation, and Standings
- Description:
	- System ingests external player stats, computes fantasy points, and updates league standings.
- Required inputs:
	- Scheduled ingestion trigger
	- Manual refresh trigger for admin operations
	- External provider data payloads
	- League scoring and tie-breaker configuration
- Behavior:
	- System stores stat snapshots with provider metadata and timestamps.
	- System computes per-team score snapshots from roster plus scoring config.
	- System updates standings with deterministic rank and tie-break logic.
	- System exposes last successful scoring update time and source status.
	- System supports recalculation when provider stat corrections are received.
	- Players continue scoring only while their real team remains active in playoffs; no replacement players are added in MVP.
- Validation rules:
	- Scoring run must be idempotent for same snapshot input.
	- Failed ingestion cannot overwrite last known good standings.
	- Unknown or missing player mappings are logged and skipped safely.
	- Tie-breakers must be applied in configured precedence order.
	- External provider player identifiers must map deterministically to internal drafted player records before score application.
- Critical edge cases:
	- Provider outage or partial payload.
	- Delayed or corrected stats causing score changes after initial publication.
	- Duplicate provider events for same player and game timestamp.

#### 2.4 Commissioner Controls and Auditability
- Description:
	- Commissioners can operate essential league controls while preserving fairness and audit trail.
- Required inputs:
	- Pause or resume draft
	- Force auto-pick for current drafter
	- Cancel league before completion
	- Trigger manual scoring refresh
- Behavior:
	- Every commissioner control action is audited with actor, timestamp, and reason.
	- Audit history is visible to league members for transparency.
	- Restricted operations are blocked based on current league and draft state.
- Validation rules:
	- Only commissioner role can execute commissioner actions.
	- Force actions require explicit confirmation payload.
- Critical edge cases:
	- Commissioner performs control action from multiple tabs.
	- Concurrent conflicting control actions.

### 3. Persistence and Data Lifecycle
- Required data to persist:
	- Users, leagues, memberships, draft sessions, draft picks, team rosters, scoring configs, stat snapshots, score snapshots, standings entries, and audit logs.
- Read and write patterns:
	- High write burst during live draft picks and scoring updates.
	- Frequent reads for draft room state and standings.
	- Snapshot tables are append-oriented; current views are derived from latest valid snapshot.
- Transaction integrity requirements:
	- Pick acceptance and player assignment must occur in one transaction.
	- Standings update must commit atomically per scoring run.
- Retention and deletion behavior:
	- Keep completed league history for minimum one season.
	- Soft-delete league metadata where legal or policy appropriate.
	- Never hard-delete draft pick or scoring audit events in MVP.
- Migration readiness:
	- Data access layer must be isolated so SQLite can be swapped with PostgreSQL without changing frontend contracts.

### 4. API Contract Requirements
- Backend route groups required for MVP:
	- Authentication and session routes
	- League create, update, join, and membership routes
	- Draft session routes: start, pause, resume, pick submit, state read
	- Scoring routes: refresh trigger, standings read, scoring status read
	- Health routes for backend and data provider connectivity
- Request and response format expectations:
	- JSON only.
	- Standard response envelope for mutation routes with success, data, and metadata fields.
	- Standard pagination format for list routes.
	- Event stream or polling contract for live draft state updates must be explicitly defined and versioned.
- Error handling contract:
	- 400 for validation failures.
	- 401 for unauthenticated access.
	- 403 for unauthorized role actions.
	- 404 for missing resources.
	- 409 for state conflicts such as stale pick token or already drafted player.
	- 429 for rate-limited requests.
	- 500 for unhandled server errors.
- Idempotency requirements:
	- Mutation endpoints that may be retried by clients must accept idempotency keys.

### 5. UI Behavior Requirements
- Critical views and screens:
	- Create league screen
	- Join league screen
	- League lobby and settings screen
	- Live draft room with order board, countdown timer, and pick history
	- Team roster view
	- Standings view with last update timestamp and provider status
- Required user interactions:
	- Create or join league via invite code.
	- Enter draft room and submit pick.
	- View pick timer and current drafter.
	- Commissioner controls for draft operations.
	- Refresh or inspect standings update status.
- Empty, loading, and error states:
	- Explicit empty states for no leagues, no picks, and no standings yet.
	- Loading indicators for draft state fetch and scoring refresh.
	- Recoverable error messages with retry actions for transient failures.
	- Disconnected state indicator with automatic rejoin attempt in draft room.
- Real-time UX safeguards:
	- Display server-authoritative timer.
	- Display stale-data warning when client has not received updates within threshold.

## Non-Functional Requirements

### Performance
- Draft state broadcast latency target: under 1 second for connected clients on normal load.
- Pick submission round-trip target: under 500 milliseconds at p95 under MVP load.
- Standings refresh latency target: new standings visible within 60 seconds of successful stat ingestion.

### Reliability
- No duplicate picks for same player in same league under concurrent submissions.
- Draft state recoverable after service restart from persisted session state.
- Scoring jobs retry with bounded exponential backoff after transient provider failures.
- Last known good standings remain readable during ingestion failures.

### Accessibility
- Core views and controls are keyboard accessible.
- Timer, status, and error updates are announced for assistive technologies where practical.
- Color contrast meets WCAG AA minimum for text and interactive elements.

### Security
- Authentication required for all league operations except join with invite code and public health checks.
- Authorization checks required on every commissioner-only endpoint.
- Input validation and output encoding required on all user-provided fields.
- Basic rate limiting required for join, pick submit, and scoring refresh routes.
- Secrets for external provider integrations must be environment-based and never exposed to clients.

### Observability
- Structured logs for draft picks, auto-picks, scoring runs, and provider errors.
- Metrics for pick latency, auto-pick rate, scoring duration, and failed ingestion count.
- Correlation id propagation across API and background scoring operations.

## Out of Scope (MVP)
- Public leagues and auto-matchmaking.
- Wagering, payments, or prize distribution.
- Native mobile applications.
- In-season waivers, trades, and free-agent pickups.
- Multi-season dynasty or keeper formats.
- Advanced analytics dashboards beyond current standings and score history.
- Multi-provider aggregation beyond one primary stat provider.

## Success Criteria Checklist
- [ ] Requirement set is testable and unambiguous
- [ ] MVP scope is explicit and constrained
- [ ] API requirements map to UI workflows
- [ ] Error and edge-case behavior is documented
- [ ] Draft fairness and collision handling requirements are explicit
- [ ] Scoring correction and recalculation behavior is explicit
- [ ] Reconnect and stale-data UX behavior is explicit
