const bcrypt = require('bcryptjs');
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

async function login(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
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

async function register(displayName, email, password) {
  if (!displayName || !email || !password) {
    return { ok: false, status: 400, code: 'VALIDATION_ERROR', message: 'All fields are required.' };
  }

  const trimmedDisplayName = displayName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 20) {
    return { ok: false, status: 400, code: 'VALIDATION_ERROR', message: 'Display name must be between 2 and 20 characters.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    return { ok: false, status: 400, code: 'VALIDATION_ERROR', message: 'A valid email address is required.' };
  }

  if (password.length < 8) {
    return { ok: false, status: 400, code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters.' };
  }

  if (findUserByEmail(trimmedEmail)) {
    return { ok: false, status: 409, code: 'DUPLICATE_EMAIL', message: 'An account with this email already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nextId('user'),
    email: trimmedEmail,
    displayName: trimmedDisplayName,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  const session = createSession(newUser.id);
  return {
    ok: true,
    session,
    user: sanitizeUser(newUser)
  };
}

module.exports = {
  login,
  register,
  getSession,
  logout
};
