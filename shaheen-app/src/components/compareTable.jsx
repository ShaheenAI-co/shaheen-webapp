"use client";
import { useTranslations, useLocale } from "next-intl";

export default function CompareTable() {
  const t = useTranslations("CompareTable");
  const isArabic = useLocale() === "ar";

  const features = [
    {
      key: "price",
      name: t("features.price.name"),
      description: t("features.price.description"),
      shaheen: t("features.price.shaheen"),
      agencies: t("features.price.agencies"),
      platforms: t("features.price.platforms"),
    },
    {
      key: "speed",
      name: t("features.speed.name"),
      description: t("features.speed.description"),
      shaheen: t("features.speed.shaheen"),
      agencies: t("features.speed.agencies"),
      platforms: t("features.speed.platforms"),
    },
    {
      key: "accuracy",
      name: t("features.accuracy.name"),
      description: t("features.accuracy.description"),
      shaheen: t("features.accuracy.shaheen"),
      agencies: t("features.accuracy.agencies"),
      platforms: t("features.accuracy.platforms"),
    },
    {
      key: "credibility",
      name: t("features.credibility.name"),
      description: t("features.credibility.description"),
      shaheen: t("features.credibility.shaheen"),
      agencies: t("features.credibility.agencies"),
      platforms: t("features.credibility.platforms"),
    },
    {
      key: "professionalism",
      name: t("features.professionalism.name"),
      description: t("features.professionalism.description"),
      shaheen: t("features.professionalism.shaheen"),
      agencies: t("features.professionalism.agencies"),
      platforms: t("features.professionalism.platforms"),
    },
    {
      key: "experience",
      name: t("features.experience.name"),
      description: t("features.experience.description"),
      shaheen: t("features.experience.shaheen"),
      agencies: t("features.experience.agencies"),
      platforms: t("features.experience.platforms"),
    },
    {
      key: "localMarket",
      name: t("features.localMarket.name"),
      description: t("features.localMarket.description"),
      shaheen: t("features.localMarket.shaheen"),
      agencies: t("features.localMarket.agencies"),
      platforms: t("features.localMarket.platforms"),
    },
    {
      key: "language",
      name: t("features.language.name"),
      description: t("features.language.description"),
      shaheen: t("features.language.shaheen"),
      agencies: t("features.language.agencies"),
      platforms: t("features.language.platforms"),
    },
    {
      key: "reliability",
      name: t("features.reliability.name"),
      description: t("features.reliability.description"),
      shaheen: t("features.reliability.shaheen"),
      agencies: t("features.reliability.agencies"),
      platforms: t("features.reliability.platforms"),
    },
  ];

  const ComparisonText = ({ text, isShaheen = false }) => {
    return (
      <span
        className={`  leading-relaxed ${isShaheen ? "text-green-300 font-bold text-xs lg:text-base" : "text-white font-normal text-xs lg:text-sm"}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div
      id="compare-section"
      className="min-h-screen w-full text-white flex flex-col items-center justify mt-25 md:mt-51 gap-20 p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <h2
          className={`text-2xl lg:text-5xl font-bold  leading-tight ${isArabic ? "alexandria-font " : "satoshi-bold"} max-sm:w-[300px] max-w-[500px] capitalize`}
        >
          {t("title")}
        </h2>
        <p className="max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-black border border-white/25 rounded-sm overflow-hidden shadow-[inset_0px_-126px_64px_-48px_#432C81,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
          {/* Mobile View - Stacked Cards */}
          <div className="block md:hidden">
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className="px-4 py-6 border-b border-white/25 last:border-b-0"
              >
                {/* LABEL */}
                <div className="mb-3 border-b border-white pb-3">
                  <h2 className="font-bold text-lg mb-1 text-[#6123B8] ">
                    {feature.name}
                  </h2>
                  <h3 className="text-xs text-white/50">
                    {feature.description}
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* SHAHEEN */}
                  <div className="flex flex-col gap-2 border-b border-white/25 pb-3">
                    <p className="font-bold text-white mb-1 text-base">
                      {t("shaheen")}
                    </p>
                    <ComparisonText text={feature.shaheen} isShaheen={true} />
                  </div>

                  {/* AGENCIES */}
                  <div className="flex flex-col gap-2 border-b border-white/25 pb-3">
                    <p className="font-bold text-white mb-1 text-base">
                      {t("agencies")}
                    </p>
                    <ComparisonText text={feature.agencies} />
                  </div>

                  {/* PLATFORMS */}
                  <div>
                    <p className="font-bold text-white mb-1 text-base">
                      {t("platforms")}
                    </p>
                    <ComparisonText text={feature.platforms} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block bg-white/5">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/25 ">
              <div className="font-semibold text-white">{t("criterion")}</div>
              <div className="font-semibold text-center text-white">
                {t("shaheen")}
              </div>
              <div className="font-semibold text-center text-white">
                {t("agencies")}
              </div>
              <div className="font-semibold text-center text-white">
                {t("platforms")}
              </div>
            </div>

            {/* Main Features */}
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className="grid grid-cols-4 gap-4 p-6 border-b items-center border-white/25 hover:bg-white/5 transition-colors"
              >
                <div className=" p-3 rounded">
                  <div className=" mb-1 ">
                    <h2 className="text-white text-lg font-bold">
                      {feature.name}
                    </h2>
                  </div>
                  <div className="text-xs lg:text-sm text-white/50">
                    <h3 className=" text-white/50">{feature.description}</h3>
                  </div>
                </div>
                <div className="flex justify-center items-start p-3">
                  <ComparisonText text={feature.shaheen} isShaheen={true} />
                </div>
                <div className="flex justify-center items-start p-3">
                  <ComparisonText text={feature.agencies} />
                </div>
                <div className="flex justify-center items-start p-3">
                  <ComparisonText text={feature.platforms} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
