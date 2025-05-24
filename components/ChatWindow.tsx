"use client";
import { useEffect, useRef, useState } from "react";
import type { Chat, Message, UserProfile } from "@/lib/types";
import { supabaseBrowser } from "@/utils/supabase/client";

interface ChatWindowProps {
  chat: Chat;
  currentUser: UserProfile;
}

export default function ChatWindow({ chat, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this chat
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

  // Auto-scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      console.log("data", data)
    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setInput("");
    }
  }

  return (
    <section className="flex flex-col h-full w-full bg-white dark:bg-[#0a2f24]">
      <header className="p-4 font-bold border-b">CHat</header>
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
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex p-2 border-t bg-gray-50 dark:bg-[#222e35]"
      >
        <input
          className="flex-1 rounded-l px-2 py-1 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
