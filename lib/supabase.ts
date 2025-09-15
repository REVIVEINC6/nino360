import { createClient as createClientLib } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

// Mock Supabase client for demo mode
const mockSupabaseClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
}

export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClientLib(supabaseUrl, supabaseAnonKey)
  : (mockSupabaseClient as any)

// Compatibility export: many files import { createClient } from "@/lib/supabase"
// Provide a synchronous factory that returns the configured client (or mock)
export function createClient() {
  return supabase
}
