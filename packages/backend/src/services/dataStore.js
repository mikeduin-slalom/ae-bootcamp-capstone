const SEED_USERS = [
  {
    id: 'user-1',
    email: 'alex@example.com',
    displayName: 'Alex Runner',
    passwordHash: '$2b$10$bHh0Ys40g1Z5fbXGVsBCb.Y8RewlT4yLLDj8MBAvBA09V71qkIzHS',
    createdAt: '2026-05-01T10:00:00.000Z'
  },
  {
    id: 'user-2',
    email: 'casey@example.com',
    displayName: 'Casey Coach',
    passwordHash: '$2b$10$WgJHX9y1pbldxsg/QtnShOV/9YKM3L10iHKMzjquKoHFdOVN7lnb2',
    createdAt: '2026-05-01T10:30:00.000Z'
  }
];

const users = [...SEED_USERS.map((u) => ({ ...u }))];

const leagues = [
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
  },
  {
    id: 'league-private-2',
    name: 'Office Showdown',
    accessType: 'private',
    status: 'drafting',
    memberCount: 8,
    maxEntrants: 10
  }
];

const memberships = [
  {
    id: 'membership-1',
    leagueId: 'league-private-1',
    userId: 'user-2',
    role: 'commissioner',
    joinedAt: '2026-05-02T12:00:00.000Z'
  }
];

const invitations = [
  {
    invitationToken: 'invite-valid-token',
    leagueId: 'league-private-1',
    invitedUserId: null,
    expiresAt: '2028-01-01T00:00:00.000Z',
    consumedAt: null
  },
  {
    invitationToken: 'invite-expired-token',
    leagueId: 'league-private-2',
    invitedUserId: null,
    expiresAt: '2024-01-01T00:00:00.000Z',
    consumedAt: null
  }
];

const joinRequests = [];
const sessions = new Map();
const auditEntries = [];

const idCounters = {
  user: SEED_USERS.length,
  session: 0,
  membership: memberships.length,
  request: 0
};

function nextId(kind) {
  idCounters[kind] += 1;
  return `${kind}-${idCounters[kind]}`;
}

function resetDataStore() {
  users.length = 0;
  SEED_USERS.forEach((u) => users.push({ ...u }));
  idCounters.user = SEED_USERS.length;

  memberships.length = 0;
  memberships.push({
    id: 'membership-1',
    leagueId: 'league-private-1',
    userId: 'user-2',
    role: 'commissioner',
    joinedAt: '2026-05-02T12:00:00.000Z'
  });

  invitations.forEach((invite) => {
    invite.consumedAt = null;
  });

  joinRequests.length = 0;
  sessions.clear();
  auditEntries.length = 0;

  idCounters.session = 0;
  idCounters.membership = memberships.length;
  idCounters.request = 0;
}

module.exports = {
  users,
  leagues,
  memberships,
  invitations,
  joinRequests,
  sessions,
  auditEntries,
  nextId,
  resetDataStore
};
