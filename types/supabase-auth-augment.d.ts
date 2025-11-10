// Temporary augmentation for @supabase/supabase-js auth methods used in code
declare module '@supabase/supabase-js' {
  export interface SupabaseAuth {
    signUp?: (...args: any[]) => Promise<any>
    signInWithOtp?: (...args: any[]) => Promise<any>
    signInWithOAuth?: (...args: any[]) => Promise<any>
    signIn?: (...args: any[]) => Promise<any>
    // Add other common methods as optional to reduce 'possibly undefined' errors
  }
}
