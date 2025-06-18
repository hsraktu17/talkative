import { api, authHeaders } from './client';

export async function getProfile() {
  return api('/api/profile', { headers: authHeaders() });
}
