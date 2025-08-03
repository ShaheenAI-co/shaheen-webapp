"use client";

import {
  Menu,
  FolderClosed,
  Settings,
  Sparkle,
  Calendar,
  Brush,
  FileImage
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const items = [
  {
    name: "Project",
    href: "/dashboard/projects",
    icon: FileImage,
  },
  {
    name: "Brands",
    href: "/dashboard/brands",
    icon: FolderClosed,
  },
  {
    name: "Retouch",
    href: "/dashboard/retouch",
    icon: Brush,
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
];

export default function Sidebar() {
  const t = useTranslations("Logo");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className=" lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white  shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64  bg-[#0c0606] pt-4    transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-[#272729]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col py-4 px-6   ">
          {/* Logo */}
          <div className="flex flex-col gap-4 mb-6 border-b border-[#272729] pb-4">
            <Link href={`/dashboard`}>
              <header
                className={`  z-10 flex  items-center justify-start gap-2 px-2 ${
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
                  className={`text-white text-sm md:text-xl   satoshi-bold ${isArabic ? "hidden" : ""} `}
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
              <span className="bg-[#3c3c3c] h-[2px] w-full rounded-md"></span>
            </Link>
          </div>

          {/* Dashboard items */}

          <div className="flex flex-col gap-8">
            <Link
              href={`/dashboard/generate`}
              className="flex items-center gap-4 bg-[#7F4BF3]   rounded-md py-3 px-4 hover:transition-all duration-300  text-white"
            >
              <Sparkle className="h-4 w-4 text-white" />
              <span>Generate</span>
            </Link>
            <div className="flex flex-col gap-4  ">
              {items.map((item) => (
                <Link
                  href={item.href}
                  className="flex items-center gap-4  hover:bg-[#9261FA] rounded-md py-2 px-4 hover:transition-all duration-300  text-white"
                  key={item.name}
                >
                  <item.icon className="h-4 w-4 text-white" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}

          <div className=" justify-self-end mt-auto">
            <Link
              href={`/dashboard/setting`}
              className="flex items-center gap-4 font-bold hover:bg-[#272729] rounded-md py-2 px-4  text-white"
            >
              <Settings className="h-4 w-4 text-white" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
