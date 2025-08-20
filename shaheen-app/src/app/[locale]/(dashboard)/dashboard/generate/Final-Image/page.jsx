"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Sparkle } from "lucide-react";
import { useTranslations } from "next-intl";

import { useInstagramAuth } from "@/Hooks/useInstagramAuth";
import { instagramPosting } from "@/lib/instagram-posting";

const page = () => {
  const t = useTranslations("FinalImage");
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [imageUrl, setImageUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  // Instagram posting state
  const { isConnected, supabaseAccounts, user } = useInstagramAuth();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  // Caption generation state
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [caption, setCaption] = useState("This is a test caption");
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    setIsImageLoading(true);
    // Get image URL from query parameters
    const urlFromParams = searchParams.get("imageUrl");
    const originalUrlFromParams = searchParams.get("originalImageUrl");

    if (urlFromParams) {
      const decodedUrl = decodeURIComponent(urlFromParams);
      setImageUrl(decodedUrl);
      console.log("Final Image: Received edited image URL:", decodedUrl);

      // Preload the image to check if it's accessible
      const preloadImage = new window.Image();
      preloadImage.onload = () => {
        console.log("Final Image: Image preloaded successfully");
        setIsImageLoading(false);
        setImageError(false);
      };
      preloadImage.onerror = (e) => {
        console.error("Final Image: Image preload failed:", e);
        console.error("Failed image URL:", decodedUrl);
        setIsImageLoading(false);
        setImageError(true);
      };
      preloadImage.src = decodedUrl;

      // Add a timeout fallback in case the image takes too long to load
      const timeoutId = setTimeout(() => {
        if (isImageLoading) {
          console.log(
            "Final Image: Image loading timeout, setting loading to false"
          );
          setIsImageLoading(false);
        }
      }, 10000); // 10 second timeout

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    } else {
      // If no image URL from params, set loading to false
      setIsImageLoading(false);
    }

    if (originalUrlFromParams) {
      setOriginalImageUrl(decodeURIComponent(originalUrlFromParams));
      console.log(
        "Final Image: Received original image URL:",
        decodeURIComponent(originalUrlFromParams)
      );
    }
  }, [searchParams]);

  // Set default selected account when accounts are loaded
  useEffect(() => {
    if (supabaseAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(supabaseAccounts[0].instagram_id.toString());
    }
  }, [supabaseAccounts, selectedAccount]);

  // Handle caption generation
  const handleGenerateCaption = async () => {
    if (!imageUrl || imageUrl === "/images/bagV2.png") {
      setPostMessage(t("noImageToGenerateCaption"));
      return;
    }

    setIsGeneratingCaption(true);
    setPostMessage("");

    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          productInfo: {
            title: "Product Image",
            description: "Generated product image",
            category: "General",
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCaption(data.caption);
        setHashtags(data.hashtags || []);
        setPostMessage(t("captionGeneratedSuccessfully"));
      } else {
        throw new Error(data.error || "Failed to generate caption");
      }
    } catch (error) {
      console.error("Error generating caption:", error);
      setPostMessage(`${t("errorGeneratingCaption")} ${error.message}`);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // Handle Instagram posting
  const handleInstagramPost = async () => {
    if (!isConnected || !selectedAccount) {
      setPostMessage(t("pleaseConnectInstagramFirst"));
      return;
    }

    if (!imageUrl || imageUrl === "/images/bagV2.png") {
      setPostMessage(t("noImageToPost"));
      return;
    }

    setIsPosting(true);
    setPostMessage("");

    try {
      const selectedAccountData = supabaseAccounts.find(
        (acc) => acc.instagram_id.toString() === selectedAccount
      );

      if (!selectedAccountData) {
        throw new Error("Selected account not found");
      }

      // Use the caption state instead of getting from textarea
      const captionToUse = caption || "This is a test caption";

      // Convert image URL to File object for posting
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "instagram-post.png", {
        type: "image/png",
      });

      const result = await instagramPosting.postNow(
        selectedAccountData.instagram_id,
        selectedAccountData.access_token ||
          selectedAccountData.page_access_token,
        {
          files: [file],
          caption: captionToUse.trim() || undefined,
        }
      );

      setPostMessage(`${t("postedToInstagramSuccessfully")} ${result.mediaId}`);
    } catch (error) {
      setPostMessage(`${t("errorPostingToInstagram")} ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Handle image export
  const handleExportImage = async () => {
    try {
      // Get the current image URL (use the actual imageUrl state, not the hardcoded one)
      const currentImageUrl = imageUrl;

      // Fetch the image
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `exported-image-${timestamp}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Image exported successfully");
    } catch (error) {
      console.error("Error exporting image:", error);
      alert(t("failedToExportImage"));
    }
  };

  // Retry loading the image
  const retryImageLoad = () => {
    if (imageUrl) {
      setIsImageLoading(true);
      setImageError(false);

      const retryImage = new window.Image();
      retryImage.onload = () => {
        console.log("Final Image: Image retry successful");
        setIsImageLoading(false);
        setImageError(false);
      };
      retryImage.onerror = (e) => {
        console.error("Final Image: Image retry failed:", e);
        setIsImageLoading(false);
        setImageError(true);
      };
      retryImage.src = imageUrl;
    }
  };

  return (
    <div className="py-6 bg-[#0f0f0f] min-h-screen">
      <div className="w-full flex flex-col mt-6 px-4 sm:px-8 md:px-12">
        {/* EXPORT BUTTON - Responsive positioning and sizing */}
        <div className="w-full flex justify-end">
          <button
            onClick={handleExportImage}
            className="bg-[#6123B8] font-bold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-[#4a1a8a] transition-colors"
          >
            {t("export")}
          </button>
        </div>

        {/* Main container - Responsive layout: stacks vertically on mobile, horizontal on desktop */}
        <div className="w-full flex gap-4 sm:gap-6 items-center flex-col lg:flex-row border border-white/10 bg-white/5 rounded-lg p-3 sm:p-4 h-auto lg:h-[800px] mt-6">
          {/* IMAGE SECTION - Responsive sizing: adapts to image dimensions while maintaining aspect ratio */}
          <div className="w-full lg:w-[50%] h-auto lg:h-full flex items-center justify-center rounded-lg p-2">
            {isImageLoading ? (
              <div className="w-full h-[350px] sm:h-[490px] lg:h-[600px] max-w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/70 text-sm">{t("loadingImage")}</p>
                </div>
              </div>
            ) : imageError ? (
              <div className="w-full h-[350px] sm:h-[490px] lg:h-[600px] max-w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 text-red-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <p className="text-white/50 text-sm">
                  {t("failedToLoadImage")}
                </p>
                <button
                  onClick={retryImageLoad}
                  className="bg-[#6123B8] font-semibold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base"
                >
                  {t("retry")}
                </button>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="edited image"
                className="object-contain rounded-lg w-auto h-auto max-w-full max-h-[350px] sm:max-h-[490px] lg:max-h-[600px]"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                }}
                onLoad={() => {
                  console.log("Final Image: Image loaded successfully");
                  setIsImageLoading(false);
                }}
                onError={(e) => {
                  console.error("Final Image: Image failed to load:", e);
                  console.error("Failed image URL:", imageUrl);
                  setIsImageLoading(false);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-[350px] sm:h-[490px] lg:h-[600px] max-w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 text-white/50">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm">
                    {t("noImageAvailable")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* INFO SECTION - Responsive sizing: full width on mobile, 50% on desktop */}
          <div className="w-full lg:w-[50%] h-auto lg:h-full flex items-center justify-center rounded-lg p-2">
            {/* Content container - Responsive width and padding */}
            <div className="w-full max-w-[500px] p-4 sm:p-8 lg:p-12 bg-[#0F0F0F] rounded-lg flex flex-col items-center">
              {/* HEADING SECTION - Responsive text sizes and spacing */}
              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-6">
                <h1 className={`text-white text-2xl sm:text-3xl lg:text-5xl capitalize text-center  ${isArabic ? "alexandria-font font-bold " : "satoshi-bold"}`}>
                  {t("title")}
                </h1>
                <p className="text-white/50 text-center leading-relaxed px-4 sm:px-8 lg:px-12 text-base sm:text-lg">
                  {t("subtitle")}
                </p>
              </div>

              {/* FORM SECTION - Responsive spacing and layout */}
              <div className="flex flex-col w-full rounded-lg h-full items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
                {/* CAPTION SECTION - Responsive width and spacing */}
                <div className="flex flex-col gap-2 w-full justify-center items-center">
                  <p className="capitalize text-sm sm:text-base">
                    {t("postCaption")}
                  </p>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    cols="30"
                    rows="3"
                    className="bg-[#2E2042] rounded-lg p-3 sm:p-4 w-full max-w-[400px] text-sm sm:text-base text-white"
                    placeholder={t("captionPlaceholder")}
                  />
                  <button
                    onClick={handleGenerateCaption}
                    disabled={isGeneratingCaption || !imageUrl}
                    className="gap-1 bg-[#FF6B35] hover:bg-[#ff8a5c] text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex md:mt-4 items-center justify-center text-sm sm:text-base transition-colors"
                  >
                    {isGeneratingCaption ? (
                      <>
                        <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {!isMobile && t("generating")}
                      </>
                    ) : (
                      <>
                        <Sparkle className="h-3 w-3 sm:h-4 sm:w-4" />
                        {!isMobile && t("aiText")}
                      </>
                    )}
                  </button>

                  {/* Display generated hashtags */}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      <p className="text-white/70 text-sm">
                        {t("suggestedHashtags")}
                      </p>
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-md text-xs border border-purple-500/30 cursor-pointer hover:bg-purple-600/30 transition-colors"
                          onClick={() => setCaption((prev) => prev + " " + tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* INSTAGRAM ACCOUNT SELECTOR - Responsive styling */}
                {isConnected && supabaseAccounts.length > 0 && (
                  <div className="flex flex-col gap-2 w-full justify-center items-center">
                    <p className="capitalize text-white/70 text-sm sm:text-base">
                      {t("instagramAccount")}
                    </p>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="bg-[#2E2042] rounded-lg p-2 text-white border border-white/20 w-full max-w-[400px] text-sm sm:text-base"
                    >
                      {supabaseAccounts.map((account) => (
                        <option
                          key={account.instagram_id}
                          value={account.instagram_id}
                        >
                          @{account.username}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* POST MESSAGE - Responsive text sizing */}
                {postMessage && (
                  <div
                    className={`text-center px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                      postMessage.includes("Error")
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {postMessage}
                  </div>
                )}

                {/* BUTTONS SECTION - Responsive layout: stacked on mobile, side-by-side on larger screens */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full justify-center items-center">
                  <button className="bg-[#6123B8] font-semibold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-auto">
                    {t("publishNow")}
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="border border-[#6123B8] font-semibold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-auto  hover:text-white transition-colors"
                  >
                    {t("regenerate")}
                  </button>
                </div>

                {/* INSTAGRAM POST BUTTON - Responsive styling and layout */}
                {isConnected ? (
                  <button
                    onClick={handleInstagramPost}
                    disabled={isPosting || !selectedAccount}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 font-semibold capitalize text-white px-4 sm:px-6 cursor-pointer py-2 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    {isPosting ? (
                      <>📸 {t("posting")}</>
                    ) : (
                      <>📸 {t("postToInstagram")}</>
                    )}
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-white/50 text-xs sm:text-sm mb-2">
                      {t("connectInstagramToPost")}
                    </p>
                    <a
                      href="/en/dashboard"
                      className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm underline"
                    >
                      {t("goToDashboardToConnect")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
