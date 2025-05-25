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
      <SidebarNav user={user} />
      <div className="flex flex-col bg-white w-80 border-r h-full">
        {/* Header */}
        <header className="flex items-center px-3 h-16 border-b space-x-2">
          <span className="font-bold text-lg flex-1">Chats</span>
          {/* You can add filter/search here if you want icons */}
        </header>
        {/* Chat List */}
        <ul className="flex-1 overflow-y-auto">
          {chats.map(chat =>
            <ChatListItem
              key={chat.id}
              chat={chat}
              selected={selected === chat.id}
              onClick={() => onSelect(chat.id)}
              isOnline={onlineUserIds.includes(chat.id)}
            />
          )}
        </ul>
        {/* Footer: User info */}
        <footer className="border-t p-4 flex items-center space-x-2 text-xs">
          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center font-bold">
            {user.display_name?.charAt(0)?.toUpperCase()}
          </div>
          <span>{user.display_name}</span>
        </footer>
      </div>
    </aside>
  );
}
