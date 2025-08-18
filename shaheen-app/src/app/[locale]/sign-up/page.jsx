"use client";
import React from "react";
import Link from "next/link";
import SignupForm from "./Components/SignupForm";
import LeftPanel from "../../../components/LeftPanel";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const page = () => {
  const t = useTranslations("SignupBanner");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div
      className="min-h-screen bg-black md:p-4 p-2 flex flex-col lg:flex-row"
      dir={isArabic ? "ltr" : "rtl"}
    >
      <LeftPanel phrase={t("Text")} />
      <SignupForm />
    </div>
  );
};

export default page;
