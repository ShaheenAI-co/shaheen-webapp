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
import { useUser } from "@clerk/nextjs";

const NavMobile = () => {
  const t = useTranslations("NavLinks");
  const l = useTranslations("NavCTA");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const { isSignedIn, isLoaded } = useUser();

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

                {isLoaded &&
                  (isSignedIn ? (
                    <Link href={`/${locale}/dashboard`} className="pr-2">
                      <Button
                        variant="secondary"
                        className=" cursor-pointer capitalize"
                      >
                        {l("dashboard")}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/${locale}/sign-in`} className="pr-2">
                      <Button
                        variant="secondary"
                        className=" cursor-pointer capitalize"
                      >
                        {l("login")}
                      </Button>
                    </Link>
                  ))}
              </div>
              <div className="flex flex-col justify-center text-xl items-center gap-4">
                <button
                  onClick={() => scrollToSection("features-section")}
                  className="text-white font-light cursor-pointer bg-transparent border-none"
                >
                  {t("l-2")}
                </button>

                <Link href="#">
                  <button
                    variant="link"
                    className="text-white font-light cursor-pointer"
                  >
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
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavMobile;
