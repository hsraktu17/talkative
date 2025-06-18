import { Avatar } from "./Avatar";
import type { ChatListItem as ChatListItemType } from "@/lib/types";

type Props = {
  chat: ChatListItemType;
  selected: boolean;
  onClick: () => void;
  isOnline?: boolean;
};

export default function ChatListItem({
  chat,
  selected,
  onClick,
  isOnline,
}: Props) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer border-b hover:bg-gray-100 transition 
        ${selected ? "bg-gray-100" : ""}`}
    >
      <Avatar name={chat.display_name} avatarUrl={chat.avatar_url} size={38} />
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center">
          <span className="font-semibold truncate">{chat.display_name}</span>
          {isOnline && (
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-400" />
          )}
          <span className="ml-auto text-xs text-gray-400">
            {chat.last_message_time
              ? new Date(chat.last_message_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 min-w-0">
          <span className="truncate flex-1">
            {chat.last_message_preview || ""}
          </span>
          {(chat.unread_count ?? 0) > 0 && (
            <span className="ml-2 inline-block min-w-[22px] text-center rounded-full bg-green-500 text-white text-xs px-2 py-0.5">
              {chat.unread_count}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
