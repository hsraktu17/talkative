"use client"
import Sidebar from "@/components/Sidebar";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function ChatsPage() {

  const supabase = supabaseBrowser()
  
  

  useEffect(()=>{
    const fetchUser = async () =>{
      const user = await supabase.auth.getUserIdentities()
      console.log("supabase return", user)
      // console.log(
      //   "user",
      //   user.data.user?.identities?.[0]?.identity_data?.name
      // )
    }
    fetchUser()
  },[])
  return (
    <div className="flex h-screen w-screen bg-[#f7f8fa] text-[#111b21] dark:bg-[#111b21]">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </div>
  );
}
