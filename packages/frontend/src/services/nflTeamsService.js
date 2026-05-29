import apiClient from './apiClient';

export async function fetchNflTeams() {
  const response = await apiClient.get('/nfl-teams');
  return response.data;
}

export default { fetchNflTeams };
