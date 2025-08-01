"use client";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex h-screen  bg-[#0C0C0C] ">
      <Sidebar />

      <div className=" flex flex-col flex-1 h-screen">
        <Topbar />
        <main className=" p-4 bg-[#0C0C0C] rounded-lg overflow-y-auto">
          {children}
        </main>
      </div>

      
    </div>
  );
}
