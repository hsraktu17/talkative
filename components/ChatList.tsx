// components/ChatList.tsx
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const chats = [
  {
    id: "1",
    name: "Test Skope Final 5",
    message: "Support12: This doesn't go on Tuesday...",
    meta: "Yesterday",
    badge: "Demo",
  },
  {
    id: "2",
    name: "Periskope Team Chat",
    message: "Test message",
    meta: "28-Feb-25",
    badge: "internal",
  },
  {
    id: "3",
    name: "+91 99999 99999",
    message: "Hi there, I'm Swapnika...",
    meta: "25-Feb-25",
    badge: "Signup",
  },
];

export default function ChatList() {
  return (
    <div className="w-80 flex flex-col border-r bg-white dark:bg-[#222e35]">
      {/* Filter/Search Bar */}
      <div className="flex items-center gap-2 px-2 py-2 border-b bg-[#f7f8fa] dark:bg-[#1e2a32]">
        <Button size="sm" className="rounded-full text-xs font-semibold" variant="outline">
          Custom filter
        </Button>
        <Button size="sm" variant="ghost">Save</Button>
        <div className="flex-1">
          <Input placeholder="Search" className="bg-white rounded-full px-3 py-1 text-xs" />
        </div>
        <Button size="sm" variant="ghost"><Filter className="w-4 h-4" /></Button>
      </div>
      {/* Chats */}
      <ScrollArea className="flex-1">
        <ul className="divide-y">
          {chats.map((chat) => (
            <li key={chat.id} className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold truncate">{chat.name}</div>
                  {chat.badge && (
                    <Badge className="text-xs ml-1" variant="secondary">{chat.badge}</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate">{chat.message}</div>
              </div>
              <div className="text-xs text-gray-400">{chat.meta}</div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
