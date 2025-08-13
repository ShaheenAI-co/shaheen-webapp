import { supabaseClient } from "../../utils/supabaseClient"

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
    
    if (!data || data.length === 0) {
      console.log("No images found for post_id:", postId);
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} images for post_id ${postId}:`, data);
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
    return data.map(item => item.image_url);
  } catch (error) {
    console.error("Failed to fetch image URLs:", error);
    throw error;
  }
};