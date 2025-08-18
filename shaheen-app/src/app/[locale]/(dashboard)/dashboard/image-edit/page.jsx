"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ImageEditor } from "./components/ImageEditor";

const page = () => {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    // Get image URL and product info from query parameters
    const urlFromParams = searchParams.get("imageUrl");
    const productInfoFromParams = searchParams.get("productInfo");

    if (urlFromParams) {
      setImageUrl(decodeURIComponent(urlFromParams));
      console.log("Image URL from params:", decodeURIComponent(urlFromParams));
    }

    if (productInfoFromParams) {
      try {
        const parsedProductInfo = JSON.parse(decodeURIComponent(productInfoFromParams));
        setProductInfo(parsedProductInfo);
        console.log("Product info from params:", parsedProductInfo);
      } catch (error) {
        console.error("Failed to parse product info:", error);
      }
    }
  }, [searchParams]);

  const handleImageChange = (newImageUrl) => {
    console.log("Image changed:", newImageUrl);
    setImageUrl(newImageUrl);
  };

  return (
    <div>
      <ImageEditor 
        imageUrl={imageUrl} 
        onImageChange={handleImageChange}
        productInfo={productInfo}
      />
    </div>
  );
};

export default page;
