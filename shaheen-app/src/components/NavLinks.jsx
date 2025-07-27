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
    <div className="hidden text-lg lg:flex flex-1 justify-center  items-center space-x-8">
      <Link href="#">
        <Button variant="link" className="text-white font-light cursor-pointer">
          {t("l-2")}
        </Button>
      </Link>

      <Link href="#">
        <Button variant="link" className="text-white font-light cursor-pointer">
          {t("l-3")}
        </Button>
      </Link>

      <Link href="#">
        <Button variant="link" className="text-white font-light cursor-pointer">
          {t("l-1")}
        </Button>
      </Link>
    </div>
  );
};

export default NavLinks;
