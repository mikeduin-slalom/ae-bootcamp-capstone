import { MOCK_PLAYERS, MOCK_TEAMS } from '../constants/draftMockData';

/**
 * Compute the active team index for a given pick using snake-draft order.
 * Rounds 1, 3, 5… go left-to-right; rounds 2, 4, 6… go right-to-left.
 */
export function getActiveTeamIndex(pickIndex, numTeams) {
  const round = Math.floor(pickIndex / numTeams);
  const positionInRound = pickIndex % numTeams;
  return round % 2 === 0
    ? positionInRound
    : (numTeams - 1) - positionInRound;
}

export function getActiveTeam(teams, pickIndex) {
  return teams[getActiveTeamIndex(pickIndex, teams.length)];
}

export const initialDraftState = {
  teams: MOCK_TEAMS,
  rosters: {},
  availablePlayers: MOCK_PLAYERS,
  currentPickIndex: 0,
  draftComplete: false,
  selectedTeamId: null,
  positionFilter: null,
  nflTeamFilter: null,
};

export function draftReducer(state, action) {
  switch (action.type) {
    case 'DRAFT_PLAYER': {
      const { playerId } = action.payload;
      const player = state.availablePlayers.find(p => p.id === playerId);
      if (!player) return state;

      const activeTeam = getActiveTeam(state.teams, state.currentPickIndex);
      const existingRoster = state.rosters[activeTeam.id] || [];
      const nextAvailable = state.availablePlayers.filter(p => p.id !== playerId);

      return {
        ...state,
        availablePlayers: nextAvailable,
        rosters: {
          ...state.rosters,
          [activeTeam.id]: [...existingRoster, player],
        },
        currentPickIndex: state.currentPickIndex + 1,
        draftComplete: nextAvailable.length === 0,
      };
    }

    case 'AUTO_PICK': {
      if (state.availablePlayers.length === 0) {
        return { ...state, draftComplete: true };
      }
      const firstPlayer = state.availablePlayers[0];
      return draftReducer(state, { type: 'DRAFT_PLAYER', payload: { playerId: firstPlayer.id } });
    }

    case 'SELECT_TEAM': {
      const { teamId } = action.payload;
      return {
        ...state,
        selectedTeamId: state.selectedTeamId === teamId ? null : teamId,
      };
    }

    case 'SET_POSITION_FILTER': {
      return { ...state, positionFilter: action.payload.value };
    }

    case 'SET_NFL_TEAM_FILTER': {
      return { ...state, nflTeamFilter: action.payload.value };
    }

    case 'CLEAR_FILTERS': {
      return { ...state, positionFilter: null, nflTeamFilter: null };
    }

    default:
      return state;
  }
}
