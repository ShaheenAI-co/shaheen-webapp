'use client'
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkle, BadgePlus, Video, Instagram, Diamond, Images, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const GenerateCards = [
  {
    title: "AI Advertisement",
    description: "Upload your product image and let our AI craft a high converting marketing post complete with headlines, descriptions, and visuals ready to share.",
    icons: BadgePlus,
    href: "AI-Adv"
  },
  {
    title: "Video Ads",
    description: "Turn your product into a scroll stopping video ad. Just upload an image  we will handle the animation, text, and format tailored for paid campaigns.",
    icons: Video,
    href: "/AI-Vid"
  },
  {
    title: "Social Media Ads",
    description: "Generate ready to post social media content optimized for platforms like Instagram, Twitter, and TikTok no editing required.",
    icons: Instagram,
    href: "/AI-Social"
  },
];

const GenerateBtn = [
  {
    title: "all",
    icon: Diamond,
  },
  {
    title: "images",
    icon: Images,
  },
  {
    title: "videos",
    icon: Film,
  }
];

export default function page() {

    const t = useTranslations("");
    const pathname = usePathname(); // give you the url path
    const locale = pathname.split("/")[1] || "en"; // check the first part after /
    const isArabic = locale === "ar";
  return (
    <div className="px-12 mt-6 h-screen">
        {/* Heading */}
      <div className="flex flex-col gap-2 border-b border-[#272729] pb-4 ">
        <h2 className="text-2xl font-bold capitalize satoshi-bold ">
          AI Generated Content
        </h2>
        <p className="text-base text-[#626264]  capitalize  ">
          Generate your own content with our AI-powered tools
        </p>
        <div className="flex gap-2 mt-4">
          {GenerateBtn.map((btn, index) => (
            <Button
              key={index}
              className="text-base text-white  capitalize flex items-center gap-2 cursor-pointer hover:bg-[#9161fa35] transition-all duration-300 "
            >
              {btn.title}
              <btn.icon size={20} strokeWidth={1} className="text-white" />
            </Button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-6 mt-8 flex-wrap">
        {GenerateCards.map((card, index) => (
          <Link  href={`${pathname}/${card.href}`} key={card.title} className="">
              <Card
                key={card.title}
                className={cn(
                  "w-[350px] text-white cursor-pointer  hover:border-[#7F4BF3] transition-all duration-300 ",
                  "bg-[#0c0c0c90] border-[#464545] "
                )}
              >
                <CardHeader className="flex flex-col gap-2">
                  <card.icons
                    size={34}
                    strokeWidth={1}
                    className="text-[#7F4BF3]"
                  />
                  <h2 className="text-lg font-semibold text-white  capitalize  ">
                    {card.title}
                  </h2>
                  <p className="text-base ">{card.description}</p>
                </CardHeader>
                <CardContent>
                  <div className=" flex items-center justify-center capitalize border border-[#464545] rounded-md p-2 h-[200px]">
                    image here
                  </div>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
