import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"

let client: SupabaseClient | null = null

/**
 * getSupabaseBrowserClient
 * - Browser-safe singleton wrapper around @supabase/supabase-js createClient
 * - Use this from client components that need supabase (realtime, auth, storage)
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error("Supabase environment variables are not configured", undefined, {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    })
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for the browser client")
  }

  client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "nino360-auth",
      flowType: "pkce",
    },
    global: {
      fetch: async (url: string | Request, options?: RequestInit) => {
        try {
          return await fetch(url, options)
        } catch (err) {
          console.error("Supabase fetch error:", err)
          return new Response(JSON.stringify({ error: "Network error" }), { status: 500, headers: { "Content-Type": "application/json" } })
        }
      },
    },
  })

  // safe no-op if not available
  try {
    client.auth.onAuthStateChange?.((event: any, session: any) => {
      // lightweight debugging
      console.log("[supabase] auth change", event, !!session)
    })
  } catch (e) {
    // ignore in environments where auth listeners fail
  }

  return client
}

// keep a small alias for existing code that used `createClient()`
export function createClient() {
  return getSupabaseBrowserClient()
}
