# Data Model: Frontend Auth and League Access

## Entities

### User
- Purpose: Represents a person who can authenticate and join leagues.
- Fields:
  - id (string, immutable)
  - email (string, unique, required)
  - displayName (string, required)
  - passwordHash (string, required for email/password auth)
  - createdAt (datetime)
- Validation:
  - email must be valid format.
  - password is never returned in API responses.

### UserSession
- Purpose: Tracks active authenticated state for the frontend.
- Fields:
  - sessionId (string, immutable)
  - userId (string, foreign key -> User.id)
  - createdAt (datetime)
  - expiresAt (datetime)
  - revokedAt (datetime, nullable)
- Validation:
  - session is active only when revokedAt is null and expiresAt is in the future.

### League
- Purpose: Represents a league shown on the Leagues page.
- Fields:
  - id (string, immutable)
  - name (string, required)
  - accessType (enum: joinable, private)
  - status (enum: pending, draft_ready, drafting, scoring_live, completed, cancelled)
  - joinabilityLabel (string, derived for UI display)
  - memberCount (number)
  - maxEntrants (number)
- Validation:
  - accessType determines allowed membership path.
  - memberCount cannot exceed maxEntrants.

### LeagueMembership
- Purpose: Records that a user belongs to a league.
- Fields:
  - id (string, immutable)
  - leagueId (string, foreign key -> League.id)
  - userId (string, foreign key -> User.id)
  - role (enum: commissioner, entrant)
  - joinedAt (datetime)
- Validation:
  - one user can have at most one membership per league.

### PrivateLeagueInvitation
- Purpose: Grants direct access to a private league via invitation link token.
- Fields:
  - invitationToken (string, unique)
  - leagueId (string, foreign key -> League.id)
  - invitedUserId (string, nullable)
  - expiresAt (datetime)
  - consumedAt (datetime, nullable)
- Validation:
  - token is valid only if not expired and not consumed.
  - if invitedUserId is present, only that user may consume it.

### PrivateLeagueJoinRequest
- Purpose: Captures request-to-join flow for private leagues.
- Fields:
  - id (string, immutable)
  - leagueId (string, foreign key -> League.id)
  - requesterUserId (string, foreign key -> User.id)
  - status (enum: pending, approved, denied)
  - submittedAt (datetime)
  - resolvedAt (datetime, nullable)
- Validation:
  - only one pending request per user per league.
  - approved request can create LeagueMembership once.

### HowToPlaySection
- Purpose: Represents structured instructional content for the How to Play page.
- Fields:
  - id (string, immutable)
  - title (string)
  - body (string)
  - sequence (number)
- Validation:
  - sequence values are unique and ascending for display order.

## Relationships
- User 1..* UserSession
- User *..* League through LeagueMembership
- League 1..* PrivateLeagueInvitation
- League 1..* PrivateLeagueJoinRequest
- User 1..* PrivateLeagueJoinRequest

## State Transitions

### Authentication
- anonymous -> authenticated: valid email/password login creates active UserSession.
- authenticated -> anonymous: logout revokes UserSession.

### League Access
- joinable league membership:
  - eligible -> joined via direct join action.
- private league membership via invitation:
  - invitation valid -> membership created -> invitation consumed.
  - invitation invalid/expired/consumed -> rejected with reason.
- private league membership via request:
  - pending -> approved (membership created) or denied.

### Leagues Page Visibility
- anonymous user: can read league summaries only.
- authenticated user: can read summaries and execute join actions.
