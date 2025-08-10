'use client'
import React from 'react'
import Card from './Card'
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const HowItWork = () => {
    const t = useTranslations("Cards");
    const pathname = usePathname(); // give you the url path
    const locale = pathname.split("/")[1] || "en"; // check the first part after /
    const isArabic = locale === "ar";
  return (
    <div className='flex flex-col justify-center items-center bg-[#06040D]  mt-32 gap-10 md:gap-16 px-4 lg:px-34 '>
        <h2 className='text-xl lg:text-4xl font-bold satoshi-bold capitalize '>
            {t("Heading")}
        </h2>
        <div className={`flex justify-center items-center gap-8 flex-wrap `}>
            <Card title={t("Title-1")} body={t("body-1")} imgSrc={`/images/productV2.png`}/>
            <Card title={t("Title-2")} body={t("body-2")} imgSrc={`/images/Ai-placeholder.png`}/>
            <Card title={t("Title-3")} body={t("body-3")} imgSrc={`/images/product-final.png`}/>
        </div>
    </div>
  )
}

export default HowItWork