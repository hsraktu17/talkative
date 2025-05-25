import type { ChatListItemComponentProps } from "@/lib/types";

export default function ChatListItem({
  chat,
  selected,
  onClick,
  isOnline,
}: ChatListItemComponentProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer space-x-3 border-b hover:bg-gray-100
        ${selected ? "bg-gray-200" : ""}`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold uppercase">
        {chat.display_name ? chat.display_name[0] : "U"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate">{chat.display_name}</span>
          <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <div className="text-xs text-gray-500 truncate flex items-center space-x-1">
          {chat.last_message_time && (
            <span>
              {new Date(chat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
