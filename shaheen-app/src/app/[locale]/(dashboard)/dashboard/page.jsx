import React from "react";
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
import { FolderClosed, Brush, Calendar } from "lucide-react";
import Image from "next/image";
import InstagramConnectionStatus from "@/components/InstagramConnectionStatus";
// import InstagramPostScheduler from "@/components/InstagramPostScheduler";

const DashboardCards = [
  {
    title: "Total Projects",
    value: 0,
    icon: "/icons/Paper_File.svg",
  },
  {
    title: "Total Brands",
    value: 0,
    icon: "/icons/Folder_File_Project.svg",
  },
  {
    title: "Schedule Post",
    value: 0,
    icon: "/icons/Calendar.svg",
  },
];

const SchedulePost = [" post"];

const Dashboardpage = () => {
  return (
    <div className="px-12 pt-6  min-h-screen ">
      <div className="mt-6">
        {/* GREETINGS */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold capitalize satoshi-bold ">
            Welcome back , <span className="text-[#7F4BF3] italic">Ahmad</span>{" "}
          </h2>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="flex gap-6 mt-8 flex-wrap">
          {DashboardCards.map((card, index) => (
            <Card
              key={index}
              className={cn(
                "w-[250px] text-white",
                " bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] "
              )}
            >
              <CardHeader>
                <h2 className="text-base text-[#626264]  capitalize  ">
                  {card.title}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-3xl font-bold capitalize satoshi-bold ">
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
              "w-[800px] text-white",
              " bg-white/10 border border-white/20 h-[400px] backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] "
            )}
          >
            <CardHeader>
              <CardTitle>
                <h2 className="text-base   capitalize font-normal ">
                  Scheduled Posts
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`flex flex-col justify-center items-center h-full gap-2`}
            >
              <div className="flex justify-center items-center h-full">
                <h2 className="text-sm text-white/50">No scheduled post</h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
