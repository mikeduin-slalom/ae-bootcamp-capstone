# Quickstart: Leagues Table View

**Feature**: 007-leagues-table-view
**Date**: 2026-05-29

---

## Prerequisites

- Node.js 18+ installed
- Dependencies installed: run `npm install` from the repo root

---

## Start the development servers

```bash
# Terminal 1 — backend
cd packages/backend
npm start

# Terminal 2 — frontend
cd packages/frontend
npm start
```

Navigate to `http://localhost:3000/leagues` to see the Leagues Table page.

---

## Verify the table

1. **Guest view** — open the Leagues page without signing in. All leagues appear in a single
   table with Public/Private badges, commissioner names, and formatted draft start times.
   Action buttons are visible; clicking one redirects to the sign-in page.

2. **Authenticated user (alex@example.com / pass1234)** — sign in, then visit `/leagues`.
   - "Weekend Warriors" (public) row shows a **Sign Up** button.
   - "Friends Invitational" and "Office Showdown" (private) rows show a **Request to Join**
     button and a "Have an invite? Enter code" text link.

3. **Already-joined user (casey@example.com / pass5678)** — sign in, then visit `/leagues`.
   - "Friends Invitational" is already joined by casey; that row shows a **Joined** indicator
     instead of an action button.

4. **Empty state** — if you temporarily empty the leagues in the backend dataStore, the table
   should display an empty-state message rather than a broken or empty table.

---

## Run tests

```bash
# Frontend tests (includes LeaguesPage + LeaguesTable)
cd packages/frontend
CI=1 npm test -- --watchAll=false

# Backend tests (includes GET /api/leagues/my)
cd packages/backend
CI=1 npm test -- --watchAll=false
```

---

## Key files

| File | Role |
|------|------|
| `packages/frontend/src/pages/LeaguesPage.js` | Page orchestrator; parallel fetch via `Promise.allSettled`; mounts `<LeaguesTable>` |
| `packages/frontend/src/components/LeaguesTable.js` | Table rendering: columns, badges, action cell, inline invite toggle |
| `packages/frontend/src/constants/leaguesMockData.js` | Static commissioner name + draft start time lookup keyed by league id |
| `packages/frontend/src/services/leaguesService.js` | `listMyLeagues()` function added |
| `packages/backend/src/app.js` | `GET /api/leagues/my` route added |
| `packages/backend/src/services/leagueAccessService.js` | `getUserLeagueIds(userId)` helper added |
| `specs/007-leagues-table-view/contracts/leagues-table-view.openapi.yaml` | API contract for the new endpoint |
