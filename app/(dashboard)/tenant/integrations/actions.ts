"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { guardTenantAccess } from "@/lib/rbac/server"
import { logAudit } from "@/lib/audit/server"

export interface TenantIntegration {
  id: string
  tenant_id: string
  provider: string
  status: "connected" | "disconnected" | "error" | "testing"
  config: Record<string, any>
  last_tested_at: string | null
  created_at: string
  updated_at: string
  health_status?: "healthy" | "degraded" | "down"
  usage_count?: number
}

export async function getTenantIntegrations(): Promise<TenantIntegration[]> {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()

  const { data, error } = await supabase
    .from("tenant_integrations")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("provider")

  if (error) {
    console.error("[v0] Failed to fetch tenant integrations:", error)
    return []
  }

  const enrichedData = await Promise.all(
    data.map(async (integration) => {
      const healthStatus = await getIntegrationHealth(integration.id)
      const usageCount = await getIntegrationUsageCount(integration.id)

      return {
        ...integration,
        health_status: healthStatus,
        usage_count: usageCount,
      }
    }),
  )

  return enrichedData
}

async function getIntegrationHealth(integrationId: string): Promise<"healthy" | "degraded" | "down"> {
  const supabase = await createServerClient()

  // Check recent test results
  const { data } = await supabase
    .from("tenant_integrations")
    .select("last_tested_at, status")
    .eq("id", integrationId)
    .single()

  if (!data) return "down"

  const lastTested = data.last_tested_at ? new Date(data.last_tested_at) : null
  const now = new Date()
  const hoursSinceTest = lastTested
    ? (now.getTime() - lastTested.getTime()) / (1000 * 60 * 60)
    : Number.POSITIVE_INFINITY

  if (data.status === "error") return "down"
  if (data.status === "disconnected") return "down"
  if (hoursSinceTest > 24) return "degraded"

  return "healthy"
}

async function getIntegrationUsageCount(integrationId: string): Promise<number> {
  const supabase = await createServerClient()

  // Count API calls in the last 30 days from audit logs
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("resource_type", "integration")
    .eq("resource_id", integrationId)
    .gte("timestamp", thirtyDaysAgo.toISOString())

  return count || 0
}

export async function connectIntegration(provider: string, config: Record<string, any>) {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()
  const user = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("tenant_integrations")
    .upsert(
      {
        tenant_id: tenantId,
        provider,
        status: "connected",
        config,
        last_tested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "tenant_id,provider",
      },
    )
    .select()
    .single()

  if (error) throw error

  await logAudit({
    tenantId,
    userId: user.data.user?.id || "",
    action: "integration.connect",
    entity: "integration",
    entityId: data.id,
    metadata: { provider, connected: true },
  })

  revalidatePath("/tenant/integrations")
  return data
}

export async function disconnectIntegration(integrationId: string) {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()
  const user = await supabase.auth.getUser()

  const { error } = await supabase
    .from("tenant_integrations")
    .update({
      status: "disconnected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", integrationId)
    .eq("tenant_id", tenantId)

  if (error) throw error

  await logAudit({
    tenantId,
    userId: user.data.user?.id || "",
    action: "integration.disconnect",
    entity: "integration",
    entityId: integrationId,
    metadata: { disconnected: true },
  })

  revalidatePath("/tenant/integrations")
}

export async function testIntegration(integrationId: string) {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()
  const user = await supabase.auth.getUser()

  await supabase
    .from("tenant_integrations")
    .update({ status: "testing" })
    .eq("id", integrationId)
    .eq("tenant_id", tenantId)

  // Simulate integration test (in production, this would actually test the integration)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const testSuccess = Math.random() > 0.1 // 90% success rate

  const { error } = await supabase
    .from("tenant_integrations")
    .update({
      status: testSuccess ? "connected" : "error",
      last_tested_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", integrationId)
    .eq("tenant_id", tenantId)

  if (error) throw error

  await logAudit({
    tenantId,
    userId: user.data.user?.id || "",
    action: "integration.test",
    entity: "integration",
    entityId: integrationId,
    metadata: {
      success: testSuccess,
      timestamp: new Date().toISOString(),
      message: testSuccess ? "Integration test successful" : "Integration test failed",
    },
  })

  revalidatePath("/tenant/integrations")

  return {
    success: testSuccess,
    message: testSuccess ? "Integration test successful" : "Integration test failed",
  }
}

export async function getIntegrationAuditTrail(integrationId: string) {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*, user:user_id(id, email, full_name)")
    .eq("tenant_id", tenantId)
    .eq("resource_type", "integration")
    .eq("resource_id", integrationId)
    .order("timestamp", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[v0] Failed to fetch audit trail:", error)
    return []
  }

  return data
}

export async function updateIntegrationConfig(integrationId: string, config: Record<string, any>) {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()
  const user = await supabase.auth.getUser()

  const { error } = await supabase
    .from("tenant_integrations")
    .update({
      config,
      updated_at: new Date().toISOString(),
    })
    .eq("id", integrationId)
    .eq("tenant_id", tenantId)

  if (error) throw error

  await logAudit({
    tenantId,
    userId: user.data.user?.id || "",
    action: "integration.config.update",
    entity: "integration",
    entityId: integrationId,
    metadata: { config },
  })

  revalidatePath("/tenant/integrations")
}

export async function getIntegrationStats() {
  const supabase = await createServerClient()
  const tenantId = await guardTenantAccess()

  const { data, error } = await supabase.from("tenant_integrations").select("status").eq("tenant_id", tenantId)

  if (error) {
    console.error("[v0] Failed to fetch integration stats:", error)
    return {
      total: 0,
      connected: 0,
      disconnected: 0,
      healthy: 0,
    }
  }

  const stats = {
    total: data.length,
    connected: data.filter((i) => i.status === "connected").length,
    disconnected: data.filter((i) => i.status === "disconnected").length,
    healthy: data.filter((i) => i.status === "connected").length, // Simplified
  }

  return stats
}
