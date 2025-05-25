"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import type { UserProfile } from "@/lib/types";

interface PresenceHandlerProps {
  currentUser: UserProfile;
}

const PresenceHandler: React.FC<PresenceHandlerProps> = ({ currentUser }) => {
  useEffect(() => {
    if (!currentUser) return;
    const supabase = supabaseBrowser();

    const channel = supabase.channel("presence-global", {
      config: { presence: { key: currentUser.id } }
    });

    channel.subscribe();
    channel.track({ online: true });

    const interval = setInterval(async () => {
      await supabase.from("profiles")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", currentUser.id);
      channel.track({ online: true });
    }, 20000);

    const handleUnload = () => {
      channel.untrack();
    };
    window.addEventListener("beforeunload", handleUnload);

    console.log("date/time")

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return null;
};

export default PresenceHandler;
