"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSmile, FiMic, FiSend, FiSearch, FiMoreVertical } from "react-icons/fi";
import { format } from "date-fns";
import type { Chat, Message, UserProfile, ChatListItem } from "@/lib/types";
import { getMessages, sendMessage as sendMsgApi, connectWebSocket } from "@/utils/api";
import { Avatar } from "./Avatar";

interface ChatWindowProps {
  chat: Chat;
  currentUser: UserProfile;
  otherUser: ChatListItem;
  onMessageSent: (msg: Message) => void;
}

export default function ChatWindow({
  chat,
  currentUser,
  otherUser,
  onMessageSent,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers] = useState<string[]>([]);
  const [onlineUserIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const data = await getMessages(chat.id);
      setMessages(data as Message[] ?? []);
      setLoading(false);
    }
    fetchMessages();
  }, [chat.id]);

  
  useEffect(() => {
    const ws = wsRef.current;
    return () => {
      if (ws) ws.close();
    };
  }, [chat.id]);

  
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const ws = connectWebSocket(token);
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "message" && msg.message.chat_id === chat.id) {
          setMessages((prev) => [...prev, msg.message as Message]);
        }
      } catch {}
    };
    return () => {
      ws.close();
    };
  }, [chat.id]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const data = await sendMsgApi(chat.id, input.trim());
    setMessages((prev) => [...prev, data as Message]);
    setInput("");
    onMessageSent(data as Message);
  }

  const peerIsOnline = false;
  const peerIsTyping = false;

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

      {/* Messages */}
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

      {/* Typing indicator (if needed for UI) */}
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
