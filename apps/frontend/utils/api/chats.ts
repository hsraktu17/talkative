import { api, authHeaders } from './client';

export async function getChats() {
  return api('/api/chats', { headers: authHeaders() });
}

export async function createChat(peer_id: string) {
  return api('/api/chats', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ peer_id })
  });
}

export async function getMessages(chatId: string) {
  return api(`/api/chats/${chatId}/messages`, { headers: authHeaders() });
}

export async function sendMessage(chatId: string, content: string) {
  return api(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ content })
  });
}
