import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase-server"

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: string
  tenant_id: string
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createClient()

    // Get session from Supabase
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return null
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .eq("is_active", true)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      tenant_id: profile.tenant_id,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/api/health",
    "/api/docs",
  ]

  return publicRoutes.some((route) => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/admin",
    "/dashboard",
    "/profile",
    "/settings",
    "/tenant",
    "/crm",
    "/hrms",
    "/talent",
    "/finance",
  ]

  return protectedRoutes.some((route) => pathname.startsWith(route))
}
