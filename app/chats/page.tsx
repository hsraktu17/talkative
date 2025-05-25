"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import PresenceHandler from "@/components/PresenceHandler";
import { supabaseBrowser } from "@/utils/supabase/client";
import type { UserProfile, ChatListItem, Message, Chat } from "@/lib/types";
import { useRouter } from "next/navigation";
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

  // Load chats, user, and unread counts
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

      const { data: chatsData } = await supabase
        .from("chats")
        .select("*")
        .or(`user1_id.eq.${authUser.id},user2_id.eq.${authUser.id}`)
        .order("updated_at", { ascending: false });
      setChats(chatsData || []);

      const chatList: ChatListItem[] = [];
      for (const chat of chatsData || []) {
        const otherUserId = chat.user1_id === authUser.id ? chat.user2_id : chat.user1_id;
        const { data: otherProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", otherUserId)
          .single();
        // Fetch last message preview
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        // Count unread messages (not read, sent by other)
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("chat_id", chat.id)
          .eq("read", false)
          .neq("sender_id", authUser.id);

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
            last_message_preview: lastMsg?.content || "",
            unread_count: unreadCount ?? 0,
          });
        }
      }
      // Sort by latest
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
  }, [supabase, router]);

  // Real-time update for messages: increment unread_count for chat if not current user
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
          setChatList(prev =>
            prev.map(chat =>
              chat.chat_id === msg.chat_id
                ? {
                    ...chat,
                    last_message_time: msg.created_at,
                    last_message_preview: msg.content,
                    unread_count:
                      // Only increment if message is from other user and unread
                      msg.sender_id !== user?.id && !msg.read
                        ? (chat.unread_count || 0) + 1
                        : chat.unread_count,
                  }
                : chat
            )
              // sort by latest
              .sort((a, b) => {
                const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
                const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
                return bTime - aTime;
              })
          );
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user?.id]);

  // When user selects a chat, mark all unread as read
  useEffect(() => {
    if (!selected || !user) return;
    async function markRead() {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("chat_id", chatList.find(c => c.id === selected)?.chat_id)
        .neq("sender_id", user?.id)
        .eq("read", false);
      setChatList(prev =>
        prev.map(chat =>
          chat.id === selected
            ? { ...chat, unread_count: 0 }
            : chat
        )
      );
    }
    markRead();
  }, [selected, user, chatList, supabase]);

  // Called after sending message, to reorder sidebar instantly
  const handleMessageSent = useCallback((msg: Message) => {
    setChatList(prev => {
      const updated = prev.map(c => {
        if (c.chat_id === msg.chat_id) {
          return { ...c, last_message_time: msg.created_at, last_message_preview: msg.content };
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

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen bg-[#f7f8fa] flex flex-col">
      <div className="flex flex-1 min-h-0">
        <ChatSidebar
          chats={chatList}
          user={user}
          selected={selected}
          onSelect={setSelected}
          onlineUserIds={onlineUserIds}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <PresenceHandler currentUser={user} />
          {selected ? (
            <ChatWindow
              chat={
                chats.find(
                  c =>
                    (c.user1_id === user.id && c.user2_id === selected) ||
                    (c.user2_id === user.id && c.user1_id === selected)
                )!
              }
              currentUser={user}
              onMessageSent={handleMessageSent}
              otherUser={
                chatList.find(c => c.id === selected) || {
                  id: "",
                  display_name: "",
                  email: "",
                  avatar_url: undefined,
                  last_seen: undefined,
                  chat_id: "",
                  updated_at: "",
                  last_message_time: "",
                  unread_count: 0,
                  last_message_preview: "",
                }
              }
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
