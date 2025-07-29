"use client";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const NavLinks = () => {
  const t = useTranslations("NavLinks");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div className="hidden text-lg lg:flex flex-1 justify-center  items-center gap-18">
      <Link href="#">
        <button variant="link" className="text-white font-light cursor-pointer">
          {t("l-2")}
        </button>
      </Link>

      <Link href="#">
        <button variant="link" className="text-white font-light cursor-pointer">
          {t("l-3")}
        </button>
      </Link>

      <Link href="#">
        <button variant="link" className="text-white font-light cursor-pointer">
          {t("l-1")}
        </button>
      </Link>
    </div>
  );
};

export default NavLinks;
