"use client";

import { useEffect, useRef, useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import { supabaseBrowser } from "@/utils/supabase/client";
import { UserProfile, ChatListItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import DMChatLoader from "@/components/DMChatLoader";
import ChatWindow from "@/components/ChatWindow";
import PresenceHandler from "@/components/PresenceHandler";

export default function ChatsPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Get session & user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }

      // Fetch own profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        router.push("/login");
        return;
      }
      setUser(profile as UserProfile);

      // Fetch all chats for user, most recent first
      const { data: chats } = await supabase
        .from("chats")
        .select("*")
        .or(`user1_id.eq.${authUser.id},user2_id.eq.${authUser.id}`)
        .order("updated_at", { ascending: false });

      // For each chat, get the other user's profile and last message
      const chatList: ChatListItem[] = [];
      for (const chat of chats || []) {
        const otherUserId = chat.user1_id === authUser.id ? chat.user2_id : chat.user1_id;
        const { data: otherProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", otherUserId)
          .single();
        // Latest message
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("created_at")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (otherProfile) {
          chatList.push({
            id: otherProfile.id,
            display_name: otherProfile.display_name,
            avatar_url: otherProfile.avatar_url,
            email: otherProfile.email,
            last_seen: otherProfile.last_seen,
            chat_id: chat.id,
            updated_at: chat.updated_at,
            last_message_time: lastMsg?.created_at || chat.updated_at,
          });
        }
      }
      setChatList(chatList);

      // Dummy: only current user online
      setOnlineUserIds([authUser.id]);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [supabase, router, refreshFlag]);

  // Realtime: subscribe for new messages
  useEffect(() => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          setRefreshFlag((f) => f + 1);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [supabase]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa] text-[#111b21] dark:bg-[#111b21]">
      <PresenceHandler currentUser={user} />
      <ChatSidebar
        chats={chatList}
        user={user}
        selected={selected}
        onSelect={setSelected}
        onlineUserIds={onlineUserIds}
      />
      <main className="flex-1">
        <DMChatLoader currentUser={user} peerId={selected}>
          {({ chat, loading, error }) => {
            if (!selected) return <div>Select a user to start chatting.</div>;
            if (loading) return <div>Loading chat…</div>;
            if (error) return <div>Error: {error}</div>;
            if (!chat) return <div>Chat not found/created!</div>;
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
