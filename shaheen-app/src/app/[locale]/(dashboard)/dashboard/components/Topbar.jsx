"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";
import NotificationBtn from "./NotificationBtn";
import SrcInput from "./SrcInput";
import ProfileBtn from "./ProfileBtn";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";

const Topbar = ({ icon, title }) => {
  const { signOut } = useClerk();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="flex justify-between z-10 items-center gap-4 pb-6  bg-[#0f0f0f]  ">
      <div className="flex items-center gap-2">
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
