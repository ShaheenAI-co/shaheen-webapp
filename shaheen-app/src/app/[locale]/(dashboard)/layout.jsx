"use client";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative    bg-[#000000]  ">
      <Sidebar />

      <div className=" flex flex-col flex-1  ml-0 lg:ml-64">
        <Topbar />
      <GradientBars/>
        <main className=" flex-1 bg-[#0a06126b] z-10 rounded-lg ">

          {children}
        </main>
      </div>

      
    </div>
  );
}
