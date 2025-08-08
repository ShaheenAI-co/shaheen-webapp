import { supabaseClient } from "../../utils/supabaseClient"



export async function getBrands(token) {
  const supabase = supabaseClient(token)
  const { data, error } = await supabase.from('brands').select('*')
  if (error) throw error
  return data
}