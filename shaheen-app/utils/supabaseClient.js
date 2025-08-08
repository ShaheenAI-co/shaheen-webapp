// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseClient = (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Only set auth if token is provided and valid
  if (supabaseAccessToken && supabaseAccessToken.split('.').length === 3) {
    supabase.auth.setAuth(supabaseAccessToken)
  }
  
  return supabase
}