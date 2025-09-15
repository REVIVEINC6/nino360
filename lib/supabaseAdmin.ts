import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// If environment variables are missing during build (CI/local without secrets),
// export a harmless mock admin client to avoid throwing during Next's page-data
// collection. At runtime with proper env vars, the real client will be used.
let supabaseAdmin: any
if (!supabaseUrl || !supabaseServiceKey) {
  // lightweight mock implementation covering common usages in the codebase
  supabaseAdmin = {
    from: (_table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    rpc: async () => ({ data: null, error: null }),
    functions: { invoke: async () => ({ data: null, error: null }) },
    auth: {
      // minimal auth surface used in some helpers
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    channel: (_name: string) => ({ subscribe: async () => ({}) }),
  }
} else {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export { supabaseAdmin }
export default supabaseAdmin
