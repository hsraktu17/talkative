export type UserProfile = {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  last_seen?: string | null;
};

export type Chat = {
  id: string;
  user1_id: string;
  user2_id: string;
  updated_at?: string;
};

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

export type ChatListItem = {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  email: string;
  last_seen?: string | null;
  chat_id: string;
  updated_at?: string;
  last_message_time?: string;
  last_message_preview?: string; 
  unread_count?: number;         
};


export interface ChatSidebarProps {
  chats: ChatListItem[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
  onlineUserIds?: string[];
}

export interface ChatListItemComponentProps {
  chat: ChatListItem;
  selected: boolean;
  onClick: () => void;
  isOnline: boolean;
}

export interface DMChatLoaderProps {
  currentUser: UserProfile;
  peerId: string | null;
  children: (props: {
    chat: Chat | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}
