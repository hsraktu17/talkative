// lib/types.ts

// Profile as stored in 'profiles' table
export type UserProfile = {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  last_seen?: string | null;
};

// A single chat row (from 'chats' table)
export type Chat = {
  id: string;
  user1_id: string;
  user2_id: string;
  updated_at?: string; // Last activity in the chat (may be set via trigger)
};

// Message in a chat (from 'messages' table)
export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

// Chat item for sidebar UI (derived from chat + user + message info)
export type ChatListItem = {
  id: string; // Peer user ID (the person you’re chatting with)
  display_name: string;
  avatar_url?: string | null;
  email: string;
  last_seen?: string | null;
  chat_id: string; // The chat ID of this conversation
  updated_at?: string; // From chat table (for sorting)
  last_message_time?: string; // Latest message time (for sorting)
};

// Sidebar props
export interface ChatSidebarProps {
  chats: ChatListItem[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
  onlineUserIds?: string[];
}

// ChatListItem component props
export interface ChatListItemComponentProps {
  chat: ChatListItem;
  selected: boolean;
  onClick: () => void;
  isOnline: boolean;
}

// For DM chat loader
export interface DMChatLoaderProps {
  currentUser: UserProfile;
  peerId: string | null;
  children: (props: {
    chat: Chat | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}
