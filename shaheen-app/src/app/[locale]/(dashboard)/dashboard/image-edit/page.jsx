"use client";
import React from "react";
import { ImageEditor } from "./components/ImageEditor";

const page = () => {
  return (
    <div>
      <ImageEditor
        imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        onImageChange={(newImageUrl) =>
          console.log("Image changed:", newImageUrl)
        }
      />
    </div>
  );
};

export default page;
