import React, { useReducer, useState, useEffect } from 'react';
import { draftReducer, initialDraftState, getActiveTeam } from './draftReducer';
import DraftLeagueBar from '../components/DraftLeagueBar';
import DraftRosterPanel from '../components/DraftRosterPanel';
import DraftPlayerList from '../components/DraftPlayerList';
import DraftPickTimer from '../components/DraftPickTimer';
import { fetchNflTeams } from '../services/nflTeamsService';

const PICK_TIMER_SECONDS = 300;

function DraftRoomPage() {
  const [state, dispatch] = useReducer(draftReducer, initialDraftState);
  const [secondsLeft, setSecondsLeft] = useState(PICK_TIMER_SECONDS);
  const [nflTeamLogoMap, setNflTeamLogoMap] = useState(new Map());

  useEffect(() => {
    fetchNflTeams().then(teams => {
      setNflTeamLogoMap(new Map(teams.map(t => [t.abbreviation, t.logoPath])));
    }).catch(() => {});
  }, []);

  // Reset timer when pick advances
  useEffect(() => {
    setSecondsLeft(PICK_TIMER_SECONDS);
  }, [state.currentPickIndex]);

  // Countdown interval
  useEffect(() => {
    if (state.draftComplete) return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          dispatch({ type: 'AUTO_PICK' });
          return PICK_TIMER_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.currentPickIndex, state.draftComplete]);

  const selectedTeam = state.selectedTeamId
    ? state.teams.find(t => t.id === state.selectedTeamId)
    : null;
  const selectedRoster = state.selectedTeamId
    ? (state.rosters[state.selectedTeamId] || [])
    : [];

  const activeTeamId = state.draftComplete
    ? null
    : (getActiveTeam(state.teams, state.currentPickIndex)?.id ?? null);

  return (
    <div className="draft-room page-card">
      <DraftLeagueBar
        teams={state.teams}
        rosters={state.rosters}
        selectedTeamId={state.selectedTeamId}
        onSelectTeam={teamId => dispatch({ type: 'SELECT_TEAM', payload: { teamId } })}
        activeTeamId={activeTeamId}
        draftComplete={state.draftComplete}
      />

      {selectedTeam && (
        <DraftRosterPanel
          team={selectedTeam}
          roster={selectedRoster}
          onClose={() => dispatch({ type: 'SELECT_TEAM', payload: { teamId: state.selectedTeamId } })}
        />
      )}

      <div className="draft-main">
        <DraftPickTimer
          secondsLeft={secondsLeft}
          currentPickIndex={state.currentPickIndex}
        />

        <DraftPlayerList
          availablePlayers={state.availablePlayers}
          positionFilter={state.positionFilter}
          nflTeamFilter={state.nflTeamFilter}
          nflTeamLogoMap={nflTeamLogoMap}
          onDraft={playerId => dispatch({ type: 'DRAFT_PLAYER', payload: { playerId } })}
          onPositionChange={value => dispatch({ type: 'SET_POSITION_FILTER', payload: { value } })}
          onNflTeamChange={value => dispatch({ type: 'SET_NFL_TEAM_FILTER', payload: { value } })}
          onClearFilters={() => dispatch({ type: 'CLEAR_FILTERS' })}
        />
      </div>
    </div>
  );
}

export default DraftRoomPage;
