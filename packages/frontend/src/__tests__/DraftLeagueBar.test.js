import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DraftLeagueBar from '../components/DraftLeagueBar';
import { MOCK_TEAMS, MOCK_PLAYERS } from '../constants/draftMockData';

const emptyRosters = {};
const noop = () => {};

describe('DraftLeagueBar', () => {
  it('renders 12 team slots', () => {
    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={null}
        onSelectTeam={noop}
      />
    );

    const list = screen.getByRole('list', { name: /league teams/i });
    expect(within(list).getAllByRole('listitem')).toHaveLength(12);
  });

  it('renders each team name', () => {
    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={null}
        onSelectTeam={noop}
      />
    );

    MOCK_TEAMS.forEach(team => {
      expect(screen.getByText(team.name)).toBeInTheDocument();
    });
  });

  it('calls onSelectTeam with the correct team id when a slot is clicked', async () => {
    const user = userEvent.setup();
    const onSelectTeam = jest.fn();

    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={null}
        onSelectTeam={onSelectTeam}
      />
    );

    const firstSlot = screen.getByRole('button', { name: new RegExp(MOCK_TEAMS[0].name, 'i') });
    await user.click(firstSlot);
    expect(onSelectTeam).toHaveBeenCalledWith(MOCK_TEAMS[0].id);
  });

  it('applies the selected class to the selected team slot', () => {
    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={MOCK_TEAMS[2].id}
        onSelectTeam={noop}
      />
    );

    const selectedSlot = screen.getByRole('button', {
      name: new RegExp(MOCK_TEAMS[2].name, 'i'),
    });
    expect(selectedSlot).toHaveClass('draft-team-slot--selected');
  });

  it('does not apply selected class to non-selected team slots', () => {
    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={MOCK_TEAMS[0].id}
        onSelectTeam={noop}
      />
    );

    const unselectedSlot = screen.getByRole('button', {
      name: new RegExp(MOCK_TEAMS[1].name, 'i'),
    });
    expect(unselectedSlot).not.toHaveClass('draft-team-slot--selected');
  });

  it('shows the roster count badge when a team has drafted players', () => {
    const rosters = {
      [MOCK_TEAMS[0].id]: [MOCK_PLAYERS[0], MOCK_PLAYERS[1]],
    };

    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={rosters}
        selectedTeamId={null}
        onSelectTeam={noop}
      />
    );

    // The badge renders the count (2) near the slot for team 1
    // The aria-label on the button includes the count
    const slot = screen.getByRole('button', {
      name: new RegExp(`${MOCK_TEAMS[0].name}.*2 players drafted`, 'i'),
    });
    expect(slot).toBeInTheDocument();
  });

  it('does not show a badge when a team has no drafted players', () => {
    render(
      <DraftLeagueBar
        teams={MOCK_TEAMS}
        rosters={emptyRosters}
        selectedTeamId={null}
        onSelectTeam={noop}
      />
    );

    // No badge elements should be visible
    const badges = document.querySelectorAll('.draft-team-slot__badge');
    expect(badges).toHaveLength(0);
  });
});
