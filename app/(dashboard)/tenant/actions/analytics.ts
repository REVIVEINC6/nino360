"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getUsage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) return null

  const tenantId = membership.tenant_id

  // Get doc count
  const { count: docsCount } = await supabase
    .from("docs")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)

  // Get thread count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: threadsCount } = await supabase
    .from("threads")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Get message count (last 30 days)
  const { data: threads } = await supabase.from("threads").select("id").eq("tenant_id", tenantId)

  const threadIds = threads?.map((t) => t.id) || []

  const { count: messagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("thread_id", threadIds)
    .gte("created_at", thirtyDaysAgo.toISOString())

  return {
    docs: docsCount || 0,
    threads: threadsCount || 0,
    messages: messagesCount || 0,
  }
}
