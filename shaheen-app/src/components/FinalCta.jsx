"use client";
import { Button } from "@/components/ui/button";
import CurvedBand from "./CurvedRect";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function FinalCta() {
  const t = useTranslations("FinalCta");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <div className="relative flex flex-col items-center justify-center border border-white/25 min-h-[400px] bg-black text-white md:p-8 rounded-sm overflow-hidden shadow-lg mx-auto w-[300px] md:w-[800px] lg:w-[1200px] backdrop-blur-lg  md:mt-20 mb-20">
      {/* Heading */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-6xl satoshi-bold max-sm:w-[250px]  leading-tight max-w-3xl">
            {t("title")}
          </h1>
          <p className="text-base md:text-lg max-sm:w-[200px] font-normal text-gray-300 ">
            {t("subtitle")}
          </p>
        </div>
        <Link href={`/${locale}/sign-up`} className="w-full max-w-md">
          <Button
            variant="secondary"
            className="cursor-pointer  font-semibold py-3 px-6 rounded-md transition-all duration-200"
          >
            {t("button")}
          </Button>
        </Link>
      </div>

      {/* Curved Banner Background BOTTOM */}
      <div className="absolute bottom-[-200px]  w-[2000px]">
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
            <filter
              id="bannerBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
              {/* stdDeviation="40" for an 80px blur */}
            </filter>
          </defs>
          {/* The path element applies the filter and blend mode *to itself* */}
          <path
            d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
            fill="#B3A4FF"
            style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
          />
        </svg>
      </div>

      {/* Curved Banner Background BOTTOM */}
      <div className="absolute bottom-[-200px]  w-[2000px]">
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
            <filter
              id="bannerBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
              {/* stdDeviation="40" for an 80px blur */}
            </filter>
          </defs>
          {/* The path element applies the filter and blend mode *to itself* */}
          <path
            d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
            fill="#5E2FE8"
            style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
          />
        </svg>
      </div>

      {/* Curved Banner Background TOP */}
      <div className="absolute top-[-250px] rotate-180  w-[2000px]">
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
            <filter
              id="bannerBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
              {/* stdDeviation="40" for an 80px blur */}
            </filter>
          </defs>
          {/* The path element applies the filter and blend mode *to itself* */}
          <path
            d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
            fill="#5E2FE8"
            style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
          />
        </svg>
      </div>

      {/* Curved Banner Background TOP */}
      <div className="absolute top-[-300px] rotate-180  w-[2000px]">
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
            <filter
              id="bannerBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
              {/* stdDeviation="40" for an 80px blur */}
            </filter>
          </defs>
          {/* The path element applies the filter and blend mode *to itself* */}
          <path
            d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
            fill="#B3A4FF"
            style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
          />
        </svg>
      </div>
    </div>
  );
}
