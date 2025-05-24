"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
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
        const supabase = supabaseBrowser();

        // Try to fetch existing chat
        const { data: existingChat, error } = await supabase
          .from("chats")
          .select("*")
          .or(
            `and(user1_id.eq.${currentUser.id},user2_id.eq.${peerId}),and(user1_id.eq.${peerId},user2_id.eq.${currentUser.id})`
          )
          .maybeSingle();

        if (error) throw error;

        if (existingChat) {
          setChat(existingChat as Chat);
        } else {
          // Create new chat
          const { data: newChat, error: createError } = await supabase
            .from("chats")
            .insert([
              { user1_id: currentUser.id, user2_id: peerId },
            ])
            .select("*")
            .single();

          if (createError) throw createError;
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

  // Render children with chat, loading, and error props
  return <>{children({ chat, loading, error })}</>;
}
