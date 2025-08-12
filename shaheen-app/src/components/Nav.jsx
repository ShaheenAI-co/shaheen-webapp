"use client";
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import NavLinks from "./NavLinks.jsx";
import NavCTA from "./NavCTA";
import { usePathname } from "next/navigation";
import NavMobile from "./NavMobile";
import LanguageSwitch from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";

export const Nav = () => {
  const t = useTranslations("NavCTA");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav
      className={`flex items-center w-full justify-between py-2    `}
    >
      <Logo />
      <NavLinks />
      <NavCTA />
      {/* <NavMobile /> */}

      <div className="flex lg:hidden gap-4">
        <LanguageSwitch />

        {isLoaded && (
          isSignedIn ? (
            <Link href={`/${locale}/dashboard`} className="pr-2">
              <Button variant="secondary" className=" cursor-pointer  capitalize">
                {t("dashboard")}
              </Button>
            </Link>
          ) : (
            <Link href={`/${locale}/sign-in`} className="pr-2">
              <Button variant="secondary" className=" cursor-pointer  capitalize">
                {t("login")}
              </Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
};
