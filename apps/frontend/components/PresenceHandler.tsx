"use client";
import { useEffect } from "react";
import { connectWebSocket } from "@/utils/api";
import type { UserProfile } from "@/lib/types";

interface PresenceHandlerProps {
  currentUser: UserProfile;
}

const PresenceHandler: React.FC<PresenceHandlerProps> = ({ currentUser }) => {
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem("token") || "";
    const ws = connectWebSocket(token);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "presence", online: true }));
    };
    const interval = setInterval(() => {
      ws.send(JSON.stringify({ type: "presence", online: true }));
    }, 20000);
    const handleUnload = () => {
      ws.close();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      ws.close();
    };
  }, [currentUser]);

  return null;
};

export default PresenceHandler;
