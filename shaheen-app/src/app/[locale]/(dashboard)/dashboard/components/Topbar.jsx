import React from "react";
import { Search, Bell, User } from "lucide-react";
import NotificationBtn from "./NotificationBtn";
import SrcInput from "./SrcInput";
import ProfileBtn from "./ProfileBtn";
import { useClerk } from "@clerk/nextjs";

const Topbar = () => {
  const { signOut } = useClerk();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="flex justify-between z-10 items-center gap-4 py-6 px-12 bg-[#0f0f0f] ">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <SrcInput />

        <div className="flex items-center gap-4">
          <NotificationBtn />
          <ProfileBtn onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
