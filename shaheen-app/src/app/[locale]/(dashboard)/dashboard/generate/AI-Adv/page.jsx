"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";
import { insertPostToSupabase } from "../../../../../../../lib/supabase/post";
import { useUser } from "@clerk/nextjs";

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

  const [post, setPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
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

  const handlePostSubmit = async () => {
    if (!post || !productInfo.name || !productInfo.description) {
      setUploadStatus("Please fill in all fields before submitting.");
      return;
    }

  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select an image first");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading...");


    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus("Upload successful! File uploaded to S3");
        console.log("Uploaded file:", result.fileName);
    insertPostToSupabase(user.id,postTitle, productInfo, post);

      } else {
        setUploadStatus(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed: Network error");
    } finally {
      setIsUploading(false);
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
                onChange={(e) => setPostTitle(e.target.value)
                }
              />
            </div>

          <div className="w-full flex items-center justify-start gap-6 px-8 ">
            <div className="flex flex-col w-[15vw]   gap-2">
              <label className="capitalize">product name </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter product name"
                value={productInfo.name}
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

          {uploadStatus && (
            <div className="w-full flex justify-center items-center py-2">
              <div
                className={`text-sm ${uploadStatus.includes("successful") ? "text-green-500" : uploadStatus.includes("failed") ? "text-red-500" : "text-blue-500"}`}
              >
                {uploadStatus}
              </div>
            </div>
          )}

          <div className="w-full flex justify-center items-center py-4">
            <Button
              className={`text-white capitalize cursor-pointer px-6 py-2 bg-[#7F4BF3] hover:bg-[#804bf3cf] ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              size={22}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>

  </div>
  );
};

export default page;
