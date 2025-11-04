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
 * Create an admin Supabase server client using the service role key.
 * Use this for trusted server-only operations that require elevated privileges
 * (for example, creating sessions via a SECURITY DEFINER RPC). This client
 * must never be exposed to the browser.
 */
export function createAdminServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    logger.error("Supabase service role environment variables are not configured", undefined, {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    })
    throw new Error(
      "Supabase service role environment variables are not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment.",
    )
  }

  // For admin client we don't need cookie handling
  return createSupabaseServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // noop - admin client does not set cookies
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
  // If there's an error or no user, attempt a server-side refresh using
  // the `sb-refresh-token` cookie. This helps when the Supabase access
  // token has expired but a valid refresh token exists in the browser.
  if (error || !user) {
    try {
      const cookieStore = await cookies()

      // Development fallback remains available
      if (process.env.NODE_ENV === "development" && process.env.DEV_FAKE_USER_ID) {
        logger.info("Using DEV_FAKE_USER fallback for getUser()")
        return {
          id: process.env.DEV_FAKE_USER_ID,
          email: process.env.DEV_FAKE_USER_EMAIL || "dev@example.com",
          user_metadata: { full_name: process.env.DEV_FAKE_USER_NAME || "Local Dev" },
        } as any
      }

      // Try to pick up refresh token from cookies
      const refreshCookie = cookieStore.get("sb-refresh-token")?.value
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

      if (refreshCookie && supabaseUrl && (supabaseAnonKey || supabaseServiceKey)) {
        // Prefer using the service role key for the Authorization header when available
        const authHeaderKey = supabaseServiceKey || supabaseAnonKey

        try {
          const resp = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              apikey: supabaseAnonKey || "",
              Authorization: `Bearer ${authHeaderKey}`,
            },
            body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshCookie as string }),
          })

          if (resp.ok) {
            const tokenData = await resp.json()
            const { access_token, refresh_token, expires_in } = tokenData as any

            // Set cookies so subsequent requests (and the Supabase SSR client)
            // will pick up the refreshed session. We set lightweight cookies
            // similar to how the client would set them.
            const isProd = process.env.NODE_ENV === "production"

            try {
              cookieStore.set("sb-access-token", access_token, {
                httpOnly: false,
                path: "/",
                sameSite: "lax",
                secure: isProd,
                expires: expires_in ? new Date(Date.now() + Number(expires_in) * 1000) : undefined,
              })

              cookieStore.set("sb-refresh-token", refresh_token, {
                httpOnly: false,
                path: "/",
                sameSite: "lax",
                secure: isProd,
              })
            } catch (setErr) {
              // ignore cookie set errors (Server Component contexts may not allow set)
            }

            // Propagate the refreshed session into the Supabase client so
            // subsequent auth calls return the correct user object.
            try {
              await supabase.auth.setSession({ access_token, refresh_token })
              const {
                data: { user: refreshedUser },
                error: refreshedErr,
              } = await supabase.auth.getUser()

              if (!refreshedErr && refreshedUser) return refreshedUser
            } catch (e) {
              // fall through to logging below
            }
          }
        } catch (e) {
          logger.warn("Failed to refresh Supabase session via token endpoint: " + ((e as any)?.message || String(e)))
        }
      }
    } catch (e) {
      logger.warn("Error while attempting session refresh: " + ((e as any)?.message || String(e)))
    }

    if (error) logger.error("Failed to get user", error)
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
