"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { fetchImageUrlsByPostId } from "../../../../../../../../lib/supabase/generated_asset";
import { getPostById } from "../../../../../../../../lib/supabase/post";
import { useTranslations } from "next-intl";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const GeneratedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("GeneratedImages");
  const isArabic = locale === "ar";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get post_id from URL search parameters
        const postId = searchParams.get("post_id");

        if (!postId) {
          setError(t("noPostIdError"));
          setLoading(false);
          return;
        }

        console.log("Fetching data for post_id:", postId);

        // Fetch both images and post details in parallel
        const [fetchedImages, fetchedPostDetails] = await Promise.all([
          fetchImageUrlsByPostId(postId),
          getPostById(postId),
        ]);

        setImages(fetchedImages);
        setPostDetails(fetchedPostDetails);

        console.log(
          `${fetchedImages.length} images fetched successfully for post_id: ${postId}`
        );
        console.log("Post details fetched:", fetchedPostDetails);

        // Debug: Log the current URL and search params
        console.log("Current URL:", window.location.href);
        console.log(
          "Search params:",
          Object.fromEntries(searchParams.entries())
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, t]);

  const handleImageSelect = (selectedImageUrl) => {
    if (!postDetails) {
      console.error("No post details available");
      return;
    }

    // Extract product info from post details
    const productInfo = {
      title: postDetails.product_description?.product_title || "",
      description: postDetails.product_description?.product_desc || "",
      category: postDetails.product_description?.product_category || "",
      postTitle: postDetails.post_title || "",
    };

    // Navigate to image-edit page with both image URL and product info
    const imageEditUrl = `/${locale}/dashboard/image-edit?imageUrl=${encodeURIComponent(selectedImageUrl)}&productInfo=${encodeURIComponent(JSON.stringify(productInfo))}`;
    router.push(imageEditUrl);
  };

  return (
    <div className="py-6 bg-[#0f0f0f] min-h-screen">
      <div className="mt-6 px-8">
        <div className="flex flex-col gap-6   bg-white/5 border border-white/10 rounded-2xl px-4 py-6  ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className={`font-bold text-lg capitalize ${isArabic ? "alexandria-font font-bold " : "satoshi-bold"}`}>{t("title")}</h3>
            <p className="text-white/35">{t("subtitle")}</p>
          </div>

          {/* IMAGES CONTAINER */}

          {loading && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6123B8] mx-auto mb-4"></div>
                <p className="text-white/70">{t("loading")}</p>
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
                  {t("goBack")}
                </button>
              </div>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-white/70 mb-4">{t("noImagesFound")}</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-[#6123B8] text-white px-6 py-2 rounded-lg hover:bg-[#6123B8]/80 transition-all duration-300"
                >
                  {t("goBack")}
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
                    src={image}
                    alt="generated image"
                    className="w-full  h-full object-cover "
                  />

                  <button
                    onClick={() => handleImageSelect(image)}
                    className="bg-[#6123B8] cursor-pointer hover:bg-[#6123B8]/80 transition-all duration-300 text-white px-4 py-3  rounded-b-2xl  w-full"
                  >
                    {t("select")}
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
