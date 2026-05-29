import React from 'react';
import DraftTeamSlot from './DraftTeamSlot';

function DraftLeagueBar({ teams, rosters, selectedTeamId, onSelectTeam, activeTeamId, draftComplete }) {
  return (
    <div className="draft-league-bar" role="list" aria-label="League teams">
      {draftComplete && (
        <div className="draft-league-bar__complete-banner">Draft Complete</div>
      )}
      {teams.map(team => (
        <div key={team.id} role="listitem">
          <DraftTeamSlot
            team={team}
            isSelected={selectedTeamId === team.id}
            rosterCount={(rosters[team.id] || []).length}
            onClick={() => onSelectTeam(team.id)}
            isActive={!draftComplete && team.id === activeTeamId}
          />
        </div>
      ))}
    </div>
  );
}

export default DraftLeagueBar;
