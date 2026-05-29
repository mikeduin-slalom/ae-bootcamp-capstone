# Research: Frontend Auth and League Access

## Decision 1: Use client-side routing with explicit route guards
- Decision: Use a route-based UI with dedicated pages for Homepage, Login, Leagues, and How to Play, and apply auth guards only to membership-changing actions.
- Rationale: The feature requires distinct page-level journeys and persistent navigation; route guards enforce FR-004 while preserving read-only league discovery for guests.
- Alternatives considered:
  - Single-page conditional rendering with no routes: rejected because deep-linking and acceptance testing become less explicit.
  - Guarding the entire Leagues page: rejected because clarification requires read-only guest access.

## Decision 2: Scope authentication to email/password for v1 session flow
- Decision: Implement email/password authentication only, with backend-issued session state and frontend signed-in indicator updates.
- Rationale: Clarified scope explicitly selects email/password for v1 and keeps implementation/test scope focused.
- Alternatives considered:
  - OAuth in v1: rejected due to added integration complexity not required by clarified scope.
  - Dual auth methods in v1: rejected to avoid unnecessary branching in initial UX and tests.

## Decision 3: Separate public league read access from protected join mutations
- Decision: Expose league listing in a public read-only endpoint/view model, while requiring authentication for join actions on joinable and private leagues.
- Rationale: Matches clarified behavior (guest can browse; must log in to join), and cleanly enforces authorization boundaries.
- Alternatives considered:
  - Fully private leagues page: rejected by clarification.
  - Allow guest join for joinable leagues: rejected because FR-004 requires authenticated membership actions.

## Decision 4: Support two private-league entry paths: invitation link and request-to-join
- Decision: Model private league access as either invitation-link validation or request-to-join submission, with explicit feedback states.
- Rationale: Clarification requires both pathways; explicit state modeling supports deterministic acceptance tests and user messaging.
- Alternatives considered:
  - Invite code only: rejected by clarification.
  - Invitation link only: rejected by clarification.

## Decision 5: Keep observability and error envelope lightweight but consistent
- Decision: Use structured mutation responses and consistent status/error codes for login and join flows, with event logging for auth and membership attempts.
- Rationale: Meets NFR-005 and functional feedback requirements without overengineering MVP transport patterns.
- Alternatives considered:
  - Ad hoc response shapes per endpoint: rejected because it complicates frontend handling and tests.
  - Full event-stream architecture for this slice: rejected as unnecessary for entry-flow MVP.
