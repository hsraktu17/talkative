"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import { supabaseBrowser } from "@/utils/supabase/client";
import { UserProfile, ChatListItem, Message, Chat } from "@/lib/types";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function ChatsPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch chats+sidebar on mount only
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

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

      // Own profile
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
      const { data: chatsData } = await supabase
        .from("chats")
        .select("*")
        .or(`user1_id.eq.${authUser.id},user2_id.eq.${authUser.id}`)
        .order("updated_at", { ascending: false });

      setChats(chatsData || []);

      // For each chat, get the other user's profile and last message
      const chatList: ChatListItem[] = [];
      for (const chat of chatsData || []) {
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
      // Sort latest at top
      chatList.sort((a, b) => {
        const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return bTime - aTime;
      });

      setChatList(chatList);
      setOnlineUserIds([authUser.id]);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [supabase, router]);

  // --- 1. Realtime: update chatList state only, do NOT re-fetch everything ---
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
        (payload) => {
          const msg = payload.new as Message;
          setChatList(prev => {
            const updated = prev.map(c => {
              if (c.chat_id === msg.chat_id) {
                return { ...c, last_message_time: msg.created_at };
              }
              return c;
            });
            updated.sort((a, b) => {
              const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
              const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
              return bTime - aTime;
            });
            return updated;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [supabase]);

  // --- 2. When you send a message, call this callback ---
  const handleMessageSent = useCallback((msg: Message) => {
    setChatList(prev => {
      const updated = prev.map(c => {
        if (c.chat_id === msg.chat_id) {
          return { ...c, last_message_time: msg.created_at };
        }
        return c;
      });
      updated.sort((a, b) => {
        const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return bTime - aTime;
      });
      return updated;
    });
  }, []);

  // --- Find the right chat and user for the ChatWindow ---
  let chatObj: Chat | undefined;
  let otherUser: UserProfile | undefined;
  if (selected && user) {
    chatObj = chats.find(
      c =>
        (c.user1_id === user.id && c.user2_id === selected) ||
        (c.user2_id === user.id && c.user1_id === selected)
    );
    const selectedChat = chatList.find(c => c.id === selected);
    if (selectedChat) {
      otherUser = {
        id: selectedChat.id,
        display_name: selectedChat.display_name,
        email: selectedChat.email,
        avatar_url: selectedChat.avatar_url,
        last_seen: selectedChat.last_seen,
      };
    }
  }

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa] text-[#111b21] dark:bg-[#111b21]">
      <ChatSidebar
        chats={chatList}
        user={user}
        selected={selected}
        onSelect={setSelected}
        onlineUserIds={onlineUserIds}
      />
      {chatObj && otherUser ? (
        <ChatWindow
          chat={chatObj}
          currentUser={user}
          otherUser={otherUser}
          onMessageSent={handleMessageSent}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-lg text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
}
