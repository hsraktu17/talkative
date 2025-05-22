// components/Sidebar.tsx
import { Users, Filter, Settings, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LogoutButton from "./Logout";

export default function Sidebar() {
  return (
    <aside className="w-16 bg-white dark:bg-[#222e35] border-r flex flex-col items-center py-2">
      <div className="mb-2 mt-2">
        <Avatar><AvatarFallback>P</AvatarFallback></Avatar>
      </div>
      <div className="flex flex-col gap-2 flex-1 mt-4">
        <Button variant="ghost" size="icon"><MessageCircle className="w-6 h-6" /></Button>
        <Button variant="ghost" size="icon"><Users className="w-6 h-6" /></Button>
        <Button variant="ghost" size="icon"><Filter className="w-6 h-6" /></Button>
        <LogoutButton/>
      </div>
      <div className="mb-2 mt-2">
        <Button variant="ghost" size="icon"><Settings className="w-6 h-6" /></Button>
        
      </div>
    </aside>
  );
}
