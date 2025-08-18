"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to get page info based on pathname
  const getPageInfo = () => {
    const path = pathname.split("/").pop() || "dashboard";

    const pageConfig = {
      dashboard: { icon: "/icons/Home.svg", title: "dashboard" },
      posts: { icon: "/icons/Paper_File.svg", title: "Posts" },
      schedule: { icon: "/icons/Calendar.svg", title: "Schedule Posts" },
      retouch: { icon: "/icons/Brush.svg", title: "Retouch" },
      settings: { icon: "/icons/Settings_icon.svg", title: "settings" },
      "AI-Adv": { icon: "/icons/Image_.svg", title: "AI Advertisement" },
      "Final-Image": { icon: "/icons/Image_.svg", title: "Final Image" },
      generated_images: {
        icon: "/icons/Image_.svg",
        title: "AI Advertisement",
      },
    };

    // Check for nested paths
    if (pathname.includes("/generate/AI-Adv")) {
      return pageConfig["AI-Adv"];
    }
    if (pathname.includes("/generate/Final-Image")) {
      return pageConfig["Final-Image"];
    }
    if (pathname.includes("/generate/AI-Adv/generated_images")) {
      return pageConfig["generated_images"];
    }

    return pageConfig[path] || pageConfig["dashboard"];
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex bg-[#141414] overflow-scroll">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 bg-[#0f0f0f] lg:ml-[250px] ml-0">
        <Topbar
          icon={pageInfo.icon}
          title={pageInfo.title}
          onMenuClick={toggleSidebar}
        />
        {children}
      </main>
    </div>
  );
}
