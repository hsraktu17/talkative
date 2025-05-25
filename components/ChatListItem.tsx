import { Avatar } from "./Avatar";
import StatusBadge from "./StatusBadge";
import type { ChatListItem as ChatListItemType } from "@/lib/types";

type Props = {
  chat: ChatListItemType;
  selected: boolean;
  onClick: () => void;
  isOnline: boolean;
};

export default function ChatListItem({ chat, selected, onClick, isOnline }: Props) {
  // Optionally, you can format time (e.g., show time or "Yesterday")
  const formatTime = (iso: string | undefined) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer space-x-3 border-b transition-colors
        ${selected ? "bg-[#f0f2f5]" : "hover:bg-gray-100"}`}
    >
      <Avatar name={chat.display_name} avatarUrl={chat.avatar_url} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate">{chat.display_name}</span>
          <span className="text-xs text-gray-400">{formatTime(chat.last_message_time || chat.updated_at)}</span>
        </div>
        <div className="text-xs text-gray-500 truncate flex items-center space-x-2">
          {/* You can show a message preview here if available */}
          <StatusBadge label={isOnline ? "Online" : "Offline"} online={isOnline} />
        </div>
      </div>
    </li>
  );
}
