"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ImageEditor } from "./components/ImageEditor";

const page = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("ImageEdit");
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
        const parsedProductInfo = JSON.parse(
          decodeURIComponent(productInfoFromParams)
        );
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
        t={t}
        locale={locale}
      />
    </div>
  );
};

export default page;
