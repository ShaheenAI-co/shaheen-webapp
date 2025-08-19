"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
} from "./carousel";

const productCarousel = () => {
  const t = useTranslations("productCarousel");
  const isArabic = useLocale() === "ar";

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify mt-25 md:mt-51 gap-20 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col items-center text-center gap-4">
        <h2
          className={`text-2xl lg:text-5xl font-bold  leading-tight ${isArabic ? "alexandria-font " : "satoshi-bold"} max-sm:w-[300px] max-w-[500px] capitalize`}
        >
          {t("title")}
        </h2>
      </div>

      {/* CAROUSEL */}

      <div className="relative w-full px-4">
        <Carousel>
          <CarouselContent className="-ml-4">
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                1
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                2
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                3
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                4
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                5
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                6
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                7
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselNavigation
            className="absolute -bottom-20 left-auto top-auto w-full justify-end gap-2"
            classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
            alwaysShow
          />
        </Carousel>
      </div>
    </div>
  );
};
export default productCarousel;
