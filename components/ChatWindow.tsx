"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSmile, FiMic, FiSend, FiSearch, FiMoreVertical } from "react-icons/fi";
import { format } from "date-fns";
import type { Chat, Message, UserProfile } from "@/lib/types";
import { supabaseBrowser } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Avatar } from "./Avatar";

interface ChatWindowProps {
  chat: Chat;
  currentUser: UserProfile;
  otherUser: UserProfile;
  onMessageSent?: (msg: Message) => void; // <-- Add this!
}

export default function ChatWindow({ chat, currentUser, otherUser, onMessageSent }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat messages on mount or chat change
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
      setLoading(false);
    }
    fetchMessages();
  }, [chat.id]);

  // Realtime subscription for new messages
  useEffect(() => {
    const supabase = supabaseBrowser();
    const channel = supabase
      .channel(`messages:chat-${chat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat.id]);

  // Presence for typing/online indicator
  useEffect(() => {
    const supabase = supabaseBrowser();
    const channel = supabase.channel(`presence:chat-${chat.id}`, {
      config: { presence: { key: currentUser.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      type PresenceInfo = { typing: boolean };
      const typers = Object.entries(state)
        .filter(([id, info]) => {
          if (id === currentUser.id) return false;
          if (!Array.isArray(info) || !info[0]) return false;
          const presence = info[0] as unknown as PresenceInfo;
          return presence.typing;
        })
        .map(([id]) => id as string);
      setTypingUsers(typers);
      setOnlineUserIds(Object.keys(state));
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ typing: false });
      }
    });

    presenceChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat.id, currentUser.id]);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Broadcast typing state
  const broadcastTyping = useCallback((typing: boolean) => {
    const channel = presenceChannelRef.current;
    if (channel) channel.track({ typing });
  }, []);

  // Handle input change and typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    broadcastTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      broadcastTyping(false);
    }, 1500);
  };

  // Send message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chat.id,
          sender_id: currentUser.id,
          content: input.trim(),
        },
      ])
      .select("*")
      .single();
    if (!error && data) {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data as Message];
      });
      setInput("");
      broadcastTyping(false);

      // NOTIFY SIDEBAR TO REORDER!
      if (onMessageSent) onMessageSent(data as Message);
    }
  }

  const peerIsOnline = onlineUserIds.includes(otherUser.id);
  const peerIsTyping = typingUsers.includes(otherUser.id);

  return (
    <div className="flex flex-col h-full w-full bg-[#f0f2f5] relative">
      {/* Header */}
      <div className="flex items-center px-6 py-3 border-b bg-white h-20 shadow-sm">
        <Avatar
          name={otherUser.display_name}
          avatarUrl={otherUser.avatar_url}
          size={40}
          className="mr-4"
        />
        <div className="flex flex-col flex-1">
          <div className="font-semibold">{otherUser.display_name}</div>
          <div className="text-xs text-gray-500">
            {peerIsTyping ? (
              <span className="text-green-500">Typing…</span>
            ) : peerIsOnline ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button><FiSearch size={20} /></button>
          <button><FiPaperclip size={20} /></button>
          <button><FiMoreVertical size={20} /></button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-[url('/whatsapp-bg.png')] bg-repeat">
        {loading ? (
          <div>Loading messages…</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-lg shadow 
                ${msg.sender_id === currentUser.id
                  ? "bg-green-100 text-right"
                  : "bg-white"}`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-[10px] text-gray-400 flex justify-end mt-1">
                  {msg.created_at
                    ? format(new Date(msg.created_at), "HH:mm")
                    : ""}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {peerIsTyping && (
        <div className="absolute bottom-20 left-32 text-xs text-green-500 px-4 pb-2">
          Typing…
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={sendMessage}
        className="flex items-center px-6 py-4 bg-white border-t space-x-2"
        style={{ minHeight: "64px" }}
      >
        <button type="button"><FiPaperclip size={22} className="text-gray-500" /></button>
        <button type="button"><FiSmile size={22} className="text-gray-500" /></button>
        <input
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 outline-none"
          placeholder="Message…"
          value={input}
          onChange={handleInputChange}
        />
        <button type="button"><FiMic size={22} className="text-gray-500" /></button>
        <button
          type="submit"
          className="ml-2 bg-green-500 hover:bg-green-600 rounded-full p-2 text-white"
          disabled={!input.trim()}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}
