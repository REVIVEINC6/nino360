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
    },
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
