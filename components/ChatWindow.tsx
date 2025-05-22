// components/ChatWindow.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Paperclip, Smile, Send, MoreVertical, Phone } from "lucide-react";

const messages = [
  { id: 1, text: "CVFER", time: "11:51", from: "self" },
  { id: 2, text: "CDERT", time: "11:54", from: "self" },
  { id: 3, text: "Hello, South Euna!", time: "08:01", from: "Roshnaq Airtel" },
  { id: 4, text: "Hello, Livonia!", time: "08:01", from: "Roshnaq Airtel" },
  { id: 5, text: "CDERT", time: "09:49", from: "Roshnaq Airtel" },
  { id: 6, text: "hello", time: "12:07", from: "Periskope" },
];

export default function ChatWindow() {
  return (
    <div className="flex flex-1 flex-col bg-[url('/whatsapp-bg-light.png')] dark:bg-[url('/whatsapp-bg-dark.png')] bg-cover">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#222e35] border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10"><AvatarFallback>T</AvatarFallback></Avatar>
          <div>
            <div className="font-semibold text-lg">Test El Centro</div>
            <div className="text-xs text-gray-500">
              Roshnaq Airtel, Roshnaq Jio, Bharat Kumar Ramesh, Periskope
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost"><Phone className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost"><MoreVertical className="h-5 w-5" /></Button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {/* Date Dividers */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 bg-[#e1e9ef] text-xs rounded-full text-gray-500">22-01-2025</span>
        </div>
        {/* Message Bubbles */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "self" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-xl shadow ${msg.from === "self" ? "bg-green-100" : "bg-white"}`}>
              <div className="text-sm">{msg.text}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 bg-[#e1e9ef] text-xs rounded-full text-gray-500">23-01-2025</span>
        </div>
      </div>
      {/* Input Bar */}
      <div className="flex items-end gap-2 px-6 py-4 bg-[#f0f2f5] border-t">
        <Button size="icon" variant="ghost"><Smile /></Button>
        <Button size="icon" variant="ghost"><Paperclip /></Button>
        <input
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none"
          placeholder="Message..."
        />
        <Button size="icon" className="bg-green-600 text-white rounded-full"><Send /></Button>
      </div>
      {/* Tabs below input bar */}
      <div className="flex gap-1 px-6 py-2 bg-white border-t">
        <Button size="sm" variant="outline" className="rounded-full px-3 text-xs">WhatsApp</Button>
        <Button size="sm" variant="ghost" className="rounded-full px-3 text-xs">Private Note</Button>
      </div>
    </div>
  );
}
