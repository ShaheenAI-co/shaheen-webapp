"use client";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex     bg-[#141414]  ">
      <Sidebar />

      {/* <Topbar />
      <GradientBars/> */}
      <main className=" flex-1 bg-[#0f0f0f] z-10 rounded-lg ">{children}</main>
    </div>
  );
}
