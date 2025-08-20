"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const ImageB_A = () => {
  const t = useTranslations("ImageB_A");
  const isArabic = useLocale() === "ar";

  return (
    <div className="w-full px-4 flex mt-10  h-screen flex-col gap-15 justify-center items-center rounded-lg   lg:px-20 ">
      {/* HEADING */}
      <div className="flex flex-col items-center text-center  gap-4">
        <h2
          className={`text-2xl lg:text-5xl font-bold ${isArabic ? "alexandria-font" : "satoshi-bold"} leading-tight max-sm:w-[300px]  max-w-[700px]  capitalize `}
        >
          {t("title")}
        </h2>
      </div>

      <div className=" h-[500px] md:w-[70%]w-[50%] rounded-lg relative">
        <img
          src="/images/blackPerfumeBg.jpg"
          alt="perfume"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6  border  overflow-hidden md:w-[250px] md:h-[250px] w-[150px] h-[150px] py-6 flex flex-col bg-white justify-center items-center">
          <p className={`text-black text-base md:text-lg font-bold pt-6 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}>{t("before")}</p>
          <img
            src="/images/blackPerfume.png"
            alt="perfume"
            className="w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageB_A;
