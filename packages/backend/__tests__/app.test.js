const request = require('supertest');
const { app } = require('../src/app');
const { resetDataStore } = require('../src/services/dataStore');
const { getRecentAuditEvents } = require('../src/services/auditLogService');

async function loginAsAlex() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alex@example.com', password: 'password123' });

  return response.body.data.sessionId;
}

describe('Backend API', () => {
  beforeEach(() => {
    resetDataStore();
  });

  describe('Baseline endpoints', () => {
    it('returns service health metadata', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'backend');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('returns capstone baseline guidance', async () => {
      const response = await request(app).get('/api/project');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('nextStep');
    });
  });

  describe('Auth endpoints', () => {
    it('rejects blank credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({ email: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'wrong-password' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('creates session and returns authenticated session state', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'password123' });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data.isAuthenticated).toBe(true);
      expect(loginResponse.body.data.user.email).toBe('alex@example.com');
      expect(loginResponse.body.data.sessionId).toBeTruthy();

      const sessionResponse = await request(app)
        .get('/api/auth/session')
        .set('Authorization', `Bearer ${loginResponse.body.data.sessionId}`);

      expect(sessionResponse.status).toBe(200);
      expect(sessionResponse.body.data.isAuthenticated).toBe(true);
      expect(sessionResponse.body.data.user.displayName).toBe('Alex Runner');
    });

    it('logs out and clears auth state', async () => {
      const sessionId = await loginAsAlex();

      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);

      const sessionResponse = await request(app)
        .get('/api/auth/session')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(sessionResponse.body.data.isAuthenticated).toBe(false);
      expect(sessionResponse.body.data.user).toBeNull();
    });
  });

  describe('Leagues endpoint behavior', () => {
    it('returns league list for signed-out users', async () => {
      const response = await request(app).get('/api/leagues');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('guards membership actions when not authenticated', async () => {
      const response = await request(app).post('/api/leagues/league-joinable-1/join');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('joins a joinable league once and rejects duplicate joins', async () => {
      const sessionId = await loginAsAlex();

      const firstJoin = await request(app)
        .post('/api/leagues/league-joinable-1/join')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(firstJoin.status).toBe(200);
      expect(firstJoin.body.success).toBe(true);
      expect(firstJoin.body.data.membershipStatus).toBe('joined');

      const secondJoin = await request(app)
        .post('/api/leagues/league-joinable-1/join')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(secondJoin.status).toBe(409);
      expect(secondJoin.body.error.code).toBe('ALREADY_MEMBER');
    });

    it('accepts valid private invitation and rejects consumed token', async () => {
      const sessionId = await loginAsAlex();

      const firstAccept = await request(app)
        .post('/api/leagues/private/invitations/invite-valid-token/accept')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(firstAccept.status).toBe(200);
      expect(firstAccept.body.success).toBe(true);

      const secondAccept = await request(app)
        .post('/api/leagues/private/invitations/invite-valid-token/accept')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(secondAccept.status).toBe(409);
      expect(secondAccept.body.error.code).toBe('INVITATION_CONSUMED');
    });

    it('rejects invalid invitation token', async () => {
      const sessionId = await loginAsAlex();

      const response = await request(app)
        .post('/api/leagues/private/invitations/not-a-token/accept')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('INVITATION_NOT_FOUND');
    });

    it('creates pending request and prevents duplicate pending requests', async () => {
      const sessionId = await loginAsAlex();

      const firstRequest = await request(app)
        .post('/api/leagues/league-private-2/request-join')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(firstRequest.status).toBe(202);
      expect(firstRequest.body.success).toBe(true);
      expect(firstRequest.body.data.requestStatus).toBe('pending');

      const secondRequest = await request(app)
        .post('/api/leagues/league-private-2/request-join')
        .set('Authorization', `Bearer ${sessionId}`);

      expect(secondRequest.status).toBe(409);
      expect(secondRequest.body.error.code).toBe('REQUEST_ALREADY_PENDING');
    });
  });

  describe('How to Play content endpoint', () => {
    it('returns ordered sections by sequence', async () => {
      const response = await request(app).get('/api/content/how-to-play');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(1);

      const sequences = response.body.data.map((section) => section.sequence);
      const sorted = [...sequences].sort((a, b) => a - b);
      expect(sequences).toEqual(sorted);
    });
  });

  describe('Observability', () => {
    it('captures audit logs for login and join attempts', async () => {
      const sessionId = await loginAsAlex();

      await request(app)
        .post('/api/leagues/league-joinable-1/join')
        .set('Authorization', `Bearer ${sessionId}`);

      const events = getRecentAuditEvents().map((entry) => entry.event);

      expect(events).toContain('auth.login.succeeded');
      expect(events).toContain('league.join.succeeded');
    });
  });
});
