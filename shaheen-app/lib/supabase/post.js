import { supabaseClient } from "../../utils/supabaseClient"

export async function getPosts({userId , token}) {
  const supabase = supabaseClient(token)
  let query = supabase.from('posts').select('*').eq('user_id', userId)
  //if (userId) query = query.eq('user_id', userId)
  const { data, error } = await query
  if (error) throw error
  return data
}
