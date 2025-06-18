import { api, setAuth } from './client';

export async function login(email: string, password: string) {
  const data = await api<{token: string}>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setAuth(data.token);
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const data = await api<{token: string}>('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ display_name: name, email, password })
  });
  setAuth(data.token);
  return data;
}
