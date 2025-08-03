import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FolderClosed, Brush, Calendar } from "lucide-react";
import TableComponent from "./components/Table";

const DashboardCards = [
  {
    title: "Total Projects",
    value: 0,
    icon: FolderClosed,
  },
  {
    title: "Total Brands",
    value: 0,
    icon: FolderClosed,
  },
  {
    title: "Total Retouch",
    value: 0,
    icon: Brush,
  },
  {
    title: "Total Schedule",
    value: 0,
    icon: Calendar,
  }
]

const Dashboardpage = () => {
  return (
    <div className="px-12 mt-6 h-screen ">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold capitalize satoshi-bold ">
          Welcome back , <span className="text-[#7F4BF3]">Ahmad</span> {" "}
        </h2>
      </div>
      
      <div className="flex gap-6 mt-8 flex-wrap">
        {DashboardCards.map((card, index) => (
          <Card key={index} className={cn("w-[250px] text-white", "bg-[#0C0C0C] border-[#464545] ")}>
            <CardHeader>
              <h2 className="text-base text-[#626264]  capitalize  ">
                {card.title}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2">
                <p className="text-3xl font-bold capitalize satoshi-bold ">{card.value}</p>
                <card.icon size={64} strokeWidth={1} className="text-[#7F4BF3]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="mt-8">
        <Card className={cn("w-[800px] text-white", "bg-[#0C0C0C] border-[#464545] ")}>
          <CardHeader>
            <CardTitle>
              <h2 className="text-base   capitalize font-normal ">
                Total Brands
              </h2>
            </CardTitle>
            </CardHeader>
            <CardContent>
              <TableComponent />
            </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default Dashboardpage;
