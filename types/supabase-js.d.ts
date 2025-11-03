declare module "@supabase/supabase-js" {
  export type RealtimeChannel = {
    on: (event: string, opts: any, cb: (payload: any) => void) => RealtimeChannel
    subscribe: (cb?: (status: any) => void) => RealtimeChannel
    unsubscribe?: () => void
  }

  export interface SupabaseAuth {
    getUser: () => Promise<{ data?: any; error?: any }> 
    onAuthStateChange: (cb: (event: string, session: any) => void) => { data: any }
  }

  export interface SupabaseClient {
    channel: (name: string) => RealtimeChannel
    removeChannel?: (ch: any) => void
    auth: SupabaseAuth
    rpc: (fn: string, args?: any) => Promise<{ data?: any; error?: any }>
    from: (table: string) => any
    // allow indexing for scripts/helpers
    [key: string]: any
  }

  export function createClient(url: string, key: string, opts?: any): SupabaseClient
  export function createBrowserClient(url: string, key: string, opts?: any): SupabaseClient
  export function createServerClient(opts?: any): SupabaseClient

  export {};
}
