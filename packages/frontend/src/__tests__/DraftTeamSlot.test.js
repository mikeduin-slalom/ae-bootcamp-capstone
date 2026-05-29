import React from 'react';
import { render, screen } from '@testing-library/react';
import DraftTeamSlot from '../components/DraftTeamSlot';

const team = { id: 'team_1', name: 'Gridiron Ghosts', initials: 'GG' };
const noop = () => {};

describe('DraftTeamSlot — isActive prop', () => {
  it('applies draft-team-slot--active class when isActive is true', () => {
    render(
      <DraftTeamSlot
        team={team}
        isSelected={false}
        rosterCount={0}
        onClick={noop}
        isActive={true}
      />
    );
    const btn = screen.getByRole('button', { name: /gridiron ghosts/i });
    expect(btn).toHaveClass('draft-team-slot--active');
  });

  it('renders bold "ON THE CLOCK" label when isActive is true', () => {
    render(
      <DraftTeamSlot
        team={team}
        isSelected={false}
        rosterCount={0}
        onClick={noop}
        isActive={true}
      />
    );
    const label = screen.getByText(/on the clock/i);
    expect(label).toBeInTheDocument();
    expect(label.tagName.toLowerCase()).toBe('span');
  });

  it('does not apply draft-team-slot--active class when isActive is false', () => {
    render(
      <DraftTeamSlot
        team={team}
        isSelected={false}
        rosterCount={0}
        onClick={noop}
        isActive={false}
      />
    );
    const btn = screen.getByRole('button', { name: /gridiron ghosts/i });
    expect(btn).not.toHaveClass('draft-team-slot--active');
  });

  it('does not render "ON THE CLOCK" label when isActive is false', () => {
    render(
      <DraftTeamSlot
        team={team}
        isSelected={false}
        rosterCount={0}
        onClick={noop}
        isActive={false}
      />
    );
    expect(screen.queryByText(/on the clock/i)).not.toBeInTheDocument();
  });

  it('does not render "ON THE CLOCK" label when isActive is not provided', () => {
    render(
      <DraftTeamSlot
        team={team}
        isSelected={false}
        rosterCount={0}
        onClick={noop}
      />
    );
    expect(screen.queryByText(/on the clock/i)).not.toBeInTheDocument();
  });
});
