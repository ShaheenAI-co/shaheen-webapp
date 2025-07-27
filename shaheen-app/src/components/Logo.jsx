"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
const Logo = () => {
  const t = useTranslations("Logo");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <header
      className={`  z-10 flex  items-center justify-center gap-2 ${
        isArabic ? "flex-row-reverse alexandria-font" : ""
      } `}
    >
      <Image src="/Logo/logo-light.png" alt="Logo" width={25} height={25} />
      <h1
        className={`text-white md:text-xl  text-base satoshi-bold ${isArabic ? "hidden" : ""} `}
      >
        {t("name")}
      </h1>
      {isArabic && (
        <Image src="/Logo/arabic-logo-Ar.png" width={100} height={100} alt="Logo" />
      )}
    </header>
  );
};

export default Logo;
