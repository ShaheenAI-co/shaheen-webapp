import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "./supabaseClient";

export const getTodos = async ({userId, token}) => {
  const supabase = await supabaseClient(token);
  const { data: todo } = await supabase
    .from("todo")
    .select("*")
    .eq("u_id", userId);
  return todo;
};


