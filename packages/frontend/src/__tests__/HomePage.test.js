import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders a semantic landing hero region with primary actions', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const heroRegion = screen.getByRole('region', { name: /play postseason fantasy football/i });
    expect(heroRegion).toBeInTheDocument();

    const actionsGroup = within(heroRegion).getByRole('group', { name: /primary actions/i });
    expect(within(actionsGroup).queryByRole('link', { name: /^login$/i })).not.toBeInTheDocument();
    expect(within(actionsGroup).getByRole('link', { name: /browse leagues/i })).toHaveAttribute('href', '/leagues');
    expect(within(actionsGroup).getByRole('link', { name: /how to play/i })).toHaveAttribute('href', '/how-to-play');
  });

  it('does not render a Login CTA in the hero section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const heroRegion = screen.getByRole('region', { name: /play postseason fantasy football/i });
    expect(within(heroRegion).queryByRole('link', { name: /^login$/i })).not.toBeInTheDocument();
    expect(within(heroRegion).getByRole('link', { name: /browse leagues/i })).toBeInTheDocument();
    expect(within(heroRegion).getByRole('link', { name: /how to play/i })).toBeInTheDocument();
  });

  it('presents readable heading hierarchy and supporting copy', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /play postseason fantasy football/i })).toBeInTheDocument();
    expect(screen.getByText(/draft smarter, manage matchups with confidence/i)).toBeInTheDocument();
  });

  it('keeps all primary CTAs visibly emphasized', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const ctaLinks = [
      screen.getByRole('link', { name: /browse leagues/i }),
      screen.getByRole('link', { name: /how to play/i })
    ];

    ctaLinks.forEach((link) => {
      expect(link).toHaveClass('primary-cta');
    });
    expect(ctaLinks[0]).toHaveClass('primary-cta-secondary');
    expect(ctaLinks[1]).toHaveClass('primary-cta-secondary');
  });

  it('supports keyboard focus traversal across Browse Leagues and How to Play CTAs', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.tab();
    expect(screen.getByRole('link', { name: /browse leagues/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: /how to play/i })).toHaveFocus();
  });

  it('preserves CTA usability on mobile-sized viewports', () => {
    const previousWidth = window.innerWidth;
    window.innerWidth = 375;

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const actionGroup = screen.getByRole('group', { name: /primary actions/i });
    expect(actionGroup).toBeInTheDocument();
    expect(within(actionGroup).queryByRole('link', { name: /^login$/i })).not.toBeInTheDocument();
    expect(within(actionGroup).getByRole('link', { name: /browse leagues/i })).toBeVisible();
    expect(within(actionGroup).getByRole('link', { name: /how to play/i })).toBeVisible();

    window.innerWidth = previousWidth;
  });
});
