"use client";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#141414] overflow-scroll">
      <Sidebar />
      <main className=" flex-1 bg-[#0f0f0f] ml-[250px] max-sm:ml-0 ">
        {children}
      </main>
    </div>
  );
}
