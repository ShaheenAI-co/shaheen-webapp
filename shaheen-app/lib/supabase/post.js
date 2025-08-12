import { supabaseClient } from "../../utils/supabaseClient"

export async function getPosts({userId , token}) {
  const supabase = supabaseClient(token)
  let query = supabase.from('posts').select('*').eq('user_id', userId)
  //if (userId) query = query.eq('user_id', userId)
  const { data, error } = await query
  if (error) throw error
  return data
}


export const insertPostToSupabase = async (clerkUserId,postTitle, postData , postSz) => {
    try {
      console.log("inserting post info ....", { clerkUserId, postData });

      const supabase = await supabaseClient();

      console.log("Supabase client created successfully");

      const { data, error } = await supabase.from("posts").insert([
        {
          clerk_id: clerkUserId,
          post_title:postTitle,
          product_description:{
            product_title:postData.title,
            product_desc:postData.description
          },
          post_size: postSz,
        },
      ]);

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