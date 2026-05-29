const { users, sessions, nextId } = require('./dataStore');

const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName
  };
}

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

function createSession(userId) {
  const now = Date.now();
  const sessionId = nextId('session');
  const session = {
    sessionId,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
    revokedAt: null
  };

  sessions.set(sessionId, session);
  return session;
}

function isSessionActive(session) {
  if (!session || session.revokedAt) {
    return false;
  }

  return new Date(session.expiresAt).getTime() > Date.now();
}

function login(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return null;
  }

  const session = createSession(user.id);
  return {
    session,
    user: sanitizeUser(user)
  };
}

function getSession(sessionId) {
  if (!sessionId) {
    return {
      isAuthenticated: false,
      user: null,
      session: null
    };
  }

  const session = sessions.get(sessionId);
  if (!isSessionActive(session)) {
    return {
      isAuthenticated: false,
      user: null,
      session: null
    };
  }

  const user = users.find((candidate) => candidate.id === session.userId) || null;

  return {
    isAuthenticated: true,
    user: sanitizeUser(user),
    session
  };
}

function logout(sessionId) {
  const session = sessions.get(sessionId);
  if (session && !session.revokedAt) {
    session.revokedAt = new Date().toISOString();
    sessions.set(sessionId, session);
  }

  return { success: true };
}

module.exports = {
  login,
  getSession,
  logout
};
