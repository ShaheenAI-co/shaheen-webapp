"use client";

import {
  Menu,
  FolderClosed,
  Settings,
  Sparkle,
  Calendar,
  Brush,
  FileImage,
  X,
  Lock,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SidebarBtn from "./SidebarBtn";

export default function Sidebar({ isOpen, onClose }) {
  const t = useTranslations("Logo");
  const sidebarT = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";
  const [activePage, setActivePage] = useState("");

  const handleActivePage = (page) => {
    setActivePage(page);
  };

  const dashPages = [
    {
      name: sidebarT("dashboard"),
      href: `/${locale}/dashboard`,
      icon: "/icons/Home.svg",
    },
    {
      name: sidebarT("posts"),
      href: `/${locale}/dashboard/posts`,
      icon: "/icons/Paper_File.svg",
    },
    {
      name: sidebarT("brands"),
      href: `/${locale}/dashboard`,
      icon: "/icons/Folder_File_Project.svg",
      comingSoon: true,
    },
  ];

  const features = [
    {
      name: sidebarT("aiAdvertisement"),
      href: `/${locale}/dashboard/generate/AI-Adv`,
      icon: "/icons/Image_.svg",
    },
    {
      name: sidebarT("videoAd"),
      href: `/${locale}/dashboard`,
      icon: "/icons/Video_Player.svg",
      comingSoon: true,
    },
    {
      name: sidebarT("retouch"),
      href: `/${locale}/dashboard/retouch`,
      icon: "/icons/Brush.svg",
      comingSoon: true,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`w-[250px] h-screen bg-[#09090A] fixed px-5 pt-5 pb-6 flex flex-col justify-between transition-all duration-300 z-50 ${
          isOpen
            ? isArabic
              ? "right-0"
              : "left-0"
            : isArabic
              ? "right-[-100%] lg:right-0"
              : "left-[-100%] lg:left-0"
        }`}
      >
        {/* SIDEBAR */}
        <div>
          {/* LOGO */}
          <div>
            <div className="px-4 border-b border-white/5 pt-2 pb-3">
              <header
                className={`z-10 flex  gap-2 ${
                  isArabic ? "flex-row-reverse justify-end " : "justify-start"
                }`}
              >
                <Image
                  src="/Logo/logo-light.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="max-sm:w-[20px] max-sm:h-[30px]"
                />
                <h1
                  className={`text-white text-sm md:text-xl satoshi-bold ${
                    isArabic ? "hidden" : ""
                  }`}
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

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className={`lg:hidden absolute top-4 p-2 text-white hover:bg-white/10 rounded-md transition-colors ${
              isArabic ? "left-4" : "right-4"
            }`}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {/* NAVIGATION */}
          <div className="flex flex-col mt-5 gap-2">
            {/* PAGE SELECTOR */}
            <div className="pb-4 flex flex-col gap-2 border-b border-white/10">
              {dashPages.map((page) => (
                <SidebarBtn
                  key={page.name}
                  activePage={activePage}
                  handleActivePage={handleActivePage}
                  href={page.href}
                  icon={page.icon}
                  name={page.name}
                  onClick={() => handleActivePage(page.name)}
                  onClose={onClose}
                  comingSoon={page.comingSoon}
                  isArabic={isArabic}
                />
              ))}
            </div>

            {/* FEATURES */}
            <div className="pb-4 flex flex-col gap-2 border-b border-white/10">
              {features.map((page) => (
                <SidebarBtn
                  key={page.name}
                  activePage={activePage}
                  handleActivePage={handleActivePage}
                  href={page.href}
                  icon={page.icon}
                  name={page.name}
                  onClick={() => handleActivePage(page.name)}
                  onClose={onClose}
                  comingSoon={page.comingSoon}
                  isArabic={isArabic}
                />
              ))}
            </div>
          </div>

          {/* SCHEDULE POST */}
          <div className="pt-4 flex flex-col gap-2">
            <SidebarBtn
              activePage={activePage}
              handleActivePage={handleActivePage}
              href={`/${locale}/dashboard/schedule`}
              icon="/icons/Calendar.svg"
              name={sidebarT("schedulePost")}
              onClick={() => handleActivePage(sidebarT("schedulePost"))}
              onClose={onClose}
              isArabic={isArabic}
              comingSoon={true}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div>
          <SidebarBtn
            activePage={activePage}
            handleActivePage={handleActivePage}
            href={`/${locale}/dashboard/settings`}
            icon="/icons/Settings_icon.svg"
            name={sidebarT("settings")}
            onClose={onClose}
            isArabic={isArabic}
          />
        </div>
      </div>
    </>
  );
}
