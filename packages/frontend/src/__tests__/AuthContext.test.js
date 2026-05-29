import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import * as apiClient from '../services/apiClient';

function AuthProbe() {
  const { isLoading, isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <button type="button" onClick={() => login({ email: 'alex@example.com', password: 'password123' })}>
        trigger login
      </button>
      <button type="button" onClick={() => logout()}>
        trigger logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(apiClient, 'setSessionToken').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hydrates authenticated state from persisted session', async () => {
    localStorage.setItem('capstone_session_id', 'session-1');
    jest.spyOn(authService, 'session').mockResolvedValue({
      data: {
        isAuthenticated: true,
        user: { id: 'user-1', email: 'alex@example.com', displayName: 'Alex Runner' }
      }
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('alex@example.com');
    });
  });

  it('updates state on login and logout', async () => {
    jest.spyOn(authService, 'session').mockResolvedValue({
      data: {
        isAuthenticated: false,
        user: null
      }
    });

    jest.spyOn(authService, 'login').mockResolvedValue({
      data: {
        isAuthenticated: true,
        user: { id: 'user-1', email: 'alex@example.com', displayName: 'Alex Runner' },
        sessionId: 'session-2'
      }
    });

    jest.spyOn(authService, 'logout').mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByRole('button', { name: /trigger login/i }));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(localStorage.getItem('capstone_session_id')).toBe('session-2');
    });

    fireEvent.click(screen.getByRole('button', { name: /trigger logout/i }));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('none');
      expect(localStorage.getItem('capstone_session_id')).toBeNull();
    });
  });
});
