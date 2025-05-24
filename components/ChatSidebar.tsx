"use client";
import type { ChatSidebarProps } from "@/lib/types";
import LogoutButton from "./Logout";

export default function ChatSidebar({ chats, user, selected, onSelect }: ChatSidebarProps) {
  return (
    <aside className="w-80 bg-white dark:bg-[#222e35] border-r border-gray-200 dark:border-[#2a3942] flex flex-col">
      <header className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-[#2a3942] font-bold text-lg text-[#0a2f24] dark:text-white">
        Chats
      </header>
      <ul className="flex-1 overflow-y-auto">
        {chats.map((profile) => (
          <li
            key={profile.id}
            onClick={() => onSelect(profile.id)}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#111b21] ${
              selected === profile.id ? "bg-gray-100 dark:bg-[#0a2f24]" : ""
            }`}
          >
            <div className="font-semibold text-[#111b21] dark:text-white">
              {profile.display_name}
            </div>
            <div className="text-xs text-gray-500">{profile.last_seen}</div>
          </li>
        ))}
      </ul>
      <footer className="p-4 text-xs text-gray-400 dark:text-gray-500">
        Logged in as <b>{user.display_name || user.email}</b> <LogoutButton/>
      </footer>
    </aside>
  );
}
