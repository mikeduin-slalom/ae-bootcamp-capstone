# Quickstart: NFL Team Logo Sync & Draft Room Display

> Developer reference for feature `008-nfl-logo-sync`.

---

## Prerequisites

- Node.js 18+ installed
- Dependencies installed in both packages:
  ```sh
  cd packages/backend && npm install
  cd packages/frontend && npm install
  ```
- Backend server not required for the sync script — it runs standalone.

---

## 1. Run the Logo Sync

The sync script fetches all 32 NFL teams from the ESPN public API, downloads each team's PNG logo,
writes it to `packages/frontend/public/logos/nfl/`, and persists team metadata in the SQLite
database.

```sh
cd packages/backend
npm run sync:nfl-logos
```

**Expected output** (truncated):

```
Syncing NFL team logos...
[1/32] MIN Minnesota Vikings — downloaded ✓
[2/32] ATL Atlanta Falcons — downloaded ✓
...
[32/32] WAS Washington Commanders — downloaded ✓

Sync complete: 32 succeeded, 0 failed.
```

If any team's logo download fails, the script continues and lists failures at the end:

```
Sync complete: 31 succeeded, 1 failed.
Failed teams: TEN
```

After a successful sync you should see 32 `.png` files under:
```
packages/frontend/public/logos/nfl/
  atl.png  buf.png  car.png  chi.png  cin.png  cle.png
  dal.png  den.png  det.png  gb.png   hou.png  ind.png
  jax.png  kc.png   lac.png  lar.png  lv.png   mia.png
  min.png  ne.png   no.png   nyg.png  nyj.png  phi.png
  pit.png  sea.png  sf.png   tb.png   ten.png  wsh.png
  ...
```

---

## 2. Start the Backend

```sh
cd packages/backend
npm start
```

The server starts on `http://localhost:3030`. Verify the new endpoint:

```sh
curl http://localhost:3030/api/nfl-teams | head -c 500
```

Expected: JSON array with 32 team objects including `logoPath` values.

---

## 3. Start the Frontend

```sh
cd packages/frontend
npm start
```

Open `http://localhost:3000`, log in, and navigate to the Draft Room. Each player card in the
draft pool should display the player's NFL team logo and abbreviation side by side. If a logo is
missing, the abbreviation text is shown as a fallback.

---

## 4. Run Tests

```sh
# Backend tests
cd packages/backend
CI=1 npm test -- --watchAll=false

# Frontend tests
cd packages/frontend
CI=1 npm test -- --watchAll=false
```

---

## Key Files

| File | Purpose |
|------|---------|
| `packages/backend/scripts/syncNflLogos.js` | CLI sync script — run once to populate logos and DB |
| `packages/backend/src/services/nflTeamsStore.js` | SQLite `nfl_teams` table init and query helpers |
| `packages/backend/src/app.js` | `GET /api/nfl-teams` route (additive) |
| `packages/backend/data/capstone.db` | SQLite database file (auto-created on first run) |
| `packages/frontend/public/logos/nfl/` | Static PNG logo files served by CRA |
| `packages/frontend/src/services/nflTeamsService.js` | `fetchNflTeams()` API call |
| `packages/frontend/src/components/DraftPlayerRow.js` | Updated to show logo + fallback |
| `packages/frontend/src/components/DraftFilters.js` | Updated to show logo thumbnails in filter |
| `packages/frontend/src/pages/DraftRoomPage.js` | Updated to fetch teams and build logo map |

---

## ESPN API Reference

```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=1000
```

- No authentication required
- Logo URL: `response.sports[0].leagues[0].teams[n].team.logos[0].href`
- Team abbreviation: `response.sports[0].leagues[0].teams[n].team.abbreviation`
- Primary color: `response.sports[0].leagues[0].teams[n].team.color` (hex without `#`)

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Sync fails with `ENOENT` on the logos directory | The script creates `packages/frontend/public/logos/nfl/` automatically; check write permissions |
| `GET /api/nfl-teams` returns empty array | Run the sync script first — the table is empty until sync completes |
| Player cards show abbreviation text only | Logos have not been synced yet, or the `public/logos/nfl/` directory is missing — run the sync |
| `better-sqlite3` binary error on first run | Run `npm install` in `packages/backend` to rebuild the native module for your Node version |
