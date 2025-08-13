"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";
import { insertPostToSupabase } from "../../../../../../../lib/supabase/post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [post, setPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    console.log(productInfo);
  }, [productInfo]);

  const handlePostSize = (value) => {
    setPost(value);
    console.log(value);
  };

  const handleFileChange = (files) => {
    setSelectedFile(files[0]?.file || null);
  };

  const handleGenerate = async () => {
    if (!post || !postTitle || !productInfo.title || !productInfo.description || !selectedFile) {
      setGenerationStatus("Please fill in all fields and select an image before generating.");
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
      console.log("Supabase result keys:", supabaseResult ? Object.keys(supabaseResult) : 'undefined');

      if (!supabaseResult || supabaseResult.length === 0) {
        console.error("Supabase result validation failed:", { supabaseResult });
        throw new Error("Failed to create post in database");
      }

      const postId = supabaseResult[0].post_id;
      console.log("Post ID:", postId);
      console.log("Post ID type:", typeof postId);
      console.log("Full first result object:", supabaseResult[0]);
      
      if (!postId) {
        console.error("Post ID is undefined or null:", { postId, supabaseResult });
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
      console.log("Generate API response headers:", Object.fromEntries(generateResponse.headers.entries()));

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Generate API error response:", errorText);
        throw new Error(`Generation API error: ${generateResponse.status} - ${errorText}`);
      }

      const generateResult = await generateResponse.json();

      if (!generateResult.success) {
        throw new Error(`Generation failed: ${generateResult.error}`);
      }

      setGenerationStatus(`Generation completed successfully! Generated ${generateResult.total_generated} images.`);
      
      // TEMPORARILY DISABLED: Redirect to generated_images page after a short delay
      // setTimeout(() => {
      //   router.push("/dashboard/generated_images");
      // }, 2000);

    } catch (error) {
      console.error("Generation error:", error);
      setGenerationStatus(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
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

      {/* Post Size Selection Card */}
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
                {postSize.map((postItem) => (
                  <div
                    key={postItem.title}
                    className={`w-[200px] h-[200px] flex justify-center items-center flex-col gap-2 border-1 rounded-md hover:bg-purple-300/5 cursor-pointer ${
                      post === postItem.size ? "bg-purple-300/10 border-purple-500" : ""
                    }`}
                    onClick={() => handlePostSize(postItem.size)}
                  >
                    <h4 className="text-lg font-semibold">{postItem.title}</h4>
                    <p>{`(${postItem.size})`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="mt-12 border rounded-lg overflow-hidden">
        <div
          className={cn(
            "w-full text-white flex flex-col gap-8  py-9  ",
            "bg-[#0C0C0C] border-[#464545]  "
          )}
        >
          <div className={`flex flex-col gap-2 px-8 `}>
            <h2 className="capitalize font-semibold text-lg ">product info</h2>
            <h3 className="text-base text-[#626264] ">
              give us the details of your product to generate the advertisement
              post
            </h3>
          </div>

          <div className="w-full flex items-center justify-start gap-6 px-8 ">
            <div className="flex flex-col w-[15vw]   gap-2">
              <label className="capitalize">post title </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter post name"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            <div className="w-full flex items-center justify-start gap-6 px-8 ">
              <div className="flex flex-col w-[15vw]   gap-2">
                <label className="capitalize">product name </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product name"
                  value={productInfo.title}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, title: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col w-[15vw]   gap-2">
                <label className="capitalize">product description </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product description"
                  value={productInfo.description}
                  onChange={(e) =>
                    setProductInfo({
                      ...productInfo,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
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
            <ImageUpload onFileChange={handleFileChange} />
          </div>

          {generationStatus && (
            <div className="w-full flex justify-center items-center py-2">
              <div
                className={`text-sm ${generationStatus.includes("successfully") ? "text-green-500" : generationStatus.includes("failed") ? "text-red-500" : "text-blue-500"}`}
              >
                {generationStatus}
              </div>
            </div>
          )}

          {/* Progress Steps */}
          {isGenerating && (
            <div className="w-full flex justify-center items-center py-2">
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Processing...</span>
              </div>
            </div>
          )}

          <div className="w-full flex justify-center items-center py-4">
            <Button
              className={`text-white capitalize cursor-pointer px-6 py-2 bg-[#7F4BF3] hover:bg-[#804bf3cf] ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
              size={22}
              onClick={handleGenerate}
              disabled={isGenerating || !post || !postTitle || !productInfo.title || !productInfo.description || !selectedFile}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
