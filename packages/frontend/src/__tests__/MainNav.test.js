import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainNav from '../components/MainNav';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { displayName: 'Alex Runner', email: 'alex@example.com' },
    logout: mockLogout
  })
}));

describe('MainNav', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogout.mockReset();
    mockLogout.mockResolvedValue(undefined);
  });

  it('shows signed-in indicator and supports logout', async () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    );

    expect(screen.getByText(/signed in as alex runner/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
