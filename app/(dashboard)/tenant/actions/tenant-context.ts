"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const supa = () => {
  const c = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k) => c.get(k)?.value,
    },
  })
}

export async function getCurrentTenant() {
  const s = supa()

  // Get current user
  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) return null

  // Get user's tenants
  const { data: userTenants } = await s
    .from("user_tenants")
    .select(`
      tenant_id,
      tenants:tenant_id (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", user.id)
    .limit(1)
    .single()

  return userTenants?.tenants || null
}

export async function getUserTenants() {
  const s = supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) return []

  const { data } = await s
    .from("user_tenants")
    .select(`
      tenant_id,
      tenants:tenant_id (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", user.id)

  return data?.map((ut) => ut.tenants).filter(Boolean) || []
}
