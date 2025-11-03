"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function listMembers(tenant_id: string) {
  const s = await createServerClient()
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
    data?.map((ut: any) => ({
      id: ut.users?.id,
      email: ut.users?.email,
      full_name: ut.users?.full_name,
      avatar_url: ut.users?.avatar_url,
      joined_at: ut.created_at,
    })) || []
  )
}
