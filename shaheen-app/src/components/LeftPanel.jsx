"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
const LeftPanel = ({ phrase }) => {
  const t = useTranslations("Signup");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div className="flex-1 relative  rounded-2xl">
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-6  bg-gradient-radial-to-bottom rounded-2xl md:rounded-4xl">
        <div
          className="flex  justify-center items-center gap-2"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Image
            src="/Logo/logo-light.png"
            alt="Logo"
            width={30}
            height={30}
            className="max-sm:w-[20px] max-sm:h-[30px]"
          />
          <h2
            className={`text-2xl satoshi-bold ${isArabic ? "hidden" : "block"} `}
          >
            Shaheen AI
          </h2>
          {isArabic && (
            <Image
              src="/Logo/arabic-logo-Ar.png"
              width={150}
              height={150}
              alt="Logo"
              className="max-sm:w-[60px] max-sm:h-[30px]"
            />
          )}
        </div>
        <h1 className=" hidden md:block text-4xl font-bold capitalize">
          {phrase}
        </h1>
      </div>
    </div>
  );
};

export default LeftPanel;
