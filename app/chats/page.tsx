// app/chats/page.tsx
import Sidebar from "@/components/Sidebar";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";

export default function ChatsPage() {
  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa] text-[#111b21] dark:bg-[#111b21]">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </div>
  );
}
