"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import LanguageSwitch from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const NavCTA = () => {
  const t = useTranslations("NavCTA");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const { isSignedIn, isLoaded } = useUser();

  // Don't render anything while Clerk is loading
  if (!isLoaded) {
    return (
      <div
        className={`hidden lg:flex items-center justify-center
         space-x-4  `}
      >
        <LanguageSwitch />
        <div className="w-20 h-10 bg-gray-300 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`hidden lg:flex items-center justify-center
       space-x-4  `}
    >
      <LanguageSwitch />

      {isSignedIn ? (
        <Button
          variant="secondary"
          className=" cursor-pointer flex justify-center  capitalize"
          asChild
        >
          <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
        </Button>
      ) : (
        <Button
          variant="secondary"
          className=" cursor-pointer flex justify-center  capitalize"
          asChild
        >
          <Link href={`/${locale}/sign-in`}>{t("login")}</Link>
        </Button>
      )}

      {/* <Link href={`/${locale}/sign-up`} className="pr-2">
        <Button variant="secondary">{t("try")}</Button>
      </Link> */}
    </div>
  );
};

export default NavCTA;
