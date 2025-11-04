import { createClient, SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

// Return whether the browser-side Supabase envs are configured
export function isSupabaseBrowserConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Lightweight browser client helper — avoid importing server-only helpers in client code.
// If public envs are missing, return a safe noop-compatible object to avoid crashing
// the entire client app. UI can call `isSupabaseBrowserConfigured()` to render a
// friendly banner instead of attempting auth flows.
export function getSupabaseBrowserClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a lightweight noop client that exposes the minimal auth surface
    // used by the UI. This avoids throwing during render and lets UI show
    // a helpful error message instead.
    const noop: any = {
      auth: {
        signIn: async () => ({ error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: new Error('Supabase not configured') }),
        onAuthStateChange: () => ({ data: null }),
      },
    }
    return noop as SupabaseClient
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
