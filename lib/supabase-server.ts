import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Mock server client for demo mode
const mockServerClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
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

// Synchronous factory used across the codebase. Returns a mock client when
// Supabase environment variables are missing so Next's build/time imports
// don't throw. When a cookieStore is provided (or available via next/headers),
// we create a server client wired to that cookie store.
export function createClient(cookieStore?: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mockServerClient as any
  }

  const store = cookieStore ?? cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          store.set({ name, value, ...options })
        } catch (error) {
          // ignore cookie set errors during build
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          store.set({ name, value: "", ...options })
        } catch (error) {
          // ignore cookie remove errors during build
        }
      },
    },
  })
}

// Backwards-compatible named export used in some helpers
export { createClient as createServerSupabaseClient }
