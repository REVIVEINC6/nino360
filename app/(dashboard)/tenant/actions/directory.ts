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

export async function listMembers(tenant_id: string) {
  const s = supa()
  const { data, error } = await s
    .from("user_tenants")
    .select(
      `
      user_id,
      created_at,
      users:user_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("tenant_id", tenant_id)

  if (error) throw error

  return (
    data?.map((ut) => ({
      id: ut.users?.id,
      email: ut.users?.email,
      full_name: ut.users?.full_name,
      avatar_url: ut.users?.avatar_url,
      joined_at: ut.created_at,
    })) || []
  )
}
