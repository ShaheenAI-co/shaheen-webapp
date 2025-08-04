"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";

const postSize = [
  {
    title: "Post Size",
    icon: "",
    size: "1080 x 1080",
  },
  {
    title: "Landscape Size",
    icon: "",
    size: "1200 x 628",
  },
  {
    title: "Story Size",
    icon: "",
    size: "1080 x 1920",
  },
  {
    title: "Portrait Size",
    icon: "",
    size: "1080 x 1350",
  },
  {
    title: "Pin",
    icon: "",
    size: "1000 x 1500",
  },
];

const page = () => {
  const [post, setPost] = useState("");

  const handlePostSize = (value) => {
    setPost(value);
    console.log(value);
  };

  return (
    <div className="mt-8 px-8 pb-8 ">
      {/* Heading */}
      <div className="flex flex-col gap-2 border-b border-[#272729] pb-4 px-6">
        <h2 className="text-2xl font-bold capitalize satoshi-bold ">
          AI Advertisement
        </h2>
        <p className="text-base text-[#626264]  capitalize  ">
          Generate your own advertisement with our AI-powered tools
        </p>
      </div>

      <div className="mt-12 border rounded-lg overflow-hidden">
        <div
          className={cn(
            "w-full text-white  pt-6  ",
            "bg-[#0C0C0C] border-[#464545]  "
          )}
        >
          {/* First Card Heading */}

          <div className={`flex flex-col gap-2 px-8`}>
            <h2 className="capitalize font-semibold text-lg ">
              Select post size
            </h2>
            <h3 className="text-base text-[#626264] ">
              Select your post size depending on the platform you want to
              advertise in{" "}
            </h3>
          </div>

          <div className="p-4">

            <div className="w-full  flex flex-col rounded-md gap-6 px-4 py-6  bg-[#181717] border-2 border-[#272729] ">

              {/* Second Card Heading */}

              <div className="flex gap-4 items-end">
                <h4 className="capitalize text-lg">Social media size</h4>
                <p className="text-[#626264]">
                  most common size for social media platforms
                </p>
              </div>

              {/* Post Size Cards */}

              <div className="w-full flex gap-4 flex-wrap">
                {postSize.map((post) => (
                  <div
                    key={post.title}
                    className="w-[200px] h-[200px] flex justify-center items-center flex-col gap-2 border-1 rounded-md hover:bg-purple-300/5 cursor-pointer"
                    onClick={() => handlePostSize(post.size)}
                  >
                    <h4 className="text-lg font-semibold">{post.title}</h4>
                    <p>{`(${post.size})`}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="w-full flex justify-center items-center py-4">
        <Button className={`tex-white  cursor-pointer   px-6 py-2 bg-[#7F4BF3] hover:bg-[#804bf3cf] `} size={22}>
          Next
        </Button>
      </div>
        </div>
      </div>


      <div className="mt-12 border rounded-lg overflow-hidden">
        <div
          className={cn(
            "w-full text-white  pt-6  ",
            "bg-[#0C0C0C] border-[#464545]  "
          )}
        >

          <div className={`flex flex-col gap-2 px-8`}>
            <h2 className="capitalize font-semibold text-lg ">
              Upload product image
            </h2>
            <h3 className="text-base text-[#626264] ">
              Take a picture of your product with your phone and upload it 
            </h3>
          </div>

          <div className="w-full flex items-center justify-center h-[300px]">
            <ImageUpload/>
          </div>

          <div className="w-full flex justify-center items-center py-4">
        <Button className={`tex-white capitalize  cursor-pointer   px-6 py-2 bg-[#7F4BF3] hover:bg-[#804bf3cf] `} size={22}>
          upload
        </Button>
      </div>
        </div>
      </div>


    </div>
  );
};

export default page;
