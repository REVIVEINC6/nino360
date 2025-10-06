"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/auth/rbac"
import { createClient } from "@/lib/supabase/client"
import { hasPermission as rbacHasPermission, canAccessTenant as rbacCanAccessTenant } from "@/lib/auth/rbac"

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: UserRole | null
  status: string
  created_at: string
  updated_at: string
  tenant_id?: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<void>
  signInWithGoogle: () => Promise<void>
  hasPermission?: (permission: any) => boolean
  canAccessTenant?: (targetTenantId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("Fetching profile for user:", userId)

      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No profile found, will be created during initialization")
          return null
        }
        console.error("Error fetching profile:", error)
        return null
      }

      console.log("Profile fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const userProfile = await fetchUserProfile(user.id)
      setProfile(userProfile)
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log("Sign in successful:", data.user?.id)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      console.log("Sign up successful:", data.user?.id)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      console.log("Google sign in initiated")
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const initializeAuth = async () => {
    try {
      console.log("Initializing auth...")

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Error getting session:", sessionError)
        setLoading(false)
        return
      }

      if (session?.user) {
        console.log("Found existing session for user:", session.user.id)
        setUser(session.user)

        const userProfile = await fetchUserProfile(session.user.id)
        setProfile(userProfile)
      } else {
        console.log("No active session found")
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        const userProfile = await fetchUserProfile(session.user.id)
        setProfile(userProfile)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
        signIn,
        signUp,
        signInWithGoogle,
        // convenience accessors for permission checks
        hasPermission: (permission: any) => {
          if (!profile || !profile.role) return false
          return rbacHasPermission(profile.role as any, permission as any)
        },
        canAccessTenant: (targetTenantId: string) => {
          if (!profile || !profile.role) return false
          return rbacCanAccessTenant(profile.role as any, profile.tenant_id as any, targetTenantId)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
