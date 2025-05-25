"use client";
import SidebarNav from "./SidebarNav";
import ChatListItem from "./ChatListItem";
import { FiSearch, FiFilter } from "react-icons/fi";
import type { ChatListItem as ChatListItemType, UserProfile } from "@/lib/types";

type Props = {
  chats: ChatListItemType[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
};

export default function ChatSidebar({ chats, user, selected, onSelect }: Props) {
  return (
    <aside className="flex flex-row h-full">
      <SidebarNav />
      <div className="flex flex-col bg-white w-80 border-r h-full">
        {/* Header */}
        <header className="flex items-center px-3 h-16 border-b space-x-2">
          <span className="font-bold text-lg flex-1">Chats</span>
          <button><FiFilter size={18} /></button>
          <button><FiSearch size={18} /></button>
        </header>
        {/* Chat List */}
        <ul className="flex-1 overflow-y-auto">
          {chats.map(chat =>
            <ChatListItem key={chat.id} chat={chat} selected={selected === chat.id} onClick={() => onSelect(chat.id)} />
          )}
        </ul>
        {/* Footer: User info */}
        <footer className="border-t p-4 flex items-center space-x-2 text-xs">
          <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
          <span>{user.display_name}</span>
        </footer>
      </div>
    </aside>
  );
}
