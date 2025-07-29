"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitcher";
import { Button } from "./ui/button";

const NavMobile = () => {
  const t = useTranslations("NavLinks");
  const l = useTranslations("NavCTA");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div className="md:hidden max-sm:block">
      <Sheet>
        <SheetTrigger>
          <Menu strokeWidth={"1px"} size={"25px"} />
        </SheetTrigger>
        <SheetContent className={`bg-black w-[300px]`}>
          <SheetHeader>
            <SheetTitle>Shaheen</SheetTitle>
            <SheetDescription>
              <div
                className={`flex  items-center mb-4 justify-center
       space-x-4 ${isArabic ? "flex-row-reverse" : ""} `}
              >
                <LanguageSwitch />

                <Link href="/login" className="pr-2">
                  <Button
                    variant="secondary"
                    className=" cursor-pointer capitalize"
                  >
                    {l("login")}
                  </Button>
                </Link>

          
              </div>
              <div className="flex flex-col justify-center text-xl items-center gap-4">
                <Link href="#">
                  <button
                    variant="link"
                    className="text-white font-light cursor-pointer"
                  >
                    {t("l-2")}
                  </button>
                </Link>

                <Link href="#">
                  <button
                    variant="link"
                    className="text-white font-light cursor-pointer"
                  >
                    {t("l-3")}
                  </button>
                </Link>

                <Link href="#">
                  <button
                    variant="link"
                    className="text-white font-light cursor-pointer"
                  >
                    {t("l-1")}
                  </button>
                </Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavMobile;
