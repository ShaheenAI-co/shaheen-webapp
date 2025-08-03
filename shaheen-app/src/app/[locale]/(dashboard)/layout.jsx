"use client";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex h-screen bg-[#000000]  ">
      <Sidebar />

      <div className=" flex flex-col flex-1 h-screen">
        <Topbar />
      <GradientBars/>
        <main className=" bg-[#0a06126b] z-10 rounded-lg overflow-y-auto">

          {children}
        </main>
      </div>

      
    </div>
  );
}
