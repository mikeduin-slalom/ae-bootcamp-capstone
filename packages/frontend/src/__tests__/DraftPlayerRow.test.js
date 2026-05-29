import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DraftPlayerRow from '../components/DraftPlayerRow';

const noop = () => {};

const qbPlayer = {
  id: 'p_001',
  name: 'Patrick Mahomes',
  position: 'QB',
  nflTeam: 'Kansas City Chiefs',
  nflTeamAbbr: 'KC',
  touchdowns: 38,
  passYards: 5250,
  rushYards: 358,
  recYards: 0,
};

const rbPlayer = {
  id: 'p_016',
  name: 'Christian McCaffrey',
  position: 'RB',
  nflTeam: 'San Francisco 49ers',
  nflTeamAbbr: 'SF',
  touchdowns: 17,
  passYards: 0,
  rushYards: 1459,
  recYards: 564,
};

const kPlayer = {
  id: 'p_078',
  name: 'Justin Tucker',
  position: 'K',
  nflTeam: 'Baltimore Ravens',
  nflTeamAbbr: 'BAL',
  touchdowns: 0,
  passYards: 0,
  rushYards: 0,
  recYards: 0,
};

const defPlayer = {
  id: 'p_088',
  name: 'San Francisco 49ers',
  position: 'DEF',
  nflTeam: 'San Francisco 49ers',
  nflTeamAbbr: 'SF',
  touchdowns: 3,
  passYards: 0,
  rushYards: 0,
  recYards: 0,
};

describe('DraftPlayerRow — stat columns', () => {
  it('renders all four stat columns on a QB player row', () => {
    render(<DraftPlayerRow player={qbPlayer} onDraft={noop} />);
    const row = screen.getByTestId('player-row');
    expect(row.querySelector('.draft-player-row__stat--tds')).toBeInTheDocument();
    expect(row.querySelector('.draft-player-row__stat--pass-yards')).toBeInTheDocument();
    expect(row.querySelector('.draft-player-row__stat--rush-yards')).toBeInTheDocument();
    expect(row.querySelector('.draft-player-row__stat--rec-yards')).toBeInTheDocument();
  });

  it('renders non-zero Pass Yds for a QB player', () => {
    render(<DraftPlayerRow player={qbPlayer} onDraft={noop} />);
    const passYds = document.querySelector('.draft-player-row__stat--pass-yards');
    expect(Number(passYds.textContent)).toBeGreaterThan(0);
  });

  it('renders zero Pass Yds for a non-QB player', () => {
    render(<DraftPlayerRow player={rbPlayer} onDraft={noop} />);
    const passYds = document.querySelector('.draft-player-row__stat--pass-yards');
    expect(Number(passYds.textContent)).toBe(0);
  });

  it('renders all zeros for TDs, Rush Yds, Rec Yds for a K player', () => {
    render(<DraftPlayerRow player={kPlayer} onDraft={noop} />);
    const tds = document.querySelector('.draft-player-row__stat--tds');
    const rushYds = document.querySelector('.draft-player-row__stat--rush-yards');
    const recYds = document.querySelector('.draft-player-row__stat--rec-yards');
    expect(Number(tds.textContent)).toBe(0);
    expect(Number(rushYds.textContent)).toBe(0);
    expect(Number(recYds.textContent)).toBe(0);
  });

  it('renders ≥1 TD and 0 Rush Yds / Rec Yds for a DEF player', () => {
    render(<DraftPlayerRow player={defPlayer} onDraft={noop} />);
    const tds = document.querySelector('.draft-player-row__stat--tds');
    const rushYds = document.querySelector('.draft-player-row__stat--rush-yards');
    const recYds = document.querySelector('.draft-player-row__stat--rec-yards');
    expect(Number(tds.textContent)).toBeGreaterThanOrEqual(1);
    expect(Number(rushYds.textContent)).toBe(0);
    expect(Number(recYds.textContent)).toBe(0);
  });

  it('stat spans have the correct BEM class names', () => {
    render(<DraftPlayerRow player={qbPlayer} onDraft={noop} />);
    const tds = document.querySelector('.draft-player-row__stat.draft-player-row__stat--tds');
    const passYds = document.querySelector('.draft-player-row__stat.draft-player-row__stat--pass-yards');
    const rushYds = document.querySelector('.draft-player-row__stat.draft-player-row__stat--rush-yards');
    const recYds = document.querySelector('.draft-player-row__stat.draft-player-row__stat--rec-yards');
    expect(tds).toBeInTheDocument();
    expect(passYds).toBeInTheDocument();
    expect(rushYds).toBeInTheDocument();
    expect(recYds).toBeInTheDocument();
  });
});

describe('DraftPlayerRow — team logo display', () => {
  it('renders a team logo <img> when logoPath is provided', () => {
    render(<DraftPlayerRow player={qbPlayer} logoPath="/logos/nfl/kc.png" onDraft={noop} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logos/nfl/kc.png');
  });

  it('renders descriptive alt text on the logo image', () => {
    render(<DraftPlayerRow player={qbPlayer} logoPath="/logos/nfl/kc.png" onDraft={noop} />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toMatch(/kansas city.*vikings|vikings.*kansas city|kansas city.*logo|kc.*logo/i);
    // More specifically the alt should reference location + name of the NFL team
    expect(img.getAttribute('alt').toLowerCase()).toContain('logo');
  });

  it('does not show abbreviation text when the logo image is displayed', () => {
    render(<DraftPlayerRow player={qbPlayer} logoPath="/logos/nfl/kc.png" onDraft={noop} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByText('KC')).not.toBeInTheDocument();
  });

  it('hides <img> and shows abbreviation when logo fails to load (onError fallback)', () => {
    render(<DraftPlayerRow player={qbPlayer} logoPath="/logos/nfl/kc.png" onDraft={noop} />);
    const img = screen.getByRole('img');

    // Fire the error event to trigger fallback
    fireEvent.error(img);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('KC')).toBeInTheDocument();
  });

  it('shows abbreviation text only (no img) when logoPath is null', () => {
    render(<DraftPlayerRow player={qbPlayer} logoPath={null} onDraft={noop} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('KC')).toBeInTheDocument();
  });
});
