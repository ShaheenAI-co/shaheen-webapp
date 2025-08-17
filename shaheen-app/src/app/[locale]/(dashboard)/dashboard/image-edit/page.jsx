"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ImageEditor } from "./components/ImageEditor";

const page = () => {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Get image URL from query parameters
    const urlFromParams = searchParams.get("imageUrl");

    if (urlFromParams) {
      setImageUrl(decodeURIComponent(urlFromParams));
      console.log("Image URL from params:", decodeURIComponent(urlFromParams));
    }
  }, [searchParams]);

  const handleImageChange = (newImageUrl) => {
    console.log("Image changed:", newImageUrl);
    setImageUrl(newImageUrl);
  };

  return (
    <div>
      <ImageEditor imageUrl={imageUrl} onImageChange={handleImageChange} />
    </div>
  );
};

export default page;
