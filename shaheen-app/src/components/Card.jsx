import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const HowCard = ({title , body,imgSrc}) => {
    const t = useTranslations("Cards");
    const pathname = usePathname(); // give you the url path
    const locale = pathname.split("/")[1] || "en"; // check the first part after /
    const isArabic = locale === "ar";
  return (
    <Card className="bg-black  overflow-hidden  border-gray-400 w-[350px] md:w-[400px] h-[500px] md:h-[550px] shadow-[inset_0px_-66px_64px_-48px_#B52CFF,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten" dir={isArabic ? "rtl" : "ltr"}>
      <CardContent className="flex flex-col px-4 md:px-6  gap-8">
        <div className="w-full overflow-hidden flex justify-center items-center  relative h-[300px] rounded-md">
          <Image
            src={imgSrc}
            alt="Logo"
           fill
            className=" object-cover aspect-square  rounded-md "
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
