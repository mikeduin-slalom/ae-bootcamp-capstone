import React from 'react';

function DraftTeamSlot({ team, isSelected, rosterCount, onClick, isActive }) {
  const className = [
    'draft-team-slot',
    isSelected ? 'draft-team-slot--selected' : '',
    isActive ? 'draft-team-slot--active' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="draft-team-slot-wrapper">
      <button
        className={className}
        onClick={onClick}
        aria-label={`${team.name} — ${rosterCount} player${rosterCount !== 1 ? 's' : ''} drafted`}
        aria-pressed={isSelected}
      >
        <span className="draft-team-slot__logo" aria-hidden="true">
          {team.initials}
        </span>
        <span className="draft-team-slot__name">{team.name}</span>
        {rosterCount > 0 && (
          <span className="draft-team-slot__badge" aria-hidden="true">
            {rosterCount}
          </span>
        )}
      </button>
      {isActive && (
        <span className="draft-team-slot__on-the-clock">ON THE CLOCK</span>
      )}
    </div>
  );
}

export default DraftTeamSlot;
