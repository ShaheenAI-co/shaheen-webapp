"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Footer = () => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("Footer");

  return (
    <footer className="w-full bg-[#4F21A1] text-white py-4 md:py-8 px-4 flex flex-col items-center justify-center">
      <div className="flex md:flex-row flex-col gap-4 justify-between items-center w-full px-8 max-sm:flex-col-reverse flex-wrap">
        <div className="text-sm flex items-center gap-2 mb-2 md:mb-0 ">
          <p>{t("copyright")}</p>
        </div>
        <div className="flex gap-6 capitalize max-sm:justify-center text-sm flex-wrap">
          <p>{t("termsOfService")}</p>
          <Link
            href={`/${locale}/privacy-policy`}
            className="hover:text-purple-200 transition-colors"
          >
            {t("privacyPolicy")}
          </Link>
          <p>{t("cookiePolicy")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
