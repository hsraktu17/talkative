import { FiMessageCircle } from "react-icons/fi"; // Or any chat/plus icon you like
import SidebarNav from "./SidebarNav";
import ChatListItem from "./ChatListItem";
import type { ChatListItem as ChatListItemType, UserProfile } from "@/lib/types";

type Props = {
  chats: ChatListItemType[];
  user: UserProfile;
  selected: string | null;
  onSelect: (id: string) => void;
  onlineUserIds?: string[];
  onNewChatClick?: () => void; // Callback for button
};

export default function ChatSidebar({
  chats,
  user,
  selected,
  onSelect,
  onlineUserIds = [],
  onNewChatClick, // pass this in
}: Props) {
  return (
    <aside className="flex flex-row h-full">
      <SidebarNav user={user} />
      <div className="flex flex-col bg-white w-80 border-r h-full relative overflow-hidden">
        {/* Header */}
        <header className="flex items-center px-3 h-16 border-b space-x-2">
          <span className="font-bold text-lg flex-1">Chats</span>
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
        {/* Floating New Chat Button */}
        <button
          onClick={onNewChatClick}
          title="New Chat"
          className="
            absolute 
            bottom-12 right-6
            bg-green-500 hover:bg-green-600 
            text-white shadow-lg
            rounded-full w-12 h-12 flex items-center justify-center
            transition
            z-20
          "
        >
          <FiMessageCircle size={28} />
        </button>
      </div>
    </aside>
  );
}
