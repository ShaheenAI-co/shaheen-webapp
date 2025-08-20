import { supabaseClient } from "../../utils/supabaseClient";

export async function getPosts({ userId, token }) {
  const supabase = supabaseClient(token);
  let query = supabase.from("posts").select("*").eq("user_id", userId);
  //if (userId) query = query.eq('user_id', userId)
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export const insertPostToSupabase = async (
  clerkUserId,
  postTitle,
  postData,
  postSz,
  originalImageUrl
) => {
  try {
    console.log("inserting post info ....", {
      clerkUserId,
      postData,
      originalImageUrl,
    });

    const supabase = await supabaseClient();

    console.log("Supabase client created successfully");

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          clerk_id: clerkUserId,
          post_title: postTitle,
          product_description: {
            product_title: postData.title,
            product_desc: postData.description,
          },
          post_size: postSz,
          original_image_url: originalImageUrl,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insertion error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log("post successfully inserted to Supabase:", data);
    return data;
  } catch (error) {
    console.error("Failed to insert post to Supabase - Full error:", error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    console.log("Fetching post details for post_id:", postId);

    const supabase = await supabaseClient();

    console.log("Supabase client created successfully");

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("post_id", postId)
      .single();

    if (error) {
      console.error("Supabase fetch error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    if (!data) {
      console.log("No post found for post_id:", postId);
      return null;
    }

    console.log("Post details fetched successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Failed to fetch post details from Supabase - Full error:",
      error
    );
    throw error;
  }
};

export const getPostCountByClerkId = async (clerkId) => {
  try {
    console.log("Fetching post count for clerk_id:", clerkId);

    const supabase = await supabaseClient();

    console.log("Supabase client created successfully");

    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Supabase count error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log("Post count fetched successfully:", count);
    return count || 0;
  } catch (error) {
    console.error(
      "Failed to fetch post count from Supabase - Full error:",
      error
    );
    return 0; // Return 0 as fallback
  }
};
