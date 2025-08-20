"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const FreeTierBanner = () => {
  const t = useTranslations("FreeTierBanner");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  // Get translations or use defaults
  const message =
    t("message") ||
    (isArabic
      ? "أنت حالياً في النسخة التجريبية المجانية"
      : "You are currently in the free trial");

  return (
    <div className="bg-gradient-to-r from-[#7F4BF3] to-[#826CFF] text-white px-4 py-2">
      <div className="flex items-center justify-center">
        <p
          className={`text-sm font-medium text-center ${isArabic ? "alexandria-font" : ""}`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default FreeTierBanner;
