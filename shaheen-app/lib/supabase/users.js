import { supabaseClient } from "../../utils/supabaseClient";

export async function getUsers({ userId, token }) {
  const supabase = supabaseClient(token);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function getUserByClerkId(clerkId) {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("first_name, last_name, email")
      .eq("clerk_id", clerkId)
      .single();

    if (error) {
      console.error("Error fetching user by Clerk ID:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch user by Clerk ID:", error);
    throw error;
  }
}

export const insertUserToSupabase = async (clerkUserId, userData) => {
  try {
    console.log("Attempting to insert user:", { clerkUserId, userData });

    const supabase = await supabaseClient();

    console.log("Supabase client created successfully");

    const { data, error } = await supabase.from("users").insert([
      {
        clerk_id: clerkUserId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
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

    console.log("User successfully inserted to Supabase:", data);
    return data;
  } catch (error) {
    console.error("Failed to insert user to Supabase - Full error:", error);
    throw error;
  }
};
