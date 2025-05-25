"use client";
import { Avatar } from "./Avatar";
import type { ChatListItem as ChatListItemType } from "@/lib/types";

type Props = {
  chat: ChatListItemType;
  selected: boolean;
  onClick: () => void;
  isOnline: boolean;
};

export default function ChatListItem({ chat, selected, onClick, isOnline }: Props) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer space-x-3 border-b hover:bg-gray-100
        ${selected ? "bg-green-50" : ""}`}
    >
      <Avatar name={chat.display_name} avatarUrl={chat.avatar_url} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate">{chat.display_name}</span>
          <span className="flex items-center gap-1">
            {/* Only show badge if there are unread messages */}
            {(chat.unread_count ?? 0) > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[22px] px-2 py-0.5 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
                {chat.unread_count ?? 0}
              </span>
            )}
            {isOnline ? <span className="w-2 h-2 bg-green-500 rounded-full ml-2" /> : null}
          </span>
        </div>
        <div className="text-xs text-gray-500 truncate flex items-center space-x-1">
          <span>{chat.last_message_preview ?? ""}</span>
        </div>
      </div>
    </li>
  );
}
