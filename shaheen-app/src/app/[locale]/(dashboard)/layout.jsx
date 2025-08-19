"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import { GradientBars } from "@/components/ui/gradient-bars";
import { useTranslations } from "next-intl";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";
  const t = useTranslations("Sidebar");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to get page info based on pathname
  const getPageInfo = () => {
    const path = pathname.split("/").pop() || "dashboard";

    const pageConfig = {
      dashboard: { icon: "/icons/Home.svg", title: t("dashboard") },
      posts: { icon: "/icons/Paper_File.svg", title: t("posts") },
      schedule: { icon: "/icons/Calendar.svg", title: t("schedulePost") },
      retouch: { icon: "/icons/Brush.svg", title: t("retouch") },
      settings: { icon: "/icons/Settings_icon.svg", title: t("settings") },
      "AI-Adv": { icon: "/icons/Image_.svg", title: t("aiAdvertisement") },
      "Final-Image": { icon: "/icons/Image_.svg", title: t("aiAdvertisement") },
      generated_images: {
        icon: "/icons/Image_.svg",
        title: t("aiAdvertisement"),
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
    <div
      className={`flex bg-[#141414] overflow-scroll ${isArabic ? "flex-row-reverse" : "flex-row"}`}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main
        className={`flex-1 bg-[#0f0f0f] ${isArabic ? "lg:mr-[250px] mr-0" : "lg:ml-[250px] ml-0"}`}
      >
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
