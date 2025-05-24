'use client';

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  message: string;
  meta: string;
  badge?: string;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const supabase = supabaseBrowser();
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChats([]);
        setLoading(false);
        return;
      }
      // 2. Fetch chats for the current user (adapt this query to your schema)
      // Assuming your `chats` table has a `participants` column which is an array of user IDs
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [user.id])
        .order("updated_at", { ascending: false });

      if (error) {
        setChats([]);
      } else {
        // Map your data to Chat[]
        type SupabaseChat = {
          id: string;
          name: string;
          last_message?: string;
          updated_at: string;
          badge?: string;
        };

        const chatList = (data || []).map((chat: SupabaseChat) => ({
          id: chat.id,
          name: chat.name,
          message: chat.last_message || "",
          meta: new Date(chat.updated_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }), // Example
          badge: chat.badge || "",
        }));
        setChats(chatList);
      }
      setLoading(false);
    };

    fetchChats();
  }, []);

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
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-400">Loading...</div>
        ) : (
          <ul className="divide-y">
            {chats.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">No chats found.</div>
            )}
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
        )}
      </ScrollArea>
    </div>
  );
}
