import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders app shell with persistent navigation and homepage', async () => {
    render(<App />);

    const primaryNav = await screen.findByRole('navigation', { name: /primary/i });
    expect(within(primaryNav).getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^login$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^leagues$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: /^how to play$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /welcome to fantasy league hq/i })).toBeInTheDocument();
    expect(screen.getByText(/signed out/i)).toBeInTheDocument();
  });
});
