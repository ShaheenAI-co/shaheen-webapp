"use client";
import { Button } from "@/components/ui/button";
import { User, Cloud, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Pricing() {
  const t = useTranslations("Pricing");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";
  const [isYearly, setIsYearly] = useState(false);

  // Pricing data
  const pricingData = {
    startup: { monthly: 350, yearly: "3,500" },
    business: { monthly: 750, yearly: "7,500" },
    enterprise: { monthly: 1800, yearly: "18,000" },
  };

  const getCurrentPrice = (plan) => {
    return isYearly ? pricingData[plan].yearly : pricingData[plan].monthly;
  };

  const getPeriodText = () => {
    return isYearly ? t("year") : t("month");
  };

  return (
    <div
      id="pricing-section"
      className="min-h-screen w-full text-white flex flex-col items-center justify mt-25 md:mt-51  gap-20 p-4 sm:p-6 lg:p-8"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center  gap-4">
        <h2 className="text-2xl lg:text-5xl font-bold satoshi-bold leading-tight max-sm:w-[300px]  max-w-[500px]  capitalize ">
          {t("title")}
        </h2>
        <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">
          {t("subtitle")}
        </p>

        {/* Pricing Toggle */}
        <div className={`flex items-center gap-4 mt-6 ${isArabic ? "" : ""}`}>
          <span
            className={`text-sm font-medium transition-colors ${!isYearly ? "text-white" : "text-gray-400"}`}
          >
            {t("monthly")}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              isYearly ? "bg-purple-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly
                  ? isArabic
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : isArabic
                    ? "-translate-x-1"
                    : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${isYearly ? "text-white" : "text-gray-400"}`}
          >
            {t("yearly")}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8  w-full justify-center items-center">
        {/*  Card 1 */}
        <div className="relative overflow-hidden rounded-sm border-1  border-white/25 bg-black backdrop-blur-lg  w-[300px] h-[550px] md:w-[350px] md:h-[600px] pt-4 pb-12 shadow-[inset_-48px_44px_84px_-48px_#B52CFF,inset_-32px_68px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">
            <h2 className="text-2xl satoshi-bold  mb-2">{t("startup.name")}</h2>

            <div className="flex flex-col gap-2 ">
              <div className="flex items-baseline ">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/Logo/saudi-riyal-symbol.svg"
                    alt="Logo"
                    width={18}
                    height={18}
                    className="inline-block mr-1"
                  />
                  <h1 className=" text-4xl"> {getCurrentPrice("startup")}</h1>
                </div>
                <span className={`text-white ml-2 font-normal  text-lg `}>
                  {getPeriodText()}
                </span>
              </div>
              <p className="font-normal text-base mb-8 capitalize">
                {t("startup.description")}
              </p>
            </div>

            <Link href={`/${locale}/sign-up`}>
              <Button className="w-full bg-white text-black hover:bg-[#864dd5] hover:text-white  cursor-pointer capitalize font-bold text-lg py-6 rounded-sm transition-all duration-200">
                {t("startup.button")}
              </Button>
            </Link>

            {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">
              <h3 className="text-base font-semibold mb-4">
                {t("startup.featuresTitle")}
              </h3>

              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("startup.features.seats")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("startup.features.storage")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("startup.features.tools")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/*  Card 2 */}
        <div className="relative overflow-hidden rounded-sm border-1 border-white/25 bg-black backdrop-blur-lg  w-[300px] h-[550px] md:w-[350px] md:h-[600px] pt-4 pb-12  shadow-[inset_102px_-46px_84px_-48px_#B52CFF,inset_108px_-32px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">
            <h2 className="text-2xl satoshi-bold  mb-2">
              {t("business.name")}
            </h2>

            <div className="flex flex-col gap-2 ">
              <div className="flex items-baseline ">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/Logo/saudi-riyal-symbol.svg"
                    alt="Logo"
                    width={18}
                    height={18}
                    className="inline-block mr-1"
                  />
                  <h1 className=" text-4xl"> {getCurrentPrice("business")}</h1>
                </div>
                <span className="text-white ml-2 font-normal text-lg">
                  {getPeriodText()}
                </span>
              </div>
              <p className="font-normal text-base mb-8">
                {t("business.description")}
              </p>
            </div>

            <Link href={`/${locale}/sign-up`}>
              <Button className="w-full bg-white text-black hover:bg-[#864dd5] hover:text-white  cursor-pointer capitalize font-bold text-lg py-6 rounded-sm transition-all duration-200">
                {t("business.button")}
              </Button>
            </Link>

            {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">
              <h3 className="text-base font-semibold mb-4">
                {t("business.featuresTitle")}
              </h3>

              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("business.features.seats")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("business.features.storage")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("business.features.tools")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/*  Card 3 */}
        <div className="relative overflow-hidden rounded-sm border-1 border-white/25 bg-black backdrop-blur-lg  w-[300px] h-[550px] md:w-[350px] md:h-[600px] pt-4 pb-12  shadow-[inset_-88px_-60px_84px_-48px_#B52CFF,inset_-88px_-60px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">
            <h2 className="text-2xl satoshi-bold  mb-2">
              {t("enterprise.name")}
            </h2>

            <div className="flex flex-col gap-2 ">
              <div className="flex items-baseline ">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/Logo/saudi-riyal-symbol.svg"
                    alt="Logo"
                    width={18}
                    height={18}
                    className="inline-block mr-1"
                  />
                  <h1 className=" text-4xl">{getCurrentPrice("enterprise")}</h1>
                </div>
                <span className="text-white ml-2 font-normal text-lg">
                  {getPeriodText()}
                </span>
              </div>
              <p className="font-normal text-base mb-8">
                {t("enterprise.description")}
              </p>
            </div>

            <Link href={`/${locale}/sign-up`}>
              <Button className="w-full bg-white text-black hover:bg-[#864dd5] hover:text-white  cursor-pointer capitalize font-bold text-lg py-6 rounded-sm transition-all duration-200">
                {t("enterprise.button")}
              </Button>
            </Link>

            {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">
              <h3 className="text-base font-semibold mb-4">
                {t("enterprise.featuresTitle")}
              </h3>

              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("enterprise.features.seats")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("enterprise.features.storage")}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">
                    {t("enterprise.features.tools")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
