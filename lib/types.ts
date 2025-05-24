// lib/types.ts

export type Chat = {
  participants: unknown
  id: string
  name: string
  last_message: string
  updated_at: string
}

export type Message = {
  id: string
  chat_id: string
  sender_id: string
  sender_name: string
  msg: string
  created_at: string
}

export type UserProfile = {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  last_seen?: string | null;
};

export type ChatListItem = {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  last_seen?: string | null;
  email: string;
};

export interface ChatSidebarProps {
  chats: ChatListItem[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
}
