// Temporary augmentation to ensure SupabaseClient.auth is present and eases migration
declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    auth: any
  }
}
