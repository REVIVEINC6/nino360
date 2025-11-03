// Temporary shim: relax supabase-js client/auth types to reduce noisy diagnostics during triage
// TODO: replace with precise augmentation once we finish typing migration
declare module '@supabase/supabase-js' {
  // Make core exported types permissive for now
  export type SupabaseClient = any
  export type SupabaseAuth = any
  export function createClient(...args: any[]): SupabaseClient
}
