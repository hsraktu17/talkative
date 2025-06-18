export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

let authToken = '';

export function setAuth(token: string) {
  authToken = token;
}

export function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
