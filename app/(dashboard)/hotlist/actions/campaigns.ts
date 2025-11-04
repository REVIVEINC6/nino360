"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit/server"
import { requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { hotlistCampaignSchema, type HotlistCampaignInput } from "@/lib/hotlist/validators"

/**
 * Create campaign
 */
export async function createCampaign(input: HotlistCampaignInput) {
  await requirePermission(PERMISSIONS.HOTLIST_CAMPAIGNS_CREATE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const body = hotlistCampaignSchema.parse(input)

  const { data, error } = await supabase
    .from("bench.hotlist_campaigns")
    .insert({
      ...body,
      tenant_id: tenantId,
      created_by: user.id,
      total_recipients: body.recipient_emails?.length || 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.campaign.created",
    entity: "hotlist_campaign",
    entityId: data.id,
    metadata: { name: body.name, type: body.type },
  })

  revalidatePath("/hotlist")
  return data
}

/**
 * Get campaigns
 */
export async function getCampaigns(filters?: { status?: string; requirement_id?: string }) {
  await requirePermission(PERMISSIONS.HOTLIST_CAMPAIGNS_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  let query = supabase
    .from("bench.hotlist_campaigns")
    .select(
      `
      *,
      requirement:bench.hotlist_requirements(id, title),
      created_by_user:core.users!created_by(id, email, full_name)
    `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.requirement_id) query = query.eq("requirement_id", filters.requirement_id)

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data || []
}

/**
 * Send campaign (enqueue messages)
 */
export async function sendCampaign(campaignId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_CAMPAIGNS_SEND)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  // Get campaign
  const { data: campaign } = await supabase
    .from("bench.hotlist_campaigns")
    .select("*")
    .eq("id", campaignId)
    .eq("tenant_id", tenantId)
    .single()

  if (!campaign) throw new Error("Campaign not found")

  // Create messages for each recipient
  const messages = (campaign.recipient_emails || []).map((email: string) => ({
    tenant_id: tenantId,
    campaign_id: campaignId,
    recipient_email: email,
    subject: campaign.subject,
    body: campaign.body,
    channel: campaign.channel,
    status: "queued",
  }))

  if (messages.length > 0) {
    const { error: messagesError } = await supabase.from("bench.hotlist_messages").insert(messages)

    if (messagesError) throw new Error(messagesError.message)
  }

  // Update campaign status
  const { data, error } = await supabase
    .from("bench.hotlist_campaigns")
    .update({
      status: "sending",
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.campaign.sent",
    entity: "hotlist_campaign",
    entityId: campaignId,
    metadata: { messages_queued: messages.length },
  })

  revalidatePath("/hotlist")
  return data
}

/**
 * Get campaign status
 */
export async function getCampaignStatus(campaignId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_CAMPAIGNS_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data: campaign } = await supabase
    .from("bench.hotlist_campaigns")
    .select("*")
    .eq("id", campaignId)
    .eq("tenant_id", tenantId)
    .single()

  if (!campaign) throw new Error("Campaign not found")

  // Get message stats
  const { data: messages } = await supabase
    .from("bench.hotlist_messages")
    .select("status")
    .eq("campaign_id", campaignId)
    .eq("tenant_id", tenantId)

  const stats = {
    total: messages?.length || 0,
    queued: messages?.filter((m) => m.status === "queued").length || 0,
    sending: messages?.filter((m) => m.status === "sending").length || 0,
    sent: messages?.filter((m) => m.status === "sent").length || 0,
    delivered: messages?.filter((m) => m.status === "delivered").length || 0,
    bounced: messages?.filter((m) => m.status === "bounced").length || 0,
    failed: messages?.filter((m) => m.status === "failed").length || 0,
  }

  return {
    campaign,
    stats,
  }
}

export async function getAutomationRules() {
  await requirePermission(PERMISSIONS.HOTLIST_AUTOMATION_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_automation_rules")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

export async function createAutomationRule(input: {
  name: string
  description?: string
  trigger_type: string
  trigger_conditions: any
  actions: any[]
  is_active?: boolean
}) {
  await requirePermission(PERMISSIONS.HOTLIST_AUTOMATION_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_automation_rules")
    .insert({
      ...input,
      tenant_id: tenantId,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.automation.rule_created",
    entity: "hotlist_automation_rule",
    entityId: data.id,
    metadata: { name: input.name },
  })

  revalidatePath("/hotlist/automation")
  return data
}

export async function toggleAutomationRule(ruleId: string, isActive: boolean) {
  await requirePermission(PERMISSIONS.HOTLIST_AUTOMATION_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_automation_rules")
    .update({ is_active: isActive })
    .eq("id", ruleId)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: `hotlist.automation.rule_${isActive ? "enabled" : "disabled"}`,
    entity: "hotlist_automation_rule",
    entityId: ruleId,
    metadata: { is_active: isActive },
  })

  revalidatePath("/hotlist/automation")
  return data
}

export async function deleteAutomationRule(ruleId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_AUTOMATION_MANAGE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { error } = await supabase
    .from("bench.hotlist_automation_rules")
    .delete()
    .eq("id", ruleId)
    .eq("tenant_id", tenantId)

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.automation.rule_deleted",
    entity: "hotlist_automation_rule",
    entityId: ruleId,
  })

  revalidatePath("/hotlist/automation")
  return { success: true }
}
