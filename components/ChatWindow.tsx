"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chat, Message, UserProfile } from "@/lib/types";
import { supabaseBrowser } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface ChatWindowProps {
  chat: Chat;
  currentUser: UserProfile;
  otherUser: UserProfile; // required for typing/online!
}

export default function ChatWindow({ chat, currentUser, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat messages on mount or when chat changes
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

  // Supabase Presence for typing/online indicator
  useEffect(() => {
    const supabase = supabaseBrowser();

    const channel = supabase.channel(`presence:chat-${chat.id}`, {
      config: { presence: { key: currentUser.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      // Debugging output for presence state:
      // console.log("Presence State", state);

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
        // Track yourself as "online" (not typing initially)
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
    }, 1800);
  };

  // Send message, update last_seen, and reset typing state
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

      // Update last_seen for current user (UTC ISO)
      await supabase
        .from("profiles")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", currentUser.id);
    }
  }

  // Helper: is the peer online? (otherUser.id is the peer)
  const peerIsOnline = onlineUserIds.includes(otherUser.id);

  // Helper: show typing indicator if peer is typing
  const peerIsTyping = typingUsers.includes(otherUser.id);

  // Format peer last seen (with date-fns, UTC safe)
  let peerLastSeen = "";
  if (otherUser.last_seen) {
    // Debugging for troubleshooting
    // console.log("last_seen raw:", otherUser.last_seen, "Date parsed:", new Date(otherUser.last_seen));
    try {
      const dateObj = new Date(otherUser.last_seen);
      peerLastSeen = formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      peerLastSeen = "unknown";
    }
  }

  return (
    <section className="flex flex-col h-full w-full bg-white dark:bg-[#0a2f24]">
      <header className="p-4 font-bold border-b flex items-center space-x-3">
        <span>{otherUser.display_name}</span>
        {peerIsOnline ? (
          <span className="text-green-500 text-xs">● Online</span>
        ) : (
          <span className="text-gray-400 text-xs">
            ● Last seen {peerLastSeen}
          </span>
        )}
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading ? (
          <div>Loading messages…</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-2 flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-xs ${
                  msg.sender_id === currentUser.id
                    ? "bg-green-100 text-right"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
                <div className="text-[10px] text-gray-400">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Typing indicator */}
      {peerIsTyping && (
        <div className="text-xs text-gray-400 px-4 pb-2">Typing…</div>
      )}
      <form
        onSubmit={sendMessage}
        className="flex p-2 border-t bg-gray-50 dark:bg-[#222e35]"
      >
        <input
          className="flex-1 rounded-l px-2 py-1 outline-none"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message…"
        />
        <button
          type="submit"
          className="bg-[#0a2f24] text-white px-4 py-1 rounded-r"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </section>
  );
}
