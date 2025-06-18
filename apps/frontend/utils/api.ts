export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${url}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
  return data;
}

export async function signup(email: string, password: string, display_name: string) {
  const data = await apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, display_name }),
  });
  if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
  return data;
}

export async function getChats() {
  return apiFetch('/api/chats');
}

export async function createChat(peer_id: string) {
  return apiFetch('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ peer_id }),
  });
}

export async function getMessages(chatId: string) {
  return apiFetch(`/api/chats/${chatId}/messages`);
}

export async function sendMessage(chatId: string, content: string) {
  return apiFetch(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function connectWebSocket(token: string) {
  const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
  return new WebSocket(`${url}/api/ws?token=${token}`);
}

