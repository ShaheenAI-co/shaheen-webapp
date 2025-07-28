'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
const HeroHeading = () => {
    const t = useTranslations("Heading");
    const pathname = usePathname(); // give you the url path
    const locale = pathname.split("/")[1] || "en"; // check the first part after /
    const isArabic = locale === "ar";
  return (
    <main className="flex flex-col z-10 items-center justify-center gap-12  px-6 py-26 lg:py-54 text-center w-full">
        <div className="flex flex-col gap-8">
          <h1 className={`text-4xl md:text-5xl   max-w-5xl ${isArabic ? "alexandria-font leading-normal lg:text-6xl" : "satoshi-bold lg:text-7xl leading-tight "}`}>
           {t("title")}
          </h1>

          <p className="text-lg md:text-xl text-gray-300  mx-auto  leading-relaxed">
           {t("subhead")}
          </p>
        </div>

        <Link href="/login">
          <Button variant="secondary" className="cursor-pointer">
            Get Started
          </Button>
        </Link>





      </main>
  )
}

export default HeroHeading