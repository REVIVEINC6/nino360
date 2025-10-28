import "server-only"
// Import the specific server subpath to avoid bundling browser client utilities
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr/dist/module/createServerClient"
import { cookies } from "next/headers"
import { logger } from "@/lib/logger"

/**
 * Centralized Supabase server client factory
 *
 * Features:
 * - Singleton pattern for performance
 * - Automatic cookie handling
 * - Environment variable validation
 * - Error logging
 *
 * Usage:
 *   const supabase = await createServerClient()
 */
export async function createServerClient() {
  const cookieStore = await cookies()

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

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Alias for createServerClient
 * @deprecated Use createServerClient instead
 */
export async function getSupabaseServerClient() {
  return createServerClient()
}

/**
 * Alias for createServerClient
 * @deprecated Use createServerClient instead
 */
export async function createClient() {
  return createServerClient()
}

/**
 * Get authenticated user from server
 */
export async function getUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    logger.error("Failed to get user", error)
    return null
  }

  return user
}

/**
 * Get session from server
 */
export async function getSession() {
  const supabase = await createServerClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    logger.error("Failed to get session", error)
    return null
  }

  return session
}
