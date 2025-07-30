import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const HowCard = ({title , body}) => {
    const t = useTranslations("Cards");
    const pathname = usePathname(); // give you the url path
    const locale = pathname.split("/")[1] || "en"; // check the first part after /
    const isArabic = locale === "ar";
  return (
    <Card className="bg-black  overflow-hidden  border-white w-[350px] md:w-[400px] h-[430px] md:h-[480px]" dir={isArabic ? "rtl" : "ltr"}>
      <CardContent className="flex flex-col px-4 md:px-6  gap-8">
        <div className="w-full overflow-hidden  relative h-54 rounded-md">
          <Image
            src="/images/bg.jpg"
            alt="Logo"
            fill 
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 md:gap-4 ">
            <h3 className="text-white text-xl sm:text-2xl capitalize font-semibold  ">
              {title}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base font-normal leading-relaxed mb-auto">
           {body}
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowCard;
