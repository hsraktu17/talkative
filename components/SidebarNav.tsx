"use client";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";
import LogoutButton from "./Logout";
import Image from "next/image";
import logo from "@/public/download.png"


export default function SidebarNav() {
  return (
    <nav className="flex flex-col items-center bg-[#F7F8FA] h-full w-14 py-2 border-r">
      <div className="mb-6 mt-2"><div className="w-8 h-8 rounded-full"><Image src={logo} alt="logo"/></div></div>
      <div className="flex flex-col space-y-5 flex-1">
        <button className="p-2 hover:bg-gray-200 rounded"><FiHome size={20} /></button>
        <button className="p-2 hover:bg-gray-200 rounded"><FiUsers size={20} /></button>
      </div>
      <LogoutButton/>
      <button className="p-2 mb-2 hover:bg-gray-200 rounded"><FiSettings size={20} /></button>
    </nav>
  );
}
