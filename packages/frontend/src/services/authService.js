import apiClient from './apiClient';

export async function login(payload) {
  return apiClient.post('/auth/login', payload);
}

export async function register(payload) {
  return apiClient.post('/auth/register', payload);
}

export async function session() {
  return apiClient.get('/auth/session');
}

export async function logout() {
  return apiClient.post('/auth/logout');
}
