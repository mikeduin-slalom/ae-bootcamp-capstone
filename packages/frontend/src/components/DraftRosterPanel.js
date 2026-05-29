import React from 'react';

function DraftRosterPanel({ team, roster, onClose }) {
  return (
    <div className="draft-roster-panel" aria-label={`${team.name} roster`}>
      <div className="draft-roster-panel__header">
        <h3 className="draft-roster-panel__title">{team.name}</h3>
        <button
          className="draft-roster-panel__close"
          onClick={onClose}
          aria-label="Close roster panel"
        >
          ✕
        </button>
      </div>

      {roster.length === 0 ? (
        <p className="draft-roster-panel__empty">No players drafted yet.</p>
      ) : (
        <ul className="draft-roster-list" aria-label={`${team.name} roster`}>
          {roster.map(player => (
            <li key={player.id} className="draft-roster-list__item">
              <span className="draft-roster-list__position" data-position={player.position}>{player.position}</span>
              <span className="draft-roster-list__name">{player.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DraftRosterPanel;
