"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Image from "next/image";
import { useInstagramAuth } from "@/Hooks/useInstagramAuth";
import { instagramPosting } from "@/lib/instagram-posting";

const page = () => {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState("/images/bagV2.png");
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  // Instagram posting state
  const { isConnected, supabaseAccounts, user } = useInstagramAuth();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  useEffect(() => {
    // Get image URL from query parameters
    const urlFromParams = searchParams.get("imageUrl");
    const originalUrlFromParams = searchParams.get("originalImageUrl");

    if (urlFromParams) {
      setImageUrl(decodeURIComponent(urlFromParams));
      console.log(
        "Final Image: Received edited image URL:",
        decodeURIComponent(urlFromParams)
      );
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

  // Handle Instagram posting
  const handleInstagramPost = async () => {
    if (!isConnected || !selectedAccount) {
      setPostMessage("Please connect your Instagram account first");
      return;
    }

    if (!imageUrl || imageUrl === "/images/bagV2.png") {
      setPostMessage("No image to post");
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

      // Get caption from textarea
      const captionElement = document.querySelector("textarea");
      const caption = captionElement ? captionElement.value : "";

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
          caption: caption.trim() || undefined,
        }
      );

      setPostMessage(
        `Posted to Instagram successfully! 🎉 Media ID: ${result.mediaId}`
      );
    } catch (error) {
      setPostMessage(`Error posting to Instagram: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="py-6 bg-[#0f0f0f] min-h-screen">
      <div className="w-full flex flex-col mt-6 px-4 sm:px-8 md:px-12">
        {/* EXPORT BUTTON - Responsive positioning and sizing */}
        <div className="w-full flex justify-end">
          <button className="bg-[#6123B8] font-bold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            export
          </button>
        </div>

        {/* Main container - Responsive layout: stacks vertically on mobile, horizontal on desktop */}
        <div className="w-full flex gap-4 sm:gap-6 items-center flex-col lg:flex-row border border-white/10 bg-white/5 rounded-lg p-3 sm:p-4 h-auto lg:h-[800px] mt-6">
          {/* IMAGE SECTION - Responsive sizing: adapts to image dimensions while maintaining aspect ratio */}
          <div className="w-full lg:w-[50%] h-auto lg:h-full flex items-center justify-center rounded-lg p-2">
            <img
              src={"/images/perfume.png"}
              alt="edited image"
              className="object-contain rounded-lg w-auto h-auto max-w-full max-h-[350px] sm:max-h-[490px] lg:max-h-[600px]"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
              }}
              onLoad={() =>
                console.log("Final Image: Image loaded successfully")
              }
              onError={(e) => {
                console.error("Final Image: Image failed to load:", e);
                console.error("Failed image URL:", imageUrl);
              }}
            />
          </div>

          {/* INFO SECTION - Responsive sizing: full width on mobile, 50% on desktop */}
          <div className="w-full lg:w-[50%] h-auto lg:h-full flex items-center justify-center rounded-lg p-2">
            {/* Content container - Responsive width and padding */}
            <div className="w-full max-w-[500px] p-4 sm:p-8 lg:p-12 bg-[#0F0F0F] rounded-lg flex flex-col items-center">
              {/* HEADING SECTION - Responsive text sizes and spacing */}
              <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl satoshi-bold capitalize text-center leading-tight">
                  your product is ready to post
                </h1>
                <p className="text-white/50 text-center leading-relaxed px-4 sm:px-8 lg:px-12 text-sm sm:text-base">
                  Need changes? You can go back or generate another version
                  anytime
                </p>
              </div>

              {/* FORM SECTION - Responsive spacing and layout */}
              <div className="flex flex-col w-full rounded-lg h-full items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
                {/* CAPTION SECTION - Responsive width and spacing */}
                <div className="flex flex-col gap-2 w-full justify-center items-center">
                  <p className="capitalize text-sm sm:text-base">
                    post caption
                  </p>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="3"
                    className="bg-[#2E2042] rounded-lg p-3 sm:p-4 w-full max-w-[400px] text-sm sm:text-base"
                    defaultValue={"This is a test caption"}
                  ></textarea>
                </div>

                {/* INSTAGRAM ACCOUNT SELECTOR - Responsive styling */}
                {isConnected && supabaseAccounts.length > 0 && (
                  <div className="flex flex-col gap-2 w-full justify-center items-center">
                    <p className="capitalize text-white/70 text-sm sm:text-base">
                      instagram account
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
                    publish now
                  </button>
                  <button className="border border-[#6123B8] font-semibold capitalize text-white px-3 sm:px-4 cursor-pointer py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-auto">
                    regenerate
                  </button>
                </div>

                {/* INSTAGRAM POST BUTTON - Responsive styling and layout */}
                {isConnected ? (
                  <button
                    onClick={handleInstagramPost}
                    disabled={isPosting || !selectedAccount}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 font-semibold capitalize text-white px-4 sm:px-6 cursor-pointer py-2 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    {isPosting ? <>📸 Posting...</> : <>📸 Post to Instagram</>}
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-white/50 text-xs sm:text-sm mb-2">
                      Connect Instagram to post directly
                    </p>
                    <a
                      href="/en/dashboard"
                      className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm underline"
                    >
                      Go to Dashboard to connect
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
