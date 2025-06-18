import {
  FiSettings,
} from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import Image from "next/image";
import logo from "@/public/download.png";
import LogoutButton from "./Logout";
import type { UserProfile } from "@/lib/types";
import { AiFillMessage, AiOutlineNotification } from "react-icons/ai";
import { IoMdHome } from "react-icons/io";
import { IoTicketSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { LuListChecks, LuNetwork } from "react-icons/lu";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";

const NAV_ICONS = [
  { icon: <IoMdHome size={22} />, label: "Home" },
  { icon: <AiFillMessage size={22} />, label: "Chats" },
  { icon: <IoTicketSharp  size={22} />, label: "Broadcast" },
  { icon: <BsGraphUp  size={22} />, label: "Stats" },
  { icon: <FaListUl  size={22} />, label: "List" },
  { icon: <AiOutlineNotification  size={22} />, label: "Notifications" },
  { icon: <LuNetwork  size={22} />, label: "Groups" },
  { icon: <RiContactsBookFill  size={22} />, label: "Docs" },
  { icon: <RiFolderImageFill  size={22} />, label: "Favorites" },
  { icon: <LuListChecks  size={22} />, label: "Favorites" },
  { icon: <FiSettings  size={22} />, label: "Favorites" },
];

type SidebarNavProps = {
  user: UserProfile;
};

export default function SidebarNav({ user }: SidebarNavProps) {
  const initial = (user.display_name || "?").charAt(0).toUpperCase();

  return (
    <nav className="w-16 bg-white border-r flex flex-col items-center h-full py-4">
      {/* Top: Logo */}
      <div>
        <Image
          src={logo}
          alt="Logo"
          width={36}
          height={36}
          className="mb-4 rounded-full"
        />
      </div>
      {/* Center: Icons */}
      <div className="flex-1 flex flex-col items-center gap-2 mt-4">
        {NAV_ICONS.map((item, i) => (
          <button
            key={i}
            className="p-2 rounded-md hover:bg-green-100 transition"
            title={item.label}
            tabIndex={0}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
      {/* Bottom: Profile/Settings/Logout */}
      <div className="flex flex-col items-center gap-3 mb-2">
        <button
          className="p-2 rounded-md hover:bg-green-100 transition"
          title="Settings"
        >
          <FiSettings size={22} />
        </button>
        {/* Actual user initial */}
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold">
          {initial}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
