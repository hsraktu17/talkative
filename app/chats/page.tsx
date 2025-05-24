"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import { supabaseBrowser } from "@/utils/supabase/client";
import { UserProfile, ChatListItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import DMChatLoader from "@/components/DMChatLoader";
import ChatWindow from "@/components/ChatWindow";

export default function ChatsPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }

      // Fetch your own profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        router.push("/login");
        return;
      }
      setUser(profile);

      // Fetch all other users for chat list
      const { data: others } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", authUser.id);

      // Ensure correct type
      const chatList: ChatListItem[] = (others || []).map((u) => ({
        id: u.id,
        display_name: u.display_name,
        avatar_url: u.avatar_url,
        last_seen: u.last_seen,
        email: u.email,
      }));
      setChatList(chatList);

      setLoading(false);
    }
    fetchData();
  }, [supabase, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Will redirect if not logged in

  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa] text-[#111b21] dark:bg-[#111b21]">
      <ChatSidebar
        chats={chatList}
        user={user}
        selected={selected}
        onSelect={setSelected}
      />
      <main className="flex-1">
        <DMChatLoader currentUser={user} peerId={selected}>
          {({ chat, loading, error }) => {
            if (!selected) return <div>Select a user to start chatting.</div>;
            if (loading) return <div>Loading chat…</div>;
            if (error) return <div>Error: {error}</div>;
            if (!chat) return <div>Chat not found/created!</div>;
            // Get the profile of the selected user (from your chatList)
            const otherUser = chatList.find(u => u.id === selected);
            if (!otherUser) return <div>User not found!</div>;
            return (
              <ChatWindow
                chat={chat}
                currentUser={user}
                otherUser={otherUser}
              />
            );
          }}
        </DMChatLoader>
      </main>
    </div>
  );
}
