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
    jest.spyOn(leaguesService, 'listMyLeagues').mockResolvedValue({ data: [] });
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
  });

  it('renders a table element after loading', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('calls listLeagues and listMyLeagues in parallel for authenticated users', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(leaguesService.listLeagues).toHaveBeenCalledTimes(1);
    expect(leaguesService.listMyLeagues).toHaveBeenCalledTimes(1);
  });

  it('does not call listMyLeagues for unauthenticated users', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(leaguesService.listLeagues).toHaveBeenCalledTimes(1);
    expect(leaguesService.listMyLeagues).not.toHaveBeenCalled();
  });

  it('shows empty-state message when leagues list is empty', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    leaguesService.listLeagues.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/no leagues available/i)).toBeInTheDocument();
  });

  it('shows Sign Up button for joinable leagues when authenticated', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('calls joinLeague and shows success feedback when Sign Up is clicked', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(leaguesService.joinLeague).toHaveBeenCalledWith('league-joinable-1');
      expect(screen.getByText(/league joined successfully/i)).toBeInTheDocument();
    });
  });

  it('shows warning feedback when unauthenticated user clicks Sign Up', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/please sign in to join leagues/i)).toBeInTheDocument();
  });

  it('shows "Joined" indicator for leagues the user has already joined', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    leaguesService.listMyLeagues.mockResolvedValue({ data: ['league-joinable-1'] });

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(screen.getByText(/joined/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('shows invitation token failure via FeedbackBanner', async () => {
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

    // Toggle the invite input on the private league row
    fireEvent.click(screen.getByRole('button', { name: /have an invite/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'invite-expired-token' } });
    fireEvent.click(screen.getByRole('button', { name: /accept invitation/i }));

    expect(await screen.findByText(/invitation has expired/i)).toBeInTheDocument();
  });

  it('shows request pending feedback for private leagues via FeedbackBanner', async () => {
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

  it('gracefully degrades when listMyLeagues fails — still renders table', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    leaguesService.listMyLeagues.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    await screen.findByText(/weekend warriors/i);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows error FeedbackBanner when listLeagues fails', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    leaguesService.listLeagues.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <LeaguesPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/could not load leagues right now/i)).toBeInTheDocument();
  });
});

