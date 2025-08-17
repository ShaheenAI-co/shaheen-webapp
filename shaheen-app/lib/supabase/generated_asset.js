import { supabaseClient } from "../../utils/supabaseClient";

// S3 bucket base URL - can be configured via environment variable
const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export const fetchImagesByPostId = async (postId) => {
  try {
    console.log("Attempting to fetch images for post_id:", postId);

    const supabase = await supabaseClient();

    console.log("Supabase client created successfully");

    const { data, error } = await supabase
      .from("generated_assets")
      .select("asset_id, image_url")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase fetch error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log("data", data);

    if (!data || data.length === 0) {
      console.log("No images found for post_id:", postId);
      return [];
    }

    console.log(
      `Successfully fetched ${data.length} images for post_id ${postId}:`,
      data
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch images from Supabase - Full error:", error);
    throw error;
  }
};

// Alternative function that returns only the image URLs as an array
export const fetchImageUrlsByPostId = async (postId) => {
  try {
    const data = await fetchImagesByPostId(postId);
    // Construct full S3 URLs by prepending the S3 bucket base URL
    return data.map((item) => `${S3_BASE_URL}${item.image_url}`);
  } catch (error) {
    console.error("Failed to fetch image URLs:", error);
    throw error;
  }
};

// Function that returns full data with complete S3 URLs
export const fetchImagesWithFullUrlsByPostId = async (postId) => {
  try {
    const data = await fetchImagesByPostId(postId);
    // Construct full S3 URLs by prepending the S3 bucket base URL
    return data.map((item) => ({
      ...item,
      full_image_url: `${S3_BASE_URL}${item.image_url}`,
    }));
  } catch (error) {
    console.error("Failed to fetch images with full URLs:", error);
    throw error;
  }
};
