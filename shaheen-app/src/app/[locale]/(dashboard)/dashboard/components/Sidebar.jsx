"use client";

import {
  Menu,
  FolderClosed,
  Settings,
  Sparkle,
  Calendar,
  Brush,
  FileImage,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SidebarBtn from "./SidebarBtn";

const dashPages = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: "/icons/Home.svg",
  },
  {
    name: "posts",
    href: "/dashboard",
    icon: "/icons/Paper_File.svg",
  },
  {
    name: "brands",
    href: "/dashboard",
    icon: "/icons/Folder_File_Project.svg",
  },
];

const features = [
  {
    name: "AI advertisement",
    href: "/dashboard/generate/AI-Adv",
    icon: "/icons/Image_.svg",
  },
  {
    name: "video ad",
    href: "/dashboard",
    icon: "/icons/Video_Player.svg",
  },
  {
    name: "social media ads",
    href: "/dashboard",
    icon: "/icons/Social.svg",
  },
  {
    name: "retouch",
    href: "/dashboard/retouch",
    icon: "/icons/Brush.svg",
  },
];

export default function Sidebar() {
  const t = useTranslations("Logo");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";
  const [activePage, setActivePage] = useState("");

  const handleActivePage = (page) => {
    setActivePage(page);
  };

  return (
    <div className="w-[250px] h-screen bg-[#09090A] fixed  px-5 pt-5 pb-6 flex flex-col justify-between max-sm:left-[-100%] transition-all duration-300 ">
      {/* SIDEBAR */}
      <div>
        {/* LOGO */}
        <div>
          <div className="px-4 border-b border-white/5 pt-2 pb-3">
            <header
              className={`  z-10 flex  items-center  gap-2 ${
                isArabic ? "flex-row-reverse alexandria-font" : ""
              } `}
            >
              <Image
                src="/Logo/logo-light.png"
                alt="Logo"
                width={20}
                height={20}
                className="max-sm:w-[20px] max-sm:h-[30px]"
              />
              <h1
                className={`text-white text-sm md:text-xl  satoshi-bold   ${isArabic ? "hidden" : ""} `}
              >
                {t("name")}
              </h1>
              {isArabic && (
                <Image
                  src="/Logo/arabic-logo-Ar.png"
                  width={100}
                  height={100}
                  alt="Logo"
                  className="max-sm:w-[60px] max-sm:h-[30px]"
                />
              )}
            </header>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col mt-5 gap-2">
          {/* PAGE SELECTOR */}
          <div className=" pb-4 flex flex-col gap-2 border-b border-white/10">
            {dashPages.map((page) => (
              <SidebarBtn
                key={page.name}
                activePage={activePage}
                handleActivePage={handleActivePage}
                href={page.href}
                icon={page.icon}
                name={page.name}
                onClick={() => handleActivePage(page.name)}
              />
            ))}
          </div>

          {/* FEATURES */}
          <div className=" pb-4 flex flex-col gap-2 border-b border-white/10 ">
            {features.map((page) => (
              <SidebarBtn
                key={page.name}
                activePage={activePage}
                handleActivePage={handleActivePage}
                href={page.href}
                icon={page.icon}
                name={page.name}
                onClick={() => handleActivePage(page.name)}
              />
            ))}
          </div>
        </div>

        {/* SCHEDULE POST */}
        <div className=" pt-4 flex flex-col gap-2">
          <SidebarBtn
            activePage={activePage}
            handleActivePage={handleActivePage}
            href="/dashboard/schedule"
            icon="/icons/Calendar.svg"
            name="Schedule_Post"
            onClick={() => handleActivePage("Schedule_Post")}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div>
        <SidebarBtn
          activePage={activePage}
          handleActivePage={handleActivePage}
          href="/dashboard/settings"
          icon="/icons/Settings_icon.svg"
          name="settings"
        />
      </div>
    </div>
  );
}
