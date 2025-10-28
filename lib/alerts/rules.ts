"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { z } from "zod"

const alertRuleSchema = z.object({
  metric: z.string(),
  op: z.enum(["<", ">", "<=", ">=", "=="]),
  threshold: z.number(),
  window: z.number(), // consecutive periods
  recipients: z.array(z.string().email()),
})

export async function saveAlertRule(input: z.infer<typeof alertRuleSchema>) {
  const parsed = alertRuleSchema.parse(input)
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant_id
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No tenant found")

  // Insert alert rule (stub - would need alerts.rules table)
  const rule = {
    tenant_id: member.tenant_id,
    metric: parsed.metric,
    op: parsed.op,
    threshold: parsed.threshold,
    window: parsed.window,
    recipients: parsed.recipients,
    created_by: user.id,
    created_at: new Date().toISOString(),
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "alert_rule.created",
    entity: "alert_rule",
    entityId: null,
    diff: rule,
  })

  return {
    success: true,
    rule,
  }
}

export async function deleteAlertRule(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant_id
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No tenant found")

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "alert_rule.deleted",
    entity: "alert_rule",
    entityId: id,
    diff: {},
  })

  return {
    success: true,
  }
}
