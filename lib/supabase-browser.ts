import { createClient, SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

// Lightweight browser client helper — avoid importing server-only helpers in client code.
export function getSupabaseBrowserClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)")
  }

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "nino360-auth",
      flowType: "pkce",
    },
  })

  // Optional: monitor auth changes in development
  try {
    // @ts-ignore - onAuthStateChange sometimes has different signatures across versions
    client.auth.onAuthStateChange?.((event: any, session: any) => {
      console.log("[v0] Supabase auth change:", event, !!session)
    })
  } catch (e) {
    /* ignore */
  }

  return client
}
