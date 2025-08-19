// utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase Client Config:", {
  supabaseUrl: supabaseUrl ? "SET" : "NOT SET",
  supabaseAnonKey: supabaseAnonKey ? "SET" : "NOT SET",
  env: process.env.NODE_ENV,
});

export const supabaseClient = (supabaseAccessToken) => {
  console.log(
    "Creating Supabase client with token:",
    supabaseAccessToken ? "PROVIDED" : "NOT PROVIDED"
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      supabaseUrl,
      supabaseAnonKey,
    });
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Only set auth if token is provided and valid
  if (supabaseAccessToken && supabaseAccessToken.split(".").length === 3) {
    console.log("Setting auth token on Supabase client");
    supabase.auth.setAuth(supabaseAccessToken);
  } else {
    console.log("No valid auth token provided, using anonymous access");
  }

  return supabase;
};
