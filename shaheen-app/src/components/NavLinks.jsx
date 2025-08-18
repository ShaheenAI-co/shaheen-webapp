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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="hidden text-lg lg:flex flex-1 justify-center  items-center gap-18">
      <button
        onClick={() => scrollToSection("features-section")}
        className="text-white font-light cursor-pointer bg-transparent border-none"
      >
        {t("l-2")}
      </button>

      <Link href="#">
        <button variant="link" className="text-white font-light cursor-pointer">
          {t("l-3")}
        </button>
      </Link>

      <button
        onClick={() => scrollToSection("pricing-section")}
        className="text-white font-light cursor-pointer bg-transparent border-none"
      >
        {t("l-1")}
      </button>
    </div>
  );
};

export default NavLinks;
