const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { login, getSession, logout, register } = require('./services/authService');
const { leagues } = require('./services/dataStore');
const {
  joinLeague,
  acceptInvitation,
  requestToJoin,
  getUserLeagueIds
} = require('./services/leagueAccessService');
const { recordAuditEvent } = require('./services/auditLogService');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const howToPlaySections = [
  {
    id: 'htp-1',
    title: 'Create Your League Strategy',
    body: 'Review league settings, scoring rules, and roster requirements before draft day.',
    sequence: 1
  },
  {
    id: 'htp-2',
    title: 'Draft and Build Your Squad',
    body: 'Pick players during the draft and monitor bye weeks to keep a balanced roster.',
    sequence: 2
  },
  {
    id: 'htp-3',
    title: 'Manage Weekly Matchups',
    body: 'Set lineups, track injuries, and make waiver moves to maximize scoring.',
    sequence: 3
  }
];

function buildErrorResponse(status, code, message, details) {
  return {
    status,
    body: {
      success: false,
      error: {
        code,
        message,
        details: details || {}
      }
    }
  };
}

function getSessionId(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return null;
}

function requireAuth(req, res, next) {
  const sessionId = getSessionId(req);
  const sessionState = getSession(sessionId);

  if (!sessionState.isAuthenticated || !sessionState.user) {
    const unauthorized = buildErrorResponse(401, 'UNAUTHORIZED', 'Authentication required.');
    return res.status(unauthorized.status).json(unauthorized.body);
  }

  req.auth = {
    sessionId,
    user: sessionState.user
  };

  return next();
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/project', (req, res) => {
  res.status(200).json({
    message: 'Capstone backend baseline ready.',
    nextStep: 'Define domain routes from your approved functional requirements.'
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    const validation = buildErrorResponse(400, 'VALIDATION_ERROR', 'Email and password are required.');
    return res.status(validation.status).json(validation.body);
  }

  const authResult = await login(email, password);

  if (!authResult) {
    recordAuditEvent('auth.login.failed', { email });
    const unauthorized = buildErrorResponse(401, 'INVALID_CREDENTIALS', 'Invalid credentials.');
    return res.status(unauthorized.status).json(unauthorized.body);
  }

  recordAuditEvent('auth.login.succeeded', { userId: authResult.user.id });

  return res.status(200).json({
    success: true,
    data: {
      isAuthenticated: true,
      user: authResult.user,
      sessionId: authResult.session.sessionId
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { displayName, email, password } = req.body || {};

  const result = await register(displayName, email, password);

  if (!result.ok) {
    const error = buildErrorResponse(result.status, result.code, result.message);
    return res.status(error.status).json(error.body);
  }

  recordAuditEvent('auth.register.succeeded', { userId: result.user.id });

  return res.status(201).json({
    success: true,
    data: {
      isAuthenticated: true,
      user: result.user,
      sessionId: result.session.sessionId
    }
  });
});

app.get('/api/auth/session', (req, res) => {
  const sessionState = getSession(getSessionId(req));

  return res.status(200).json({
    success: true,
    data: {
      isAuthenticated: sessionState.isAuthenticated,
      user: sessionState.user
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = getSessionId(req);
  logout(sessionId);

  if (sessionId) {
    recordAuditEvent('auth.logout', { sessionId });
  }

  return res.status(200).json({
    success: true,
    data: {
      isAuthenticated: false
    },
    metadata: {
      sessionCleared: true
    }
  });
});

app.get('/api/leagues', (req, res) => {
  res.status(200).json({
    success: true,
    data: leagues
  });
});

app.get('/api/leagues/my', requireAuth, (req, res) => {
  const leagueIds = getUserLeagueIds(req.auth.user.id);
  return res.status(200).json({
    success: true,
    data: leagueIds
  });
});

app.post('/api/leagues/:leagueId/join', requireAuth, (req, res) => {
  const result = joinLeague(req.params.leagueId, req.auth.user.id);

  if (!result.ok) {
    const error = buildErrorResponse(result.status, result.code, result.message);
    return res.status(error.status).json(error.body);
  }

  recordAuditEvent('league.join.succeeded', {
    userId: req.auth.user.id,
    leagueId: req.params.leagueId
  });

  return res.status(200).json({
    success: true,
    data: result.data,
    metadata: {
      path: 'joinable'
    }
  });
});

app.post('/api/leagues/private/invitations/:invitationToken/accept', requireAuth, (req, res) => {
  const result = acceptInvitation(req.params.invitationToken, req.auth.user.id);

  if (!result.ok) {
    const error = buildErrorResponse(result.status, result.code, result.message);
    return res.status(error.status).json(error.body);
  }

  recordAuditEvent('league.invitation.accepted', {
    userId: req.auth.user.id,
    invitationToken: req.params.invitationToken,
    leagueId: result.data.leagueId
  });

  return res.status(200).json({
    success: true,
    data: result.data,
    metadata: {
      path: 'invitation'
    }
  });
});

app.post('/api/leagues/:leagueId/request-join', requireAuth, (req, res) => {
  const result = requestToJoin(req.params.leagueId, req.auth.user.id);

  if (!result.ok) {
    const error = buildErrorResponse(result.status, result.code, result.message);
    return res.status(error.status).json(error.body);
  }

  recordAuditEvent('league.request.submitted', {
    userId: req.auth.user.id,
    leagueId: req.params.leagueId
  });

  return res.status(202).json({
    success: true,
    data: result.data,
    metadata: {
      path: 'request'
    }
  });
});

app.get('/api/content/how-to-play', (req, res) => {
  const data = [...howToPlaySections].sort((a, b) => a.sequence - b.sequence);
  res.status(200).json({
    success: true,
    data
  });
});

module.exports = { app };