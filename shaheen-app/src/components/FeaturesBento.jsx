"use client";
import { useTranslations, useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations("FeaturesBento");
  const isArabic = useLocale() === "ar";
  return (
    <div
      id="features-section"
      className="min-h-screen flex flex-col gap-20 mt-25 md:mt-51  p-4 md:p-8"
    >
      <div className="flex flex-col items-center text-center  gap-4">
        <h2 className={`text-2xl lg:text-5xl font-bold ${isArabic ? "alexandria-font " : "satoshi-bold"} leading-tight max-sm:w-[300px]  max-w-[500px]  capitalize `}>
          {t("title")}
        </h2>
        <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto lg:grid-rows-3 gap-4 max-w-6xl mx-auto min-h-[600px]">

        {/* Large card - AI Advertisement Generation */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-2 lg:row-span-2 bg-black border border-white/25 shadow-[inset_0px_-246px_64px_-48px_#432C81,inset_0px_-308px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col justify-between p-8 min-h-[400px] md:min-h-[500px] ">
          <div>
            <h1
              className={`text-white text-2xl md:text-3xl lg:text-2xl font-semibold leading-tight mb-3 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
            >
              {t("aiAdvertisement.title")}
            </h1>
            <p className="text-gray-300 font-normal text-sm leading-relaxed">
              {t("aiAdvertisement.description")}
            </p>
          </div>

          <div>
            <img
              src="/images/feature-1.png"
              alt="AI Advertisement Feature"
              className="w-full h-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Card 2 - Social Media Integration */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2
            className={`text-white text-lg font-semibold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("socialMedia.title")}
          </h2>
          <p className="text-gray-300 font-normal text-base">
            {t("socialMedia.description")}
          </p>
          <div>
            <img
              src="/images/hashtag.png"
              alt="AI Advertisement Feature"
              className="w-full h-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Card 3 - Post Scheduling */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2
            className={`text-white text-lg font-semibold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("scheduling.title")}
          </h2>
          <p className="text-gray-300 font-normal text-base">
            {t("scheduling.description")}
          </p>
          <div>
            <img
              src="/images/hourglass.png"
              alt="AI Advertisement Feature"
              className="w-full h-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Card 4 - Image Editing */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2
            className={`text-white text-lg font-semibold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("imageEditing.title")}
          </h2>
          <p className="text-gray-300 font-normal text-base">
            {t("imageEditing.description")}
          </p>
          <img
                src="/images/imagePen.png"
                alt="AI Advertisement Feature"
                className="w-full h-auto max-w-full object-contain rounded-sm"
              />
        </div>

        {/* Card 5 - AI Retouching */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2
            className={`text-white text-lg font-semibold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("retouching.title")}
          </h2>
          <p className="text-gray-300 font-normal text-base">
            {t("retouching.description")}
          </p>
          <img
                src="/images/image-Ai.png"
                alt="AI Advertisement Feature"
                className="w-full h-auto max-w-full object-contain"
              />
        </div>

        {/* Card 6 - Multilingual Support */}
        <div className="md:col-span-2 lg:col-span-2 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#432C81,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex  p-6 min-h-[150px]">
          <div>
            <h3
              className={`text-white text-lg font-bold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
            >
              {t("multilingual.title")}
            </h3>
            <p className="text-gray-300 text-sm">
              {t("multilingual.description")}
            </p>
            <div>
            <div className="w-full flex justify-center items-center max-sm:p-4">
              <img
                src="/images/globe.png"
                alt="AI Advertisement Feature"
                className="w-1/2 h-auto max-w-full object-contain"
              />
            </div>
          </div>
          </div>
        </div>

        {/* Card 7 - Video Ads */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2
            className={`text-white text-lg font-semibold mb-2 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("videoAds.title")}
          </h2>
          <p className="text-gray-300 font-normal text-base">
            {t("videoAds.description")}
          </p>

          <div>
            <img
              src="/images/video.png"
              alt="AI Advertisement Feature"
              className="w-full h-auto max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
