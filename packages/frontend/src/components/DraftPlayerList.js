import React from 'react';
import DraftFilters from './DraftFilters';
import DraftPlayerRow from './DraftPlayerRow';

function DraftPlayerList({
  availablePlayers,
  positionFilter,
  nflTeamFilter,
  onDraft,
  onPositionChange,
  onNflTeamChange,
  onClearFilters,
}) {
  const filteredPlayers = availablePlayers.filter(player => {
    if (positionFilter && player.position !== positionFilter) return false;
    if (nflTeamFilter && player.nflTeam !== nflTeamFilter) return false;
    return true;
  });

  const hasActiveFilter = Boolean(positionFilter || nflTeamFilter);

  return (
    <div className="draft-player-list">
      <DraftFilters
        availablePlayers={availablePlayers}
        positionFilter={positionFilter}
        nflTeamFilter={nflTeamFilter}
        onPositionChange={onPositionChange}
        onNflTeamChange={onNflTeamChange}
        onClearFilters={onClearFilters}
      />

      {filteredPlayers.length === 0 ? (
        <p className="draft-player-list__empty">
          {hasActiveFilter
            ? 'No players match your filters.'
            : 'No players available.'}
        </p>
      ) : (
        <>
          <div className="draft-player-list__header" aria-hidden="true">
            <span className="draft-player-list__header-pos">Pos</span>
            <span className="draft-player-list__header-name">Player</span>
            <span className="draft-player-list__header-team">Team</span>
            <span className="draft-player-list__header-stat">TDs</span>
            <span className="draft-player-list__header-stat">Pass Yds</span>
            <span className="draft-player-list__header-stat">Rush Yds</span>
            <span className="draft-player-list__header-stat">Rec Yds</span>
            <span className="draft-player-list__header-action" />
          </div>
          <div className="draft-player-list__scroll" role="list" aria-label="Available players">
            {filteredPlayers.map(player => (
              <div key={player.id} role="listitem">
                <DraftPlayerRow player={player} onDraft={onDraft} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DraftPlayerList;
