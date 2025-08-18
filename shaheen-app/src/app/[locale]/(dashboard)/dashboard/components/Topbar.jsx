"use client";
import React from "react";
import { Search, Bell, User, Menu } from "lucide-react";
import NotificationBtn from "./NotificationBtn";
import SrcInput from "./SrcInput";
import ProfileBtn from "./ProfileBtn";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";

const Topbar = ({ icon, title, onMenuClick }) => {
  const { signOut } = useClerk();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="flex justify-between z-10 items-center gap-4 pb-6 px-6 pt-4  bg-[#0f0f0f]  ">
      <div className="flex items-center gap-2">
        {/* Menu button for small screens */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Image src={icon} alt="Logo" width={20} height={20} />
        <h1 className="text-xl font-bold satoshi-bold text-white/35 capitalize">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBtn />
        <ProfileBtn onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Topbar;
