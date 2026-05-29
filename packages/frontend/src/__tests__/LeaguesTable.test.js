import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeaguesTable from '../components/LeaguesTable';

const joinableLeague = {
  id: 'league-joinable-1',
  name: 'Weekend Warriors',
  accessType: 'joinable',
  status: 'draft_ready',
  memberCount: 4,
  maxEntrants: 12
};

const privateLeague1 = {
  id: 'league-private-1',
  name: 'Friends Invitational',
  accessType: 'private',
  status: 'pending',
  memberCount: 6,
  maxEntrants: 10
};

const privateLeague2 = {
  id: 'league-private-2',
  name: 'Office Showdown',
  accessType: 'private',
  status: 'drafting',
  memberCount: 8,
  maxEntrants: 10
};

function renderTable(leagues = [], joinedLeagueIds = new Set(), props = {}) {
  return render(
    <MemoryRouter>
      <LeaguesTable
        leagues={leagues}
        joinedLeagueIds={joinedLeagueIds}
        onJoin={props.onJoin || jest.fn()}
        onRequestJoin={props.onRequestJoin || jest.fn()}
        onAcceptInvitation={props.onAcceptInvitation || jest.fn()}
      />
    </MemoryRouter>
  );
}

// ─── US1: Table structure and columns ─────────────────────────────────────────

describe('LeaguesTable — column headers (US1)', () => {
  it('renders all 5 column headers with scope="col"', () => {
    renderTable([joinableLeague]);

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(5);
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));

    expect(screen.getByRole('columnheader', { name: /league name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /commissioner/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /draft start/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();
  });
});

describe('LeaguesTable — badges (US1)', () => {
  it('renders badge--public with "Public" label on joinable rows', () => {
    renderTable([joinableLeague]);

    const badge = screen.getByText('Public');
    expect(badge).toHaveClass('badge--public');
    expect(badge).toHaveAttribute('aria-label', expect.stringMatching(/public/i));
  });

  it('renders badge--private with "Private" label on private rows', () => {
    renderTable([privateLeague1]);

    const badge = screen.getByText('Private');
    expect(badge).toHaveClass('badge--private');
    expect(badge).toHaveAttribute('aria-label', expect.stringMatching(/private/i));
  });

  it('renders badge--unknown with "Unknown" label for unrecognised accessType', () => {
    renderTable([{ ...joinableLeague, accessType: 'something-else' }]);

    const badge = screen.getByText('Unknown');
    expect(badge).toHaveClass('badge--unknown');
  });
});

describe('LeaguesTable — mock data display (US1)', () => {
  it('shows commissioner name from LEAGUE_MOCK_METADATA', () => {
    renderTable([joinableLeague]);
    expect(screen.getByText('Alex Runner')).toBeInTheDocument();
  });

  it('shows formatted draft start time from LEAGUE_MOCK_METADATA', () => {
    renderTable([joinableLeague]);
    // "Jun 15, 2026 at 7:00 PM" — check for the month/year part at minimum
    expect(screen.getByText(/jun 15, 2026/i)).toBeInTheDocument();
  });

  it('shows "—" fallback for commissioner when league id is unknown', () => {
    renderTable([{ ...joinableLeague, id: 'league-unknown-999' }]);
    const cells = screen.getAllByText('—');
    expect(cells.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "—" fallback for draft start when league id is unknown', () => {
    renderTable([{ ...joinableLeague, id: 'league-unknown-999' }]);
    const cells = screen.getAllByText('—');
    expect(cells.length).toBeGreaterThanOrEqual(2);
  });
});

describe('LeaguesTable — empty state (US1)', () => {
  it('renders empty-state row when leagues array is empty', () => {
    renderTable([]);
    expect(screen.getByText(/no leagues available/i)).toBeInTheDocument();
  });
});

describe('LeaguesTable — table wrapper class (US4)', () => {
  it('wraps the table in an element with class leagues-table-container', () => {
    const { container } = renderTable([joinableLeague]);
    expect(container.querySelector('.leagues-table-container')).toBeInTheDocument();
  });

  it('applies badge--public class correctly on joinable row', () => {
    renderTable([joinableLeague]);
    expect(screen.getByText('Public')).toHaveClass('badge--public');
  });

  it('applies badge--private class correctly on private row', () => {
    renderTable([privateLeague1]);
    expect(screen.getByText('Private')).toHaveClass('badge--private');
  });
});

// ─── US2: Sign Up button ───────────────────────────────────────────────────────

describe('LeaguesTable — Sign Up button (US2)', () => {
  it('renders "Sign Up" button on joinable rows that are not joined', () => {
    renderTable([joinableLeague], new Set());
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('calls onJoin with the correct league.id when Sign Up is clicked', () => {
    const onJoin = jest.fn();
    renderTable([joinableLeague], new Set(), { onJoin });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(onJoin).toHaveBeenCalledWith('league-joinable-1');
  });

  it('does not render "Sign Up" button when the row is already joined', () => {
    renderTable([joinableLeague], new Set(['league-joinable-1']));
    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
  });
});

// ─── US3: Request to Join + invite toggle + Joined indicator ──────────────────

describe('LeaguesTable — Request to Join (US3)', () => {
  it('renders "Request to Join" button on private rows that are not joined', () => {
    renderTable([privateLeague2], new Set());
    expect(screen.getByRole('button', { name: /request to join/i })).toBeInTheDocument();
  });

  it('calls onRequestJoin when "Request to Join" is clicked', () => {
    const onRequestJoin = jest.fn();
    renderTable([privateLeague2], new Set(), { onRequestJoin });
    fireEvent.click(screen.getByRole('button', { name: /request to join/i }));
    expect(onRequestJoin).toHaveBeenCalledWith('league-private-2');
  });

  it('renders "Have an invite? Enter code" toggle button on private not-joined rows', () => {
    renderTable([privateLeague2], new Set());
    expect(screen.getByRole('button', { name: /have an invite/i })).toBeInTheDocument();
  });

  it('reveals inline input and Accept Invitation button after toggling invite link', () => {
    renderTable([privateLeague2], new Set());
    fireEvent.click(screen.getByRole('button', { name: /have an invite/i }));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept invitation/i })).toBeInTheDocument();
  });

  it('"Accept Invitation" button is disabled when input is empty', () => {
    renderTable([privateLeague2], new Set());
    fireEvent.click(screen.getByRole('button', { name: /have an invite/i }));

    expect(screen.getByRole('button', { name: /accept invitation/i })).toBeDisabled();
  });

  it('calls onAcceptInvitation with trimmed token value', () => {
    const onAcceptInvitation = jest.fn();
    renderTable([privateLeague2], new Set(), { onAcceptInvitation });
    fireEvent.click(screen.getByRole('button', { name: /have an invite/i }));

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  my-token  ' } });
    fireEvent.click(screen.getByRole('button', { name: /accept invitation/i }));

    expect(onAcceptInvitation).toHaveBeenCalledWith('my-token');
  });
});

describe('LeaguesTable — Joined indicator (US3)', () => {
  it('shows a non-interactive "Joined" indicator for joined joinable rows', () => {
    renderTable([joinableLeague], new Set(['league-joinable-1']));
    expect(screen.getByText(/joined/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('shows a non-interactive "Joined" indicator for joined private rows', () => {
    renderTable([privateLeague1], new Set(['league-private-1']));
    expect(screen.getByText(/joined/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /request to join/i })).not.toBeInTheDocument();
  });
});
