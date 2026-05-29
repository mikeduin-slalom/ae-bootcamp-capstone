import apiClient from './apiClient';

export async function getHowToPlaySections() {
  return apiClient.get('/content/how-to-play');
}
