import { createBrowserClient } from "@supabase/ssr"
import { logger } from "@/lib/logger"

let client: ReturnType<typeof createBrowserClient> | null = null

/**
 * Centralized Supabase browser client factory
 *
 * Features:
 * - Singleton pattern (one client per browser session)
 * - Automatic session persistence
 * - Environment variable validation
 * - Error logging
 *
 * Usage:
 *   const supabase = getSupabaseBrowserClient()
 */
export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase Browser Client - URL exists:", !!supabaseUrl)
  console.log("[v0] Supabase Browser Client - Key exists:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error("Supabase environment variables are not configured", undefined, {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    })
    throw new Error(
      "Supabase environment variables are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
    )
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Add storage key to avoid conflicts
      storageKey: "nino360-auth",
      // Add flow type for better compatibility
      flowType: "pkce",
    },
    global: {
      // Add custom fetch with error handling
      fetch: async (url, options = {}) => {
        try {
          console.log("[v0] Supabase fetch:", url)
          const response = await fetch(url, options)
          console.log("[v0] Supabase fetch response:", response.status)
          return response
        } catch (error) {
          console.error("[v0] Supabase fetch error:", error)
          // Return a mock response to prevent the error from propagating
          return new Response(JSON.stringify({ error: "Network error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        }
      },
    },
  })

  client.auth.onAuthStateChange((event, session) => {
    console.log("[v0] Auth state change:", event, "Session exists:", !!session)
  })

  return client
}

/**
 * Alias for getSupabaseBrowserClient
 * @deprecated Use getSupabaseBrowserClient instead
 */
export function createClient() {
  return getSupabaseBrowserClient()
}

export { createBrowserClient }
