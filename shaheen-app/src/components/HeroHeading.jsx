"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const HeroHeading = () => {
  const t = useTranslations("Heading");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";

  // Array of images to cycle through
  const images = [
    "/images/Elegant-Perfume.png",
    "/images/productV3.png",
    "/images/product-final.png",
    "/images/bag.png",
    "/images/bagV2.png",
    "/images/perfume.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Wait for fade out, then change image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300); // Half of the transition duration
    }, 3000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <main className="flex  z-10 flex-col md:flex-row md:justify-between items-center justify-center gap-18 md:gap-12  md:px-6 py-20   px-3 lg:pb-54 lg:pt-30  text-center w-full">
      <div
        className={`flex md:w-1/2 flex-col gap-4 md:gap-8 md:justify-start md:items-start justify-center items-center `}
      >
        {/* TITLE */}

        <div className="flex flex-col w-full gap-4 md:gap-6 ">
          <h1
            className={` md:text-5xl md:text-left    ${isArabic ? "alexandria-font md:text-right leading-normal text-3xl lg:text-6xl" : "satoshi-bold md:text-left   lg:text-7xl leading-tight text-4xl "}`}
          >
            {t("title")}
          </h1>
          <p
            className={`text-base md:text-xl  text-gray-300  md:text-left  ${isArabic ? "md:text-right " : "md:text-left "}`}
          >
            {t("subhead")}
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Link href={`/${locale}/sign-up`}>
            <Button variant="secondary" className="cursor-pointer">
              {t("CTA")}
            </Button>
          </Link>
          <Link href={`/${locale}/sign-up`}>
            <Button
              variant="secondary"
              className="cursor-pointer capitalize border border-white bg-transparent text-white hover:bg-transparent "
            >
              learn more
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex md:w-1/2 w-full  gap-4  justify-center items-start md:gap-8">
        <img
          src={images[currentImageIndex]}
          alt=""
          className={`md:w-[500px] w-[200px] md:h-[500px] h-[200px] rounded-lg object-cover transition-opacity duration-600 ease-in-out animate-bounce ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{
            animation: "floatUpDown 4s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes floatUpDown {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </main>
  );
};

export default HeroHeading;
