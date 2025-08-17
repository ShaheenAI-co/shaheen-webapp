"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";
import { insertPostToSupabase } from "../../../../../../../lib/supabase/post";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Topbar from "../../components/Topbar";
import { Loader2 } from "lucide-react";

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
];

const page = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [post, setPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
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

  const handleGenerate = async () => {
    if (
      !post ||
      !postTitle ||
      !productInfo.title ||
      !productInfo.description ||
      !selectedFile
    ) {
      setGenerationStatus(
        "Please fill in all fields and select an image before generating."
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Starting generation process...");

    try {
      // Step 1: Upload image to S3
      setGenerationStatus("Uploading image to S3...");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const s3Response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const s3Result = await s3Response.json();

      if (!s3Result.success) {
        throw new Error(`S3 upload failed: ${s3Result.error}`);
      }

      const originalImageUrl = s3Result.s3Url;
      setGenerationStatus("Image uploaded successfully. Creating post...");

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
        throw new Error("Failed to create post in database");
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
        throw new Error("Post ID is missing from database response");
      }

      setGenerationStatus("Post created. Generating AI content...");

      // Step 3: Call generate API
      setGenerationStatus("Calling AI generation API...");

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
          `Generation API error: ${generateResponse.status} - ${errorText}`
        );
      }

      const generateResult = await generateResponse.json();

      if (!generateResult.success) {
        throw new Error(`Generation failed: ${generateResult.error}`);
      }

      setGenerationStatus(
        `Generation completed successfully! Generated ${generateResult.total_generated} images.`
      );

      router.push(`/${locale}/dashboard/generate/AI-Adv/generated_images`);
    } catch (error) {
      console.error("Generation error:", error);
      setGenerationStatus(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className=" py-6 bg-[#0f0f0f] min-h-screen">
      {/* TOPBAR */}
      <div className="px-12">
        <Topbar icon="/icons/Image_.svg" title="AI Advertisement" />
      </div>

      {/* CONTENT */}
      <div className="mt-6 px-8">
        {/* POST SIZE */}
        <div className="flex flex-col gap-6   bg-white/5 border border-white/10 rounded-2xl px-4 py-6  ">
          <div className="w-full flex flex-col gap-2   ">
            <h3 className="font-bold text-lg capitalize">select post size</h3>
            <p className="text-white/35">select from one of the post sizes</p>
          </div>

          <div className="w-full flex items-center gap-6 justify-center  flex-wrap">
            {postSize.map((item, index) => (
              <div
                key={index}
                className={`w-[200px] h-[200px]  border-2 border-white/30 gradient-purple-dark opacity-60 flex flex-col gap-3 items-center justify-center rounded-2xl cursor-pointer hover:scale-105 hover:opacity-100 transition-all duration-300 ${post === item.size ? "opacity-100 scale-105" : ""}`}
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
            <h3 className="font-bold text-lg capitalize">product info</h3>
            <p className="text-white/35">enter the product info</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              {/* POST TITLE */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">post title</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder="eg. new product"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              {/* PRODUCT NAME */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">product name</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder="eg. Nike Air Max"
                  value={productInfo.title}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, title: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT CATEGORY */}
              <div className="flex items-center gap-2">
                <h4 className="capitalize">product category</h4>
                <input
                  className="bg-[#0F0F0F] w-[300px] px-4 py-3 rounded-lg outline-purple-500"
                  type="text"
                  placeholder="eg. Shoes"
                  value={productInfo.category}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, category: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PRODUCT DESCRIPTION */}
            <div className="flex flex-col gap-4">
              <h4 className="capitalize">product description</h4>
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
            <h3 className="font-bold text-lg capitalize">image upload</h3>
            <p className="text-white/35">upload the product image</p>
          </div>

          <div className="flex flex-col w-full  justify-center items-center gap-4">
            <ImageUpload onFileChange={handleFileChange} />
          </div>

          {/* Generation Status */}
          {/* {generationStatus && (
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                {isGenerating && (
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                )}
                <p className="text-sm text-white/80">{generationStatus}</p>
              </div>
            </div>
          )} */}

          <div className="flex justify-center mt-6">
            <Button
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
