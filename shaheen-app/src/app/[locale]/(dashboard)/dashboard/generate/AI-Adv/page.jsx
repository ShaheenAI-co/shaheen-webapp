"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";
import { insertPostToSupabase } from "../../../../../../../lib/supabase/post";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Loader2 } from "lucide-react";

const page = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("AIAdvertisement");
  const isArabic = locale === "ar";

  const postSize = [
    {
      title: t("postSize"),
      icon: "",
      size: "1080 x 1080",
    },
    {
      title: t("landscapeSize"),
      icon: "",
      size: "1200 x 628",
    },
    {
      title: t("storySize"),
      icon: "",
      size: "1080 x 1920",
    },
    {
      title: t("portraitSize"),
      icon: "",
      size: "1080 x 1350",
    },
  ];

  const [post, setPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handlePostSize = (value) => {
    setPost(value);
    console.log(value);
  };

  useEffect(() => {
    console.log(post);
  }, [post]);

  const handleFileChange = (files) => {
    setSelectedFile(files[0]?.file || null);
  };

  // const handleEditImage = async () => {
  //   if (!selectedFile) {
  //     setGenerationStatus("Please select an image first.");
  //     return;
  //   }

  //   setIsGenerating(true);
  //   setGenerationStatus("Uploading image for editing...");

  //   try {
  //     // Upload image to S3
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);

  //     const s3Response = await fetch("/api/s3-upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const s3Result = await s3Response.json();

  //     if (!s3Result.success) {
  //       throw new Error(`S3 upload failed: ${s3Result.error}`);
  //     }

  //     const imageUrl = s3Result.s3Url;
  //     setGenerationStatus(
  //       "Image uploaded successfully. Redirecting to editor..."
  //     );

  //     // Navigate to image-edit page with the image URL
  //     router.push(
  //       `/${locale}/dashboard/generate/AI-Adv/generated_images?post_id=f88f242f-022d-4195-9ebb-f73da5db34e4`
  //     );
  //   } catch (error) {
  //     console.error("Image upload error:", error);
  //     setGenerationStatus(`Image upload failed: ${error.message}`);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleGenerate = async () => {
    if (
      !post ||
      !postTitle ||
      !productInfo.title ||
      !productInfo.description ||
      !selectedFile
    ) {
      setGenerationStatus(t("pleaseFillAllFields"));
      return;
    }

    setIsGenerating(true);
    setGenerationStatus(t("startingGeneration"));

    try {
      // Step 1: Upload image to S3
      setGenerationStatus(t("uploadingImageToS3"));
      const formData = new FormData();
      formData.append("file", selectedFile);

      const s3Response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const s3Result = await s3Response.json();

      if (!s3Result.success) {
        throw new Error(t("s3UploadFailed", { error: s3Result.error }));
      }

      const originalImageUrl = s3Result.s3Url;
      setGenerationStatus(t("imageUploadedSuccessfully"));

      // Step 2: Create post in Supabase
      const postData = {
        title: productInfo.title,
        description: productInfo.description,
      };

      const supabaseResult = await insertPostToSupabase(
        user.id,
        postTitle,
        postData,
        post,
        originalImageUrl
      );

      console.log("Supabase result:", supabaseResult);
      console.log("Supabase result type:", typeof supabaseResult);
      console.log("Supabase result length:", supabaseResult?.length);
      console.log(
        "Supabase result keys:",
        supabaseResult ? Object.keys(supabaseResult) : "undefined"
      );

      if (!supabaseResult || supabaseResult.length === 0) {
        console.error("Supabase result validation failed:", { supabaseResult });
        throw new Error(t("failedToCreatePost"));
      }

      const postId = supabaseResult[0].post_id;
      console.log("Post ID:", postId);
      console.log("Post ID type:", typeof postId);
      console.log("Full first result object:", supabaseResult[0]);

      if (!postId) {
        console.error("Post ID is undefined or null:", {
          postId,
          supabaseResult,
        });
        throw new Error(t("postIdMissing"));
      }

      setGenerationStatus(t("postCreated"));

      // Step 3: Call generate API
      setGenerationStatus(t("callingAIGenerationAPI"));

      // Format size for API (remove spaces and ensure proper format)
      const formattedSize = post.replace(/\s/g, "");
      console.log("Formatted size for API:", formattedSize);

      const apiPayload = {
        input_image_url: originalImageUrl,
        size: formattedSize,
        post_id: postId,
      };
      console.log("API payload being sent:", apiPayload);

      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      console.log("Generate API response status:", generateResponse.status);
      console.log(
        "Generate API response headers:",
        Object.fromEntries(generateResponse.headers.entries())
      );

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Generate API error response:", errorText);
        throw new Error(
          t("generationAPIError", {
            status: generateResponse.status,
            error: errorText,
          })
        );
      }

      const generateResult = await generateResponse.json();

      if (!generateResult.success) {
        throw new Error(t("generationFailed", { error: generateResult.error }));
      }

      setGenerationStatus(
        t("generationCompleted", { count: generateResult.total_generated })
      );

      router.push(
        `/${locale}/dashboard/generate/AI-Adv/generated_images?post_id=${postId}`
      );
    } catch (error) {
      console.error("Generation error:", error);
      setGenerationStatus(t("generationFailed", { error: error.message }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className=" py-6 bg-[#0f0f0f] min-h-screen"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* CONTENT */}
      <div className="mt-6 px-8">
        {/* POST SIZE */}
        <div className="flex flex-col gap-6   bg-white/5 border border-white/10 rounded-2xl px-4 py-6  ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className="font-bold text-lg capitalize">
              {t("selectPostSize")}
            </h3>
            <p className="text-white/35">{t("selectPostSizeDesc")}</p>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-6 justify-center  flex-wrap">
            {postSize.map((item, index) => (
              <div
                key={index}
                className={`w-[200px] h-[200px]   border-2 border-white/30 gradient-purple-dark opacity-60 flex flex-col gap-3 items-center justify-center rounded-2xl cursor-pointer hover:scale-105 hover:opacity-100 transition-all duration-300 ${post === item.size ? "opacity-100 scale-105" : ""}`}
                onClick={() => handlePostSize(item.size)}
              >
                <h4 className="font-medium capitalize">{item.title}</h4>
                <p>{item.size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col gap-4   bg-white/5 border border-white/10 rounded-2xl px-4 py-6 mt-6 ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className="font-bold text-lg capitalize">{t("productInfo")}</h3>
            <p className="text-white/35">{t("productInfoDesc")}</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              {/* POST TITLE */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">{t("postTitle")}</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder={t("postTitlePlaceholder")}
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              {/* PRODUCT NAME */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">{t("productName")}</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder={t("productNamePlaceholder")}
                  value={productInfo.title}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, title: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT CATEGORY */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">{t("productCategory")}</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder={t("productCategoryPlaceholder")}
                  value={productInfo.category}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, category: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PRODUCT DESCRIPTION */}
            <div className="flex flex-col gap-4">
              <h4 className="capitalize">{t("productDescription")}</h4>
              <textarea
                name=""
                id=""
                className="bg-[#0F0F0F] w-full px-4 py-3 rounded-lg outline-purple-500"
                value={productInfo.description}
                onChange={(e) =>
                  setProductInfo({
                    ...productInfo,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-6    bg-white/5 border border-white/10 rounded-2xl px-4 py-6 mt-6 ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className="font-bold text-lg capitalize">{t("imageUpload")}</h3>
            <p className="text-white/35">{t("imageUploadDesc")}</p>
          </div>

          <div className="flex flex-col w-full  justify-center items-center gap-4">
            <ImageUpload onFileChange={handleFileChange} />
          </div>

          {/* Generation Status */}
          {generationStatus && (
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                {isGenerating && (
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                )}
                <p className="text-sm text-white/80">{generationStatus}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            {/* GENERATE BUTTON */}
            <Button
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                t("generate")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
