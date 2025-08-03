import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";


const page = () => {
  return (
    <div className="mt-8 px-12 h-screen">
      {/* Heading */}
      <div className="flex flex-col gap-2 border-b border-[#272729] pb-4 ">
        <h2 className="text-2xl font-bold capitalize satoshi-bold ">
          AI Advertisement
        </h2>
        <p className="text-base text-[#626264]  capitalize  ">
          Generate your own advertisement with our AI-powered tools
        </p>
      </div>


      <div className="mt-12 border">
        <div
          className={cn(
            "w-full text-white px-0   ",
            "bg-[#0C0C0C] border-[#464545] "
          )}
        >
          <div className={``}>
            <h2 className="capitalize font-semibold text-lg">Select post size</h2>
            <h3 className="text-base text-[#626264]">Select your post size depending on the platform you want to advertise in </h3>
          </div>

          <div>
            <div className="w-full h-[300px] flex flex-col rounded-md gap-4  bg-[#181717] border-2 border-[#272729] ">
              <div className="flex gap-4 items-end">
                <h4 className="capitalize text-lg">Social media size</h4>
                <p className="text-[#626264]">most common size for social media platforms</p>
              </div>
              <div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
