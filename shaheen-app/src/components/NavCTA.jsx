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

const NavCTA = () => {
  const t = useTranslations("NavCTA");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div
      className={`hidden lg:flex items-center justify-center
       space-x-4  `}
    >
      <LanguageSwitch />

      <Link  href={`/${locale}/sign-in`} className="pr-2">
        <Button variant="secondary" className=" cursor-pointer capitalize">
          {t("login")}
        </Button>
      </Link>

      {/* <Link href="/signup" className="pr-2">
        <Button variant="secondary">{t("try")}</Button>
      </Link> */}
    </div>
  );
};

export default NavCTA;
