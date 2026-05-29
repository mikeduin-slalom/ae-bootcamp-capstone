import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeaguesPage from '../pages/LeaguesPage';
import * as leaguesService from '../services/leaguesService';

const mockUseAuth = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

const leagueListPayload = {
  data: [
    {
      id: 'league-joinable-1',
      name: 'Weekend Warriors',
      accessType: 'joinable',
      status: 'draft_ready',
      memberCount: 4,
      maxEntrants: 12
    },
    {
      id: 'league-private-1',
      name: 'Friends Invitational',
      accessType: 'private',
      status: 'pending',
      memberCount: 6,
      maxEntrants: 10
    }
  ]
};

describe('LeaguesPage', () => {
  beforeEach(() => {
    jest.spyOn(leaguesService, 'listLeagues').mockResolvedValue(leagueListPayload);
    jest.spyOn(leaguesService, 'joinLeague').mockResolvedValue({ success: true });
    jest.spyOn(leaguesService, 'acceptInvitation').mockResolvedValue({ success: true });
    jest.spyOn(leaguesService, 'requestToJoin').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows read-only guidance to guests', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/you are currently browsing as a guest/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /join league/i }));
    expect(await screen.findByText(/please sign in to join leagues/i)).toBeInTheDocument();
  });

  it('joins a joinable league for authenticated users', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    fireEvent.click(screen.getByRole('button', { name: /join league/i }));

    await waitFor(() => {
      expect(leaguesService.joinLeague).toHaveBeenCalledWith('league-joinable-1');
      expect(screen.getByText(/league joined successfully/i)).toBeInTheDocument();
    });
  });

  it('shows invitation token failure feedback', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    leaguesService.acceptInvitation.mockRejectedValue({
      response: { data: { error: { message: 'Invitation has expired.' } } }
    });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/friends invitational/i);
    fireEvent.change(screen.getByLabelText(/invitation token/i), {
      target: { value: 'invite-expired-token' }
    });
    fireEvent.click(screen.getByRole('button', { name: /accept invitation/i }));

    expect(await screen.findByText(/invitation has expired/i)).toBeInTheDocument();
  });

  it('shows request pending feedback for private leagues', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/friends invitational/i);
    fireEvent.click(screen.getByRole('button', { name: /request to join/i }));

    expect(await screen.findByText(/join request submitted and pending review/i)).toBeInTheDocument();
  });
});
