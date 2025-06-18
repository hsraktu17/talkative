"use client";
import { useEffect, useState } from "react";
import { createChat, getChats } from "@/utils/api";
import type { Chat, UserProfile } from "@/lib/types";

interface DMChatLoaderProps {
  currentUser: UserProfile;        // Logged-in user
  peerId: string | null;           // The user you want to chat with (from sidebar)
  children: (props: {
    chat: Chat | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export default function DMChatLoader({ currentUser, peerId, children }: DMChatLoaderProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!peerId) {
      setChat(null);
      setError(null);
      return;
    }

    async function fetchOrCreateDMChat() {
      setLoading(true);
      setError(null);

      try {
        const chats = await getChats() as Chat[];
        let existingChat = chats.find(c =>
          (c.user1_id === currentUser.id && c.user2_id === peerId) ||
          (c.user1_id === peerId && c.user2_id === currentUser.id)
        );
        if (existingChat) {
          setChat(existingChat);
        } else {
          const newChat = await createChat(peerId!);
          setChat(newChat as Chat);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message ?? "Error creating/fetching chat");
        } else {
          setError("Error creating/fetching chat");
        }
        setChat(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrCreateDMChat();
  }, [currentUser.id, peerId]);

  return <>{children({ chat, loading, error })}</>;
}
