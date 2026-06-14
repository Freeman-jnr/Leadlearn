import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables')
}

/**
 * Client-side Supabase client
 * Use this in browser/frontend code
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
