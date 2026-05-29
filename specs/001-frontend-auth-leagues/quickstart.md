# Quickstart: Frontend Auth and League Access

## 1. Install and run

1. Install dependencies from repository root:
   - `npm install`
2. Start frontend and backend together:
   - `npm run start`
3. Open the frontend in browser:
   - `http://localhost:3000`

## 2. Run tests

1. Run all workspace tests:
   - `npm test`
2. Run frontend tests only:
   - `npm run test:frontend`
3. Run backend tests only:
   - `npm run test:backend`

## 3. Validate core user stories manually

### Story 1: Homepage navigation
1. Open homepage.
2. Confirm navigation links for Login, Leagues, and How to Play are visible.
3. Confirm each link routes to expected page.

### Story 2: Email/password authentication
1. Navigate to Login.
2. Submit valid credentials and confirm signed-in state appears in UI.
3. Submit invalid credentials and confirm inline error feedback.

### Story 3: Leagues discovery and joining
1. While signed out, open Leagues page and confirm read-only list is visible.
2. Attempt join while signed out and confirm redirect/prompt to log in.
3. Sign in and join a joinable league; confirm success state.
4. Attempt private league access via invitation link; confirm valid and invalid token outcomes.
5. Submit request-to-join for a private league; confirm pending status feedback.

### Story 4: How to Play content
1. Open How to Play page.
2. Confirm game structure sections are displayed in clear sequence.
3. Confirm content is readable on desktop and mobile widths.

## 4. Accessibility and reliability checks

1. Verify keyboard-only navigation for all primary page actions.
2. Verify focus indicators are visible.
3. Simulate backend/API error and confirm recoverable user-facing message appears.
4. Confirm auth and join attempts are logged by backend for support diagnostics.

## 5. Definition of done for this feature slice

- All scenarios in spec acceptance criteria pass.
- Frontend and backend tests pass with coverage at or above repository threshold.
- API contract and data model artifacts match implementation behavior.
- Constitution gates remain satisfied in code review.
