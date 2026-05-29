import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders one-click entry actions for login, leagues, and how-to-play', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome to fantasy league hq/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /browse leagues/i })).toHaveAttribute('href', '/leagues');
    expect(screen.getByRole('link', { name: /how to play/i })).toHaveAttribute('href', '/how-to-play');
  });
});
