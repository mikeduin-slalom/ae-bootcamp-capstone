import { draftReducer, initialDraftState, getActiveTeamIndex, getActiveTeam } from '../pages/draftReducer';
import { MOCK_PLAYERS, MOCK_TEAMS } from '../constants/draftMockData';

describe('getActiveTeamIndex — snake draft order', () => {
  const numTeams = 12;

  it('round 1 goes left to right (picks 0–11)', () => {
    for (let i = 0; i < numTeams; i++) {
      expect(getActiveTeamIndex(i, numTeams)).toBe(i);
    }
  });

  it('round 2 snakes right to left (picks 12–23)', () => {
    for (let i = 0; i < numTeams; i++) {
      expect(getActiveTeamIndex(numTeams + i, numTeams)).toBe(numTeams - 1 - i);
    }
  });

  it('round 3 goes left to right again (picks 24–35)', () => {
    for (let i = 0; i < numTeams; i++) {
      expect(getActiveTeamIndex(numTeams * 2 + i, numTeams)).toBe(i);
    }
  });

  it('pick 0 → team index 0 (round 1, first pick)', () => {
    expect(getActiveTeamIndex(0, numTeams)).toBe(0);
  });

  it('pick 11 → team index 11 (round 1, last pick)', () => {
    expect(getActiveTeamIndex(11, numTeams)).toBe(11);
  });

  it('pick 12 → team index 11 (round 2, first snake pick)', () => {
    expect(getActiveTeamIndex(12, numTeams)).toBe(11);
  });

  it('pick 23 → team index 0 (round 2, last snake pick)', () => {
    expect(getActiveTeamIndex(23, numTeams)).toBe(0);
  });
});

describe('getActiveTeam', () => {
  it('returns the correct team for a given pick index', () => {
    expect(getActiveTeam(MOCK_TEAMS, 0)).toBe(MOCK_TEAMS[0]);
    expect(getActiveTeam(MOCK_TEAMS, 11)).toBe(MOCK_TEAMS[11]);
    expect(getActiveTeam(MOCK_TEAMS, 12)).toBe(MOCK_TEAMS[11]);
  });
});

describe('initialDraftState', () => {
  it('starts with all players available', () => {
    expect(initialDraftState.availablePlayers).toHaveLength(MOCK_PLAYERS.length);
  });

  it('starts with empty rosters', () => {
    expect(initialDraftState.rosters).toEqual({});
  });

  it('starts at pick 0', () => {
    expect(initialDraftState.currentPickIndex).toBe(0);
  });

  it('starts with draftComplete false', () => {
    expect(initialDraftState.draftComplete).toBe(false);
  });
});

describe('draftReducer — DRAFT_PLAYER', () => {
  it('removes the drafted player from availablePlayers', () => {
    const playerId = MOCK_PLAYERS[0].id;
    const nextState = draftReducer(initialDraftState, {
      type: 'DRAFT_PLAYER',
      payload: { playerId },
    });

    expect(nextState.availablePlayers.find(p => p.id === playerId)).toBeUndefined();
    expect(nextState.availablePlayers).toHaveLength(MOCK_PLAYERS.length - 1);
  });

  it('adds the drafted player to the active team roster', () => {
    const player = MOCK_PLAYERS[0];
    const activeTeam = getActiveTeam(MOCK_TEAMS, 0); // pick 0 → team_1
    const nextState = draftReducer(initialDraftState, {
      type: 'DRAFT_PLAYER',
      payload: { playerId: player.id },
    });

    expect(nextState.rosters[activeTeam.id]).toHaveLength(1);
    expect(nextState.rosters[activeTeam.id][0]).toEqual(player);
  });

  it('increments currentPickIndex', () => {
    const nextState = draftReducer(initialDraftState, {
      type: 'DRAFT_PLAYER',
      payload: { playerId: MOCK_PLAYERS[0].id },
    });

    expect(nextState.currentPickIndex).toBe(1);
  });

  it('does nothing when the playerId does not exist', () => {
    const nextState = draftReducer(initialDraftState, {
      type: 'DRAFT_PLAYER',
      payload: { playerId: 'invalid_id' },
    });

    expect(nextState).toBe(initialDraftState);
  });

  it('sets draftComplete when the last player is drafted', () => {
    // Build state with only one player left
    const singlePlayerState = {
      ...initialDraftState,
      availablePlayers: [MOCK_PLAYERS[0]],
    };

    const nextState = draftReducer(singlePlayerState, {
      type: 'DRAFT_PLAYER',
      payload: { playerId: MOCK_PLAYERS[0].id },
    });

    expect(nextState.draftComplete).toBe(true);
    expect(nextState.availablePlayers).toHaveLength(0);
  });
});

