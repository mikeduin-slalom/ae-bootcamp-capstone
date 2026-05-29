const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'capstone.db');

// Ensure data/ directory exists before opening the database
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS nfl_teams (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    espn_team_id     TEXT NOT NULL UNIQUE,
    name             TEXT NOT NULL,
    location         TEXT NOT NULL,
    abbreviation     TEXT NOT NULL UNIQUE,
    color            TEXT,
    alternate_color  TEXT,
    logo_path        TEXT,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const upsertTeamStmt = db.prepare(`
  INSERT INTO nfl_teams (espn_team_id, name, location, abbreviation, color, alternate_color, logo_path, updated_at)
  VALUES (@espnTeamId, @name, @location, @abbreviation, @color, @alternateColor, @logoPath, datetime('now'))
  ON CONFLICT(espn_team_id) DO UPDATE SET
    name            = excluded.name,
    location        = excluded.location,
    abbreviation    = excluded.abbreviation,
    color           = excluded.color,
    alternate_color = excluded.alternate_color,
    logo_path       = excluded.logo_path,
    updated_at      = excluded.updated_at
`);

const getAllTeamsStmt = db.prepare(`
  SELECT
    id,
    espn_team_id   AS espnTeamId,
    name,
    location,
    abbreviation,
    color,
    alternate_color AS alternateColor,
    logo_path       AS logoPath
  FROM nfl_teams
  ORDER BY abbreviation
`);

function upsertTeam(team) {
  upsertTeamStmt.run(team);
}

function getAllTeams() {
  return getAllTeamsStmt.all();
}

module.exports = { upsertTeam, getAllTeams };
