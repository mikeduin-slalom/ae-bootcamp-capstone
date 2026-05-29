import React from 'react';

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

function DraftFilters({
  availablePlayers,
  positionFilter,
  nflTeamFilter,
  onPositionChange,
  onNflTeamChange,
  onClearFilters,
}) {
  const nflTeams = Array.from(
    new Set(availablePlayers.map(p => p.nflTeam))
  ).sort();

  return (
    <div className="draft-filters" role="group" aria-label="Player filters">
      <div className="draft-filters__group">
        <label htmlFor="draft-filter-position" className="draft-filters__label">
          Position
        </label>
        <select
          id="draft-filter-position"
          className="draft-filters__select"
          value={positionFilter || ''}
          onChange={e => onPositionChange(e.target.value || null)}
          aria-label="Position"
        >
          <option value="">All Positions</option>
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div className="draft-filters__group">
        <label htmlFor="draft-filter-nfl-team" className="draft-filters__label">
          NFL Team
        </label>
        <select
          id="draft-filter-nfl-team"
          className="draft-filters__select"
          value={nflTeamFilter || ''}
          onChange={e => onNflTeamChange(e.target.value || null)}
          aria-label="NFL Team"
        >
          <option value="">All NFL Teams</option>
          {nflTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <button
        className="draft-filters__clear"
        onClick={onClearFilters}
        aria-label="Clear Filters"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default DraftFilters;
