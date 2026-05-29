const {
  leagues,
  memberships,
  invitations,
  joinRequests,
  nextId
} = require('./dataStore');

function findLeague(leagueId) {
  return leagues.find((league) => league.id === leagueId) || null;
}

function hasMembership(leagueId, userId) {
  return memberships.some((membership) => membership.leagueId === leagueId && membership.userId === userId);
}

function joinLeague(leagueId, userId) {
  const league = findLeague(leagueId);

  if (!league) {
    return { ok: false, status: 404, code: 'LEAGUE_NOT_FOUND', message: 'League not found.' };
  }

  if (league.accessType !== 'joinable') {
    return { ok: false, status: 409, code: 'LEAGUE_NOT_JOINABLE', message: 'League is not directly joinable.' };
  }

  if (hasMembership(leagueId, userId)) {
    return { ok: false, status: 409, code: 'ALREADY_MEMBER', message: 'You are already a member of this league.' };
  }

  if (league.memberCount >= league.maxEntrants) {
    return { ok: false, status: 409, code: 'LEAGUE_FULL', message: 'League is full.' };
  }

  memberships.push({
    id: nextId('membership'),
    leagueId,
    userId,
    role: 'entrant',
    joinedAt: new Date().toISOString()
  });

  league.memberCount += 1;

  return {
    ok: true,
    status: 200,
    data: {
      leagueId,
      membershipStatus: 'joined'
    }
  };
}

function acceptInvitation(invitationToken, userId) {
  const invitation = invitations.find((candidate) => candidate.invitationToken === invitationToken) || null;

  if (!invitation) {
    return { ok: false, status: 404, code: 'INVITATION_NOT_FOUND', message: 'Invitation not found.' };
  }

  if (invitation.consumedAt) {
    return { ok: false, status: 409, code: 'INVITATION_CONSUMED', message: 'Invitation has already been used.' };
  }

  if (new Date(invitation.expiresAt).getTime() < Date.now()) {
    return { ok: false, status: 409, code: 'INVITATION_EXPIRED', message: 'Invitation has expired.' };
  }

  if (invitation.invitedUserId && invitation.invitedUserId !== userId) {
    return { ok: false, status: 409, code: 'INVITATION_FOR_DIFFERENT_USER', message: 'Invitation is not for this user.' };
  }

  const league = findLeague(invitation.leagueId);
  if (!league) {
    return { ok: false, status: 404, code: 'LEAGUE_NOT_FOUND', message: 'League not found.' };
  }

  if (hasMembership(league.id, userId)) {
    return { ok: false, status: 409, code: 'ALREADY_MEMBER', message: 'You are already a member of this league.' };
  }

  memberships.push({
    id: nextId('membership'),
    leagueId: league.id,
    userId,
    role: 'entrant',
    joinedAt: new Date().toISOString()
  });

  invitation.consumedAt = new Date().toISOString();
  league.memberCount += 1;

  return {
    ok: true,
    status: 200,
    data: {
      leagueId: league.id,
      membershipStatus: 'joinedByInvitation'
    }
  };
}

function requestToJoin(leagueId, userId) {
  const league = findLeague(leagueId);

  if (!league) {
    return { ok: false, status: 404, code: 'LEAGUE_NOT_FOUND', message: 'League not found.' };
  }

  if (league.accessType !== 'private') {
    return { ok: false, status: 409, code: 'LEAGUE_NOT_PRIVATE', message: 'Use direct join for joinable leagues.' };
  }

  if (hasMembership(leagueId, userId)) {
    return { ok: false, status: 409, code: 'ALREADY_MEMBER', message: 'You are already a member of this league.' };
  }

  const existingPending = joinRequests.find(
    (request) =>
      request.leagueId === leagueId &&
      request.requesterUserId === userId &&
      request.status === 'pending'
  );

  if (existingPending) {
    return { ok: false, status: 409, code: 'REQUEST_ALREADY_PENDING', message: 'A request is already pending.' };
  }

  joinRequests.push({
    id: nextId('request'),
    leagueId,
    requesterUserId: userId,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    resolvedAt: null
  });

  return {
    ok: true,
    status: 202,
    data: {
      leagueId,
      requestStatus: 'pending'
    }
  };
}

module.exports = {
  joinLeague,
  acceptInvitation,
  requestToJoin
};
