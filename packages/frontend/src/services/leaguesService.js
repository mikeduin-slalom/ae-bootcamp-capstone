import apiClient from './apiClient';

export async function listLeagues() {
  return apiClient.get('/leagues');
}

export async function joinLeague(leagueId) {
  return apiClient.post(`/leagues/${leagueId}/join`);
}

export async function acceptInvitation(invitationToken) {
  return apiClient.post(`/leagues/private/invitations/${invitationToken}/accept`);
}

export async function requestToJoin(leagueId) {
  return apiClient.post(`/leagues/${leagueId}/request-join`);
}
