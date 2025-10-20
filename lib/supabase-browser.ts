import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase Browser (legacy) - URL exists:", !!supabaseUrl)
  console.log("[v0] Supabase Browser (legacy) - Key exists:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "nino360-auth",
      flowType: "pkce",
    },
    global: {
      fetch: async (url, options = {}) => {
        try {
          console.log("[v0] Supabase fetch (legacy):", url)
          const response = await fetch(url, options)
          console.log("[v0] Supabase fetch response (legacy):", response.status)
          return response
        } catch (error) {
          console.error("[v0] Supabase fetch error (legacy):", error)
          return new Response(JSON.stringify({ error: "Network error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        }
      },
    },
  })

  client.auth.onAuthStateChange((event, session) => {
    console.log("[v0] Auth state change (legacy):", event, "Session exists:", !!session)
  })

  return client
}
