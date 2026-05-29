import React from 'react';

function DraftPlayerRow({ player, onDraft }) {
  return (
    <div className="draft-player-row" data-testid="player-row">
      <span className="draft-player-row__position">{player.position}</span>
      <span className="draft-player-row__name">{player.name}</span>
      <span className="draft-player-row__team">{player.nflTeamAbbr}</span>
      <button
        className="draft-player-row__draft-btn"
        onClick={() => onDraft(player.id)}
        aria-label={`Draft ${player.name}`}
      >
        Draft
      </button>
    </div>
  );
}

export default DraftPlayerRow;
