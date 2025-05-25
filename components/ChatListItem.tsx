import { Avatar } from "./Avatar";
import StatusBadge from "./StatusBadge";
import type { ChatListItem as ChatListItemType } from "@/lib/types";

type Props = {
  chat: ChatListItemType;
  selected: boolean;
  onClick: () => void;
};

export default function ChatListItem({ chat, selected, onClick }: Props) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer space-x-3 border-b hover:bg-gray-100
        ${selected ? "bg-gray-200" : ""}`}
    >
      <Avatar name={chat.display_name} avatarUrl={chat.avatar_url} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate">{chat.display_name}</span>
          <span className="text-xs text-gray-400">{/* 28-Feb-25 */}</span>
        </div>
        <div className="text-xs text-gray-500 truncate flex items-center space-x-1">
          <span>{/* Last message preview */}</span>
          <StatusBadge label="Demo" /> {/* Show if needed */}
        </div>
      </div>
    </li>
  );
}
