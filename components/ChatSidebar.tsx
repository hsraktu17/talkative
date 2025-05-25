"use client";
import SidebarNav from "./SidebarNav";
import ChatListItem from "./ChatListItem";
import type { ChatListItem as ChatListItemType, UserProfile } from "@/lib/types";

type Props = {
  chats: ChatListItemType[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
  onlineUserIds?: string[];
};

export default function ChatSidebar({
  chats,
  user,
  selected,
  onSelect,
  onlineUserIds = [],
}: Props) {
  return (
    <aside className="flex flex-row h-full">
      {/* Left icon sidebar */}
      <SidebarNav user={user} />
      {/* Main chat sidebar */}
      <div className="flex flex-col w-80 bg-white border-r h-full">
        {/* Header */}
        <header className="flex items-center px-4 h-16 border-b">
          <span className="font-bold text-lg flex-1">Chats</span>
          {/* Add filter/search here if needed */}
        </header>
        {/* Chat List */}
        <ul className="flex-1 overflow-y-auto bg-white">
          {chats.map(chat => (
            <ChatListItem
              key={chat.chat_id || chat.id}
              chat={chat}
              selected={selected === chat.id}
              onClick={() => onSelect(chat.id)}
              isOnline={onlineUserIds?.includes(chat.id)}
            />
          ))}
        </ul>


        {/* Footer: User info */}
        <footer className="border-t px-4 py-3 flex items-center space-x-2 text-xs bg-white">
          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center font-bold">
            {user.display_name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="truncate text-gray-800">{user.display_name}</span>
        </footer>
      </div>
    </aside>
  );
}
