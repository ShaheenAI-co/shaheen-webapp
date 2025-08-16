"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { fetchImageUrlsByPostId } from "../../../../../../../../lib/supabase/generated_asset";
import Topbar from "../../../components/Topbar";

const GeneratedImages = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Simulate fetching images from an API or database
    const fetchImages = async () => {
      try {
        const fetchedImages = await fetchImageUrlsByPostId(
          "feeb4fd2-b5a9-474e-8c82-10795416f33b"
        );
        setImages(fetchedImages);
        console.log(`${images} images fetched successfully:`);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="py-6 bg-[#0f0f0f] min-h-screen">
      {/* TOPBAR */}
      <div className="px-12">
        <Topbar icon="/icons/Image_.svg" title="AI Advertisement" />
      </div>

      <div className="mt-6 px-8">
        <div className="flex flex-col gap-6   bg-white/5 border border-white/10 rounded-2xl px-4 py-6  ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className="font-bold text-lg capitalize">generated images</h3>
            <p className="text-white/35">
              select from one of the generated images
            </p>
          </div>

          <div className="w-full flex items-center gap-6 relative  flex-wrap">
            <div className="w-[250px] h-[350px] bg-white/10 rounded-lg relative">
              <img
                src="/images/Ai-placeholder.png"
                alt="generated image"
                className="w-full  h-full object-cover rounded-lg"
              />
              <Button className="bg-purple-500 absolute bottom- right-4 mx-auto text-white px-4 py-3 rounded-lg">
                select
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImages;
