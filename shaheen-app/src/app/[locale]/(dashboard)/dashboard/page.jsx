"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { cn } from "../../../../lib/utils";
import { FolderClosed, Brush, Calendar, Plus } from "lucide-react";
import Image from "next/image";
import InstagramConnectionStatus from "@/components/InstagramConnectionStatus";
import { useUser } from "@clerk/nextjs";
import { getUserByClerkId } from "../../../../../lib/supabase/users";
import { getPostCountByClerkId } from "../../../../../lib/supabase/post";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
// import InstagramPostScheduler from "@/components/InstagramPostScheduler";

const Dashboardpage = () => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const router = useRouter();

  // i18n setup
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  const DashboardCards = [
    {
      title: t("totalProjects"),
      value: postCount,
      icon: "/icons/Paper_File.svg",
    },
    {
      title: t("totalBrands"),
      value: 0,
      icon: "/icons/Folder_File_Project.svg",
    },
    {
      title: t("schedulePost"),
      value: 0,
      icon: "/icons/Calendar.svg",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && user) {
        try {
          const data = await getUserByClerkId(user.id);
          setUserData(data);

          // Fetch post count
          const count = await getPostCountByClerkId(user.id);
          setPostCount(count);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Fallback to Clerk user data if Supabase fails
          setUserData({
            first_name: user.firstName || "User",
          });
        } finally {
          setLoading(false);
        }
      } else if (isLoaded) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  return (
    <div
      className={`px-4 sm:px-6 md:px-8 lg:px-12 pt-6 min-h-screen ${isArabic ? "text-right" : "text-left"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mt-6">
        {/* GREETINGS */}
        <div className="flex flex-col gap-2">
          <h2
            className={`text-2xl sm:text-3xl font-bold capitalize satoshi-bold ${isArabic ? "alexandria-font" : ""}`}
          >
            {t("welcomeBack")} ,{" "}
            <span className="text-[#7F4BF3] italic">
              {loading ? "..." : userData?.first_name || "User"}
            </span>{" "}
          </h2>
        </div>

        {/* CREATE NEW POST BUTTON */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/${locale}/dashboard/generate/AI-Adv`)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7F4BF3] to-[#826CFF] text-white font-semibold rounded-lg hover:from-[#6B3FE8] hover:to-[#7A5FEE] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t("createNewPost")}
          </button>
        </div>

        {/* DASHBOARD CARDS */}
        <div className={`flex gap-4 sm:gap-6 mt-8 flex-wrap justify-start`}>
          {DashboardCards.map((card, index) => (
            <Card
              key={index}
              className={cn(
                "w-full sm:w-[200px] md:w-[250px] text-white",
                " bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] "
              )}
            >
              <CardHeader>
                <h2
                  className={`text-base text-[#626264] capitalize ${isArabic ? "alexandria-font" : ""}`}
                >
                  {card.title}
                </h2>
              </CardHeader>
              <CardContent>
                <div
                  className={`flex items-center justify-between gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}
                >
                  <p
                    className={`text-3xl font-bold capitalize satoshi-bold ${isArabic ? "alexandria-font" : ""}`}
                  >
                    {card.value}
                  </p>
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={64}
                    height={64}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* INSTAGRAM CONNECTION STATUS */}
        <div className="mt-8">
          <InstagramConnectionStatus />
        </div>

        {/* INSTAGRAM POST SCHEDULER */}
        {/* <div className="mt-8">
          <InstagramPostScheduler />
        </div> */}

        {/* TABLE */}
        <div className="mt-8">
          <Card
            className={cn(
              "w-full max-w-[800px] text-white",
              " bg-white/10 border border-white/20 h-[300px] sm:h-[400px] backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] "
            )}
          >
            <CardHeader>
              <CardTitle>
                <h2
                  className={`text-base capitalize font-normal ${isArabic ? "alexandria-font" : ""}`}
                >
                  {t("scheduledPosts")}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`flex flex-col justify-center items-center h-full gap-2`}
            >
              <div className="flex justify-center items-center h-full">
                <h2
                  className={`text-sm text-white/50 ${isArabic ? "alexandria-font" : ""}`}
                >
                  {t("noScheduledPost")}
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
