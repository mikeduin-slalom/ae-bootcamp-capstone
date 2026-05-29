import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../pages/LoginPage', () => function MockLoginPage() {
  return (
    <section className="page-card">
      <h1>Login</h1>
    </section>
  );
});

jest.mock('../pages/LeaguesPage', () => function MockLeaguesPage() {
  return (
    <section className="page-card">
      <h1>Leagues</h1>
    </section>
  );
});

jest.mock('../pages/HowToPlayPage', () => function MockHowToPlayPage() {
  return (
    <section className="page-card">
      <h1>How to Play</h1>
    </section>
  );
});

describe('App', () => {
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  test('renders app shell with persistent navigation and homepage', async () => {
    render(<App />);

    const primaryNav = await screen.findByRole('navigation', { name: /primary/i });
    expect(within(primaryNav).getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^login$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^leagues$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^how to play$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /build your winning fantasy season/i })).toBeInTheDocument();
    expect(screen.getByText(/signed out/i)).toBeInTheDocument();
  });

  test('routes each primary CTA to the expected destination', async () => {
    const user = userEvent.setup();
    render(<App />);

    const heroActions = await screen.findByRole('group', { name: /primary actions/i });

    await user.click(within(heroActions).getByRole('link', { name: /^login$/i }));
    expect(await screen.findByRole('heading', { name: /^login$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^home$/i }));
    await user.click(within(await screen.findByRole('group', { name: /primary actions/i })).getByRole('link', { name: /browse leagues/i }));
    expect(await screen.findByRole('heading', { name: /^leagues$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^home$/i }));
    await user.click(within(await screen.findByRole('group', { name: /primary actions/i })).getByRole('link', { name: /how to play/i }));
    expect(await screen.findByRole('heading', { name: /how to play/i })).toBeInTheDocument();
  });

  test('redirects unknown routes to home while preserving primary navigation', async () => {
    window.history.pushState({}, '', '/not-a-route');
    render(<App />);

    expect(await screen.findByRole('heading', { name: /build your winning fantasy season/i })).toBeInTheDocument();
    const primaryNav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(primaryNav).getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^login$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^leagues$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^how to play$/i })).toBeInTheDocument();
  });
});
