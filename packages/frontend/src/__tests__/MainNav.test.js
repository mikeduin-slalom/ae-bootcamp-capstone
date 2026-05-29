import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainNav from '../components/MainNav';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
let mockAuthState = {
  isAuthenticated: true,
  user: { displayName: 'Alex Runner', email: 'alex@example.com' },
  logout: mockLogout
};

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthState
}));

describe('MainNav', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogout.mockReset();
    mockLogout.mockResolvedValue(undefined);
    mockAuthState = {
      isAuthenticated: true,
      user: { displayName: 'Alex Runner', email: 'alex@example.com' },
      logout: mockLogout
    };
  });

  it('shows displayName and Logout button when authenticated', async () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    );

    expect(screen.getByText(/alex runner/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^register$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^login$/i })).not.toBeInTheDocument();
  });

  it('calls logout() and navigates to / when Logout is clicked', async () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows Register and Login NavLinks in auth section when unauthenticated', () => {
    mockAuthState = { isAuthenticated: false, user: null, logout: mockLogout };

    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /^register$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^register$/i })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('link', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^login$/i })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/alex runner/i)).not.toBeInTheDocument();
  });

  it('does not include a Login link in the primary nav links', () => {
    mockAuthState = { isAuthenticated: false, user: null, logout: mockLogout };

    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    );

    const primaryNav = screen.getByRole('navigation', { name: /primary/i });
    const loginLinksInNav = Array.from(primaryNav.querySelectorAll('a')).filter(
      (el) => el.textContent.trim().toLowerCase() === 'login'
    );
    expect(loginLinksInNav).toHaveLength(0);
  });
});
