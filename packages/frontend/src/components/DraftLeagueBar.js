import React from 'react';
import DraftTeamSlot from './DraftTeamSlot';

function DraftLeagueBar({ teams, rosters, selectedTeamId, onSelectTeam }) {
  return (
    <div className="draft-league-bar" role="list" aria-label="League teams">
      {teams.map(team => (
        <div key={team.id} role="listitem">
          <DraftTeamSlot
            team={team}
            isSelected={selectedTeamId === team.id}
            rosterCount={(rosters[team.id] || []).length}
            onClick={() => onSelectTeam(team.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default DraftLeagueBar;
