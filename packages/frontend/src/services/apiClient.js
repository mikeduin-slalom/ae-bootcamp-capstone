let sessionToken = null;

export function setSessionToken(token) {
  sessionToken = token;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'Request failed');
    error.response = { data: payload, status: response.status };
    throw error;
  }

  return payload;
}

const apiClient = {
  get(path) {
    return request(path, { method: 'GET' });
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }
};

export default apiClient;
