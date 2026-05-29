import apiClient, { setSessionToken } from '../services/apiClient';
import { login, logout, session } from '../services/authService';
import {
  acceptInvitation,
  joinLeague,
  listLeagues,
  requestToJoin
} from '../services/leaguesService';
import { getHowToPlaySections } from '../services/howToPlayService';

describe('apiClient and service wrappers', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    setSessionToken(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends auth header when token is set', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    setSessionToken('session-123');
    await apiClient.get('/auth/session');

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer session-123'
      }
    });
  });

  it('throws parsed API error payload for failed responses', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: { message: 'Invalid credentials.' } })
    });

    await expect(apiClient.post('/auth/login', { email: 'x', password: 'y' })).rejects.toMatchObject({
      response: {
        status: 401,
        data: { success: false, error: { message: 'Invalid credentials.' } }
      }
    });
  });

  it('covers auth, leagues, and how-to-play wrappers', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { sessionId: 's1' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { isAuthenticated: true } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { isAuthenticated: false } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: [] }) });

    expect((await login({ email: 'alex@example.com', password: 'password123' })).success).toBe(true);
    expect((await session()).success).toBe(true);
    expect((await logout()).success).toBe(true);
    expect((await listLeagues()).success).toBe(true);
    expect((await joinLeague('league-joinable-1')).success).toBe(true);
    expect((await acceptInvitation('invite-valid-token')).success).toBe(true);
    expect((await requestToJoin('league-private-1')).success).toBe(true);
    expect((await getHowToPlaySections()).success).toBe(true);
  });
});