describe('draftReducer — AUTO_PICK', () => {
  it('drafts the first available player from the unfiltered pool', () => {
    const firstPlayer = initialDraftState.availablePlayers[0];
    const activeTeam = getActiveTeam(MOCK_TEAMS, 0);

    const nextState = draftReducer(initialDraftState, { type: 'AUTO_PICK' });

    expect(nextState.availablePlayers.find(p => p.id === firstPlayer.id)).toBeUndefined();
    expect(nextState.rosters[activeTeam.id][0]).toEqual(firstPlayer);
    expect(nextState.currentPickIndex).toBe(1);
  });

  it('uses the unfiltered pool regardless of active filters', () => {
    const stateWithFilter = {
      ...initialDraftState,
      positionFilter: 'WR', // filter active, but AUTO_PICK ignores it
    };

    const firstPlayer = stateWithFilter.availablePlayers[0]; // first is QB
    const nextState = draftReducer(stateWithFilter, { type: 'AUTO_PICK' });

    expect(nextState.availablePlayers.find(p => p.id === firstPlayer.id)).toBeUndefined();
  });

  it('sets draftComplete when pool is empty', () => {
    const emptyState = { ...initialDraftState, availablePlayers: [] };
    const nextState = draftReducer(emptyState, { type: 'AUTO_PICK' });
    expect(nextState.draftComplete).toBe(true);
  });
});

describe('draftReducer — SELECT_TEAM', () => {
  it('sets selectedTeamId when a different team is clicked', () => {
    const nextState = draftReducer(initialDraftState, {
      type: 'SELECT_TEAM',
      payload: { teamId: 'team_1' },
    });
    expect(nextState.selectedTeamId).toBe('team_1');
  });

  it('sets selectedTeamId to null when the same team is clicked again (toggle)', () => {
    const openState = { ...initialDraftState, selectedTeamId: 'team_1' };
    const nextState = draftReducer(openState, {
      type: 'SELECT_TEAM',
      payload: { teamId: 'team_1' },
    });
    expect(nextState.selectedTeamId).toBeNull();
  });

  it('switches to the new team when a different team is clicked while one is open', () => {
    const openState = { ...initialDraftState, selectedTeamId: 'team_1' };
    const nextState = draftReducer(openState, {
      type: 'SELECT_TEAM',
      payload: { teamId: 'team_2' },
    });
    expect(nextState.selectedTeamId).toBe('team_2');
  });
});

describe('draftReducer — filters', () => {
  it('SET_POSITION_FILTER sets positionFilter', () => {
    const next = draftReducer(initialDraftState, {
      type: 'SET_POSITION_FILTER',
      payload: { value: 'QB' },
    });
    expect(next.positionFilter).toBe('QB');
  });

  it('SET_NFL_TEAM_FILTER sets nflTeamFilter', () => {
    const next = draftReducer(initialDraftState, {
      type: 'SET_NFL_TEAM_FILTER',
      payload: { value: 'Kansas City Chiefs' },
    });
    expect(next.nflTeamFilter).toBe('Kansas City Chiefs');
  });

  it('CLEAR_FILTERS resets both filters to null', () => {
    const filtered = {
      ...initialDraftState,
      positionFilter: 'QB',
      nflTeamFilter: 'Kansas City Chiefs',
    };
    const next = draftReducer(filtered, { type: 'CLEAR_FILTERS' });
    expect(next.positionFilter).toBeNull();
    expect(next.nflTeamFilter).toBeNull();
  });
});
