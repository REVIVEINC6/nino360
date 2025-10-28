"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const supa = async () => {
  const c = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k: string) => c.get(k)?.value,
    },
  })
}

export async function getCurrentTenant() {
  const s = await supa()

  // Get current user
    const userRes = (await s.auth.getUser()) as any
    const user = userRes?.data?.user ?? null
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
  const s = await supa()

    const userRes = (await s.auth.getUser()) as any
    const user = userRes?.data?.user ?? null
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

  return data?.map((ut: any) => ut.tenants).filter(Boolean) || []
}
