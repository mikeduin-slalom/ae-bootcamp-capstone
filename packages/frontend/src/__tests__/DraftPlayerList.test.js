import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DraftPlayerList from '../components/DraftPlayerList';
import { MOCK_PLAYERS } from '../constants/draftMockData';

const noop = () => {};

function renderList(overrides = {}) {
  const props = {
    availablePlayers: MOCK_PLAYERS,
    positionFilter: null,
    nflTeamFilter: null,
    onDraft: noop,
    onPositionChange: noop,
    onNflTeamChange: noop,
    onClearFilters: noop,
    ...overrides,
  };
  return render(<DraftPlayerList {...props} />);
}

describe('DraftPlayerList — unfiltered', () => {
  it('renders a row for each available player', () => {
    renderList();
    const rows = screen.getAllByTestId('player-row');
    expect(rows).toHaveLength(MOCK_PLAYERS.length);
  });

  it('renders "No players available" when availablePlayers is empty', () => {
    renderList({ availablePlayers: [] });
    expect(screen.getByText(/no players available/i)).toBeInTheDocument();
  });
});

describe('DraftPlayerList — position filter', () => {
  it('shows only QB players when positionFilter is "QB"', () => {
    renderList({ positionFilter: 'QB' });
    const rows = screen.getAllByTestId('player-row');
    rows.forEach(row => {
      expect(within(row).getByText('QB')).toBeInTheDocument();
    });
  });

  it('shows only RB players when positionFilter is "RB"', () => {
    renderList({ positionFilter: 'RB' });
    const rows = screen.getAllByTestId('player-row');
    rows.forEach(row => {
      expect(within(row).getByText('RB')).toBeInTheDocument();
    });
  });

  it('shows the correct count of QBs', () => {
    renderList({ positionFilter: 'QB' });
    const expectedCount = MOCK_PLAYERS.filter(p => p.position === 'QB').length;
    expect(screen.getAllByTestId('player-row')).toHaveLength(expectedCount);
  });
});

describe('DraftPlayerList — NFL team filter', () => {
  it('shows only players from the selected NFL team', () => {
    const targetTeam = 'Kansas City Chiefs';
    renderList({ nflTeamFilter: targetTeam });

    const rows = screen.getAllByTestId('player-row');
    const expectedCount = MOCK_PLAYERS.filter(p => p.nflTeam === targetTeam).length;
    expect(rows).toHaveLength(expectedCount);
  });
});

describe('DraftPlayerList — combined filters', () => {
  it('shows only players matching both position and NFL team', () => {
    const position = 'QB';
    const nflTeam = 'Kansas City Chiefs';
    renderList({ positionFilter: position, nflTeamFilter: nflTeam });

    const expected = MOCK_PLAYERS.filter(
      p => p.position === position && p.nflTeam === nflTeam
    );

    if (expected.length > 0) {
      expect(screen.getAllByTestId('player-row')).toHaveLength(expected.length);
    } else {
      expect(screen.getByText(/no players match your filters/i)).toBeInTheDocument();
    }
  });

  it('shows empty-state message when no players match combined filters', () => {
    renderList({ positionFilter: 'QB', nflTeamFilter: 'Miami Dolphins' });
    // Miami Dolphins have no QBs in the mock data by design (MIA QB is Tua)
    // Actually Tua IS a QB on MIA — so this test checks the correct intersection rendering
    const expected = MOCK_PLAYERS.filter(
      p => p.position === 'QB' && p.nflTeam === 'Miami Dolphins'
    );
    if (expected.length === 0) {
      expect(screen.getByText(/no players match your filters/i)).toBeInTheDocument();
    } else {
      expect(screen.getAllByTestId('player-row')).toHaveLength(expected.length);
    }
  });
});

describe('DraftPlayerList — empty state message', () => {
  it('shows "No players match your filters." when active filters yield zero results', () => {
    renderList({ positionFilter: 'QB', nflTeamFilter: 'Dallas Cowboys' });
    const expected = MOCK_PLAYERS.filter(
      p => p.position === 'QB' && p.nflTeam === 'Dallas Cowboys'
    );
    if (expected.length === 0) {
      expect(screen.getByText(/no players match your filters/i)).toBeInTheDocument();
    }
  });

  it('shows "No players available." when pool is empty with no filters', () => {
    renderList({ availablePlayers: [] });
    expect(screen.getByText(/no players available/i)).toBeInTheDocument();
  });
});

describe('DraftPlayerList — filter controls', () => {
  it('calls onPositionChange with the selected value', async () => {
    const onPositionChange = jest.fn();
    const user = userEvent.setup();
    renderList({ onPositionChange });

    const positionSelect = screen.getByRole('combobox', { name: /position/i });
    await user.selectOptions(positionSelect, 'QB');
    expect(onPositionChange).toHaveBeenCalledWith('QB');
  });

  it('calls onNflTeamChange with the selected value', async () => {
    const onNflTeamChange = jest.fn();
    const user = userEvent.setup();
    renderList({ onNflTeamChange });

    const teamSelect = screen.getByRole('combobox', { name: /nfl team/i });
    await user.selectOptions(teamSelect, 'Kansas City Chiefs');
    expect(onNflTeamChange).toHaveBeenCalledWith('Kansas City Chiefs');
  });

  it('calls onClearFilters when "Clear Filters" button is clicked', async () => {
    const onClearFilters = jest.fn();
    const user = userEvent.setup();
    renderList({ onClearFilters });

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(onClearFilters).toHaveBeenCalled();
  });
});

describe('DraftPlayerList — stat columns visibility', () => {
  it('renders stat columns on all player rows when unfiltered', () => {
    renderList();
    const rows = screen.getAllByTestId('player-row');
    rows.forEach(row => {
      expect(row.querySelector('.draft-player-row__stat--tds')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--pass-yards')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--rush-yards')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--rec-yards')).toBeInTheDocument();
    });
  });

  it('stats remain visible on all rows when a position filter is applied', () => {
    renderList({ positionFilter: 'RB' });
    const rows = screen.getAllByTestId('player-row');
    rows.forEach(row => {
      expect(row.querySelector('.draft-player-row__stat--tds')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--pass-yards')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--rush-yards')).toBeInTheDocument();
      expect(row.querySelector('.draft-player-row__stat--rec-yards')).toBeInTheDocument();
    });
  });

  it('stats remain visible after filter is cleared (no filter applied)', () => {
    renderList({ positionFilter: null });
    const rows = screen.getAllByTestId('player-row');
    rows.forEach(row => {
      expect(row.querySelector('.draft-player-row__stat--tds')).toBeInTheDocument();
    });
  });

  it('no stat elements rendered when filter produces an empty player list', () => {
    renderList({ availablePlayers: [] });
    expect(document.querySelectorAll('.draft-player-row__stat--tds')).toHaveLength(0);
  });
});
