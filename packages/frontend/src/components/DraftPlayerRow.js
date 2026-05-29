import React, { useState } from 'react';

function DraftPlayerRow({ player, logoPath, onDraft }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="draft-player-row" data-testid="player-row">
      <span className="draft-player-row__position" data-position={player.position}>{player.position}</span>
      <span className="draft-player-row__name">{player.name}</span>
      <span className="draft-player-row__team">
        {logoPath && !imgError ? (
          <img
            src={logoPath}
            alt={`${player.nflTeam} logo`}
            className="draft-player-row__team-logo"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="draft-player-row__team-abbr">{player.nflTeamAbbr}</span>
        )}
      </span>
      <span className="draft-player-row__stat draft-player-row__stat--tds">{player.touchdowns}</span>
      <span className="draft-player-row__stat draft-player-row__stat--pass-yards">{player.passYards}</span>
      <span className="draft-player-row__stat draft-player-row__stat--rush-yards">{player.rushYards}</span>
      <span className="draft-player-row__stat draft-player-row__stat--rec-yards">{player.recYards}</span>
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
