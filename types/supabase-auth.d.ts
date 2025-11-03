import "@supabase/supabase-js"

declare module "@supabase/supabase-js" {
  // Minimal augmentation for browser auth helpers used in the app.
  interface SupabaseAuth {
    // signInWithPassword / signInWithOtp / signInWithOAuth are available on client
    signInWithPassword?: (opts: any) => Promise<any>
    signInWithOtp?: (opts: any) => Promise<any>
    signInWithOAuth?: (opts: any) => Promise<any>
    signOut?: () => Promise<any>
    onAuthStateChange?: (...args: any[]) => any
  }
}
