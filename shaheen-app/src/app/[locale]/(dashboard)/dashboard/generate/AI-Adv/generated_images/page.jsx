"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { fetchImageUrlsByPostId } from "../../../../../../../../lib/supabase/generated_asset";
import Topbar from "../../../components/Topbar";
import { useSearchParams } from "next/navigation";

const GeneratedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get post_id from URL search parameters
        const postId = searchParams.get('post_id');
        
        if (!postId) {
          setError("No post ID provided. Please go back and try again.");
          setLoading(false);
          return;
        }
        
        console.log("Fetching images for post_id:", postId);
        
        const fetchedImages = await fetchImageUrlsByPostId(postId);
        setImages(fetchedImages);
        console.log(`${fetchedImages.length} images fetched successfully for post_id: ${postId}`);
        
        // Debug: Log the current URL and search params
        console.log("Current URL:", window.location.href);
        console.log("Search params:", Object.fromEntries(searchParams.entries()));
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to fetch images. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [searchParams]);

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

          {/* IMAGES CONTAINER */}
          
          {loading && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6123B8] mx-auto mb-4"></div>
                <p className="text-white/70">Loading generated images...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="bg-[#6123B8] text-white px-6 py-2 rounded-lg hover:bg-[#6123B8]/80 transition-all duration-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-white/70 mb-4">No images found for this post.</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="bg-[#6123B8] text-white px-6 py-2 rounded-lg hover:bg-[#6123B8]/80 transition-all duration-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="w-full flex items-center gap-6 relative justify-center flex-wrap">
              {/* IMAGES */}
              {images.map((image, index) => (
                <div
                  className="w-[250px] h-[350px] hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden  bg-white/10 rounded-lg relative"
                  key={index}
                >
                  <img
                    src={image.image_url}
                    alt="generated image"
                    className="w-full  h-full object-cover "
                  />
                  <button className="bg-[#6123B8] cursor-pointer hover:bg-[#6123B8]/80 transition-all duration-300 text-white px-4 py-3  rounded-b-2xl  w-full">
                    select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedImages;
