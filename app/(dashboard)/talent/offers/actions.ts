"use server"

import { createClient } from "@/lib/supabase/server"
import { createAuditLog } from "@/lib/audit/hash-chain"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// ============================================================================
// Validation Schemas
// ============================================================================

const CompSchema = z.object({
  base: z.number().min(0),
  bonus: z.number().min(0).optional(),
  equity: z.string().optional(),
  currency: z.string().default("USD"),
})

const OfferDraftSchema = z.object({
  application_id: z.string().uuid().optional(),
  requisition_id: z.string().uuid().optional(),
  template_id: z.string().uuid().optional(),
  comp: CompSchema.optional(),
  perks: z.record(z.any()).optional(),
  valid_days: z.number().min(1).max(365).default(14),
})

const OfferUpdateSchema = z.object({
  comp: CompSchema.optional(),
  perks: z.record(z.any()).optional(),
  notes: z.string().optional(),
  valid_until: z.string().optional(),
  template_body_md: z.string().optional(),
})

const TemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(120),
  description: z.string().optional(),
  body_md: z.string().min(10),
  shared: z.boolean().default(true),
})

const SignerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["candidate", "hr", "hm"]),
})

// ============================================================================
// Context & Lists
// ============================================================================

export async function getContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Get tenant
  const { data: member } = await supabase
    .from("tenant_members")
    .select("tenant_id, tenant:tenants(name, settings)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!member) throw new Error("No active tenant")

  const tenantId = member.tenant_id
  const settings = (member.tenant as any)?.settings || {}

  // Get templates
  const { data: templates } = await supabase
    .from("offer_templates")
    .select("id, name, description, variables")
    .eq("tenant_id", tenantId)
    .eq("shared", true)
    .order("name")

  // Get potential approvers (users with talent.manage permission)
  const { data: approvers } = await supabase
    .from("users")
    .select("id, full_name, email")
    .eq("tenant_id", tenantId)
    .limit(100)

  return {
    tenantId,
    tz: settings.timezone || "UTC",
    features: {
      copilot: settings.features?.copilot || false,
      esign: settings.features?.esign || false,
      audit: true,
    },
    templates: templates || [],
    approvers: approvers || [],
    defaultValidDays: 14,
  }
}

// ============================================================================
// Templates
// ============================================================================

export async function listTemplates(q?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  let query = supabase.from("offer_templates").select("*").eq("tenant_id", member.tenant_id).order("name")

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}

export async function upsertTemplate(input: z.infer<typeof TemplateSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const validated = TemplateSchema.parse(input)

  // Extract variables from body_md
  const variableRegex = /\{\{([^}]+)\}\}/g
  const variables = Array.from(validated.body_md.matchAll(variableRegex)).map((m) => m[1].trim())

  const payload = {
    ...validated,
    tenant_id: member.tenant_id,
    variables,
    created_by: user.id,
  }

  let result
  if (validated.id) {
    const { data, error } = await supabase
      .from("offer_templates")
      .update(payload)
      .eq("id", validated.id)
      .eq("tenant_id", member.tenant_id)
      .select()
      .single()

    if (error) throw error
    result = data
  } else {
    const { data, error } = await supabase.from("offer_templates").insert(payload).select().single()

    if (error) throw error
    result = data
  }

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: validated.id ? "offer:template:update" : "offer:template:create",
    entity: "offer_template",
    entityId: result.id,
    metadata: { name: validated.name },
  })

  revalidatePath("/talent/offers")

  return result
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { error } = await supabase.from("offer_templates").delete().eq("id", id).eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:template:delete",
    entity: "offer_template",
    entityId: id,
  })

  revalidatePath("/talent/offers")
}

// ============================================================================
// Draft & Versioning
// ============================================================================

export async function createOfferDraft(input: z.infer<typeof OfferDraftSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const validated = OfferDraftSchema.parse(input)

  // Generate offer number
  const { data: numberData } = await supabase.rpc("generate_offer_number", {
    p_tenant_id: member.tenant_id,
  })

  const offerNumber = numberData || `OFR-${Date.now()}`

  // Prefill comp from requisition if available
  let comp = validated.comp || { base: 0, currency: "USD" }
  if (validated.requisition_id) {
    const { data: req } = await supabase
      .from("requisitions")
      .select("salary_range")
      .eq("id", validated.requisition_id)
      .single()

    if (req?.salary_range) {
      comp = {
        base: req.salary_range.min || 0,
        bonus: 0,
        currency: req.salary_range.currency || "USD",
      }
    }
  }

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + validated.valid_days)

  const { data: offer, error } = await supabase
    .from("offers")
    .insert({
      tenant_id: member.tenant_id,
      application_id: validated.application_id,
      requisition_id: validated.requisition_id,
      number: offerNumber,
      version: 1,
      status: "draft",
      comp,
      perks: validated.perks || {},
      valid_until: validUntil.toISOString().split("T")[0],
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer.id,
    type: "created",
    actor: user.id,
    meta: { template_id: validated.template_id },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:create",
    entity: "offer",
    entityId: offer.id,
    metadata: { number: offerNumber, application_id: validated.application_id },
  })

  revalidatePath("/talent/offers")

  return offer
}

export async function updateOffer(id: string, patch: z.infer<typeof OfferUpdateSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const validated = OfferUpdateSchema.parse(patch)

  // Get current offer
  const { data: current } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", member.tenant_id)
    .single()

  if (!current) throw new Error("Offer not found")

  // Check if major changes (increment version)
  const majorChange = validated.comp || validated.template_body_md
  const newVersion = majorChange ? current.version + 1 : current.version

  // Calculate diff
  const diff: Record<string, any> = {}
  if (validated.comp) diff.comp = { old: current.comp, new: validated.comp }
  if (validated.perks) diff.perks = { old: current.perks, new: validated.perks }
  if (validated.notes) diff.notes = { old: current.notes, new: validated.notes }

  // Update offer
  const { data: updated, error } = await supabase
    .from("offers")
    .update({
      ...validated,
      version: newVersion,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", member.tenant_id)
    .select()
    .single()

  if (error) throw error

  // Create version record if major change
  if (majorChange) {
    await supabase.from("offer_versions").insert({
      tenant_id: member.tenant_id,
      offer_id: id,
      version: newVersion,
      diff,
      created_by: user.id,
    })

    await supabase.from("offer_events").insert({
      tenant_id: member.tenant_id,
      offer_id: id,
      type: "versioned",
      actor: user.id,
      meta: { version: newVersion },
    })
  }

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:update",
    entity: "offer",
    entityId: id,
    metadata: { version: newVersion },
    diff,
  })

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${id}`)

  return updated
}

// ============================================================================
// Approvals
// ============================================================================

export async function requestApproval(offer_id: string, approver_ids: string[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  if (approver_ids.length === 0) throw new Error("At least one approver required")

  // Create approval records
  const approvals = approver_ids.map((approver_id) => ({
    approver_id,
    status: "pending",
    requested_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("offers")
    .update({
      status: "awaiting_approval",
      approvers: approver_ids,
      approvals,
    })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: "requested_approval",
    actor: user.id,
    meta: { approver_ids },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:approval:request",
    entity: "offer",
    entityId: offer_id,
    metadata: { approver_ids },
  })

  // TODO: Send notifications to approvers

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${offer_id}`)
}

export async function setApproval(
  offer_id: string,
  approver_id: string,
  decision: "approved" | "rejected",
  comment?: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  // Get current offer
  const { data: offer } = await supabase
    .from("offers")
    .select("approvals, approvers")
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)
    .single()

  if (!offer) throw new Error("Offer not found")

  // Update approvals array
  const approvals = (offer.approvals as any[]) || []
  const approvalIndex = approvals.findIndex((a) => a.approver_id === approver_id)

  if (approvalIndex === -1) throw new Error("Not an approver")

  approvals[approvalIndex] = {
    ...approvals[approvalIndex],
    status: decision,
    comment,
    decided_at: new Date().toISOString(),
  }

  // Check if all approved
  const allApproved = approvals.every((a) => a.status === "approved")
  const anyRejected = approvals.some((a) => a.status === "rejected")

  const newStatus = anyRejected ? "draft" : allApproved ? "approved" : "awaiting_approval"

  const { error } = await supabase
    .from("offers")
    .update({
      approvals,
      status: newStatus,
    })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: decision,
    actor: user.id,
    meta: { comment },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: `offer:approval:${decision}`,
    entity: "offer",
    entityId: offer_id,
    metadata: { approver_id, comment },
  })

  // TODO: Send notification to offer creator

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${offer_id}`)
}

// ============================================================================
// PDF, Send & Track
// ============================================================================

export async function renderOfferPdf(offer_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  // Get offer with related data
  const { data: offer } = await supabase
    .from("offers")
    .select("*, application:applications(*, candidate:candidates(*), requisition:requisitions(*))")
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)
    .single()

  if (!offer) throw new Error("Offer not found")

  // TODO: Render markdown to HTML to PDF
  // For now, simulate PDF generation
  const pdfPath = `exports/offers/${offer_id}-v${offer.version}.pdf`

  const { error } = await supabase
    .from("offers")
    .update({ pdf_path: pdfPath })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create version record
  await supabase.from("offer_versions").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    version: offer.version,
    diff: {},
    pdf_path: pdfPath,
    created_by: user.id,
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:pdf",
    entity: "offer",
    entityId: offer_id,
    metadata: { pdf_path: pdfPath },
  })

  revalidatePath(`/talent/offers/${offer_id}`)

  return { pdf_path: pdfPath }
}

export async function sendOffer(offer_id: string, to_email: string, via: "email" | "esign" = "email") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { error } = await supabase
    .from("offers")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: "sent",
    actor: user.id,
    meta: { to_email, via },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:send",
    entity: "offer",
    entityId: offer_id,
    metadata: { to_email, via },
  })

  // TODO: Send actual email with PDF attachment

  if (via === "esign") {
    // Initiate e-sign flow
    await requestSignature(offer_id, [{ name: "Candidate", email: to_email, role: "candidate" }])
  }

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${offer_id}`)
}

// ============================================================================
// E-Sign (stub)
// ============================================================================

export async function requestSignature(offer_id: string, signers: z.infer<typeof SignerSchema>[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  // Validate signers
  const validatedSigners = signers.map((s) => SignerSchema.parse(s))

  // Stub: Create signer payload (in production, call DocuSign/HelloSign API)
  const signerPayload = {
    provider: "docusign",
    envelope_id: `stub-${Date.now()}`,
    signers: validatedSigners.map((s, i) => ({
      ...s,
      signer_id: `signer-${i}`,
      status: "pending",
    })),
  }

  const { error } = await supabase
    .from("offers")
    .update({
      signer_payload: signerPayload,
    })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: "signed",
    actor: user.id,
    meta: { signers: validatedSigners },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:esign:request",
    entity: "offer",
    entityId: offer_id,
    metadata: { signers: validatedSigners },
  })

  revalidatePath(`/talent/offers/${offer_id}`)

  return signerPayload
}

export async function pollSignerStatus(offer_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  // Get current signer payload
  const { data: offer } = await supabase
    .from("offers")
    .select("signer_payload")
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)
    .single()

  if (!offer) throw new Error("Offer not found")

  // Stub: In production, poll DocuSign/HelloSign API
  // For now, simulate all signed
  const signerPayload = offer.signer_payload as any
  const allSigned = signerPayload?.signers?.every((s: any) => s.status === "signed")

  if (allSigned) {
    const signedPdfPath = `exports/offers/${offer_id}-signed.pdf`

    await supabase
      .from("offers")
      .update({
        status: "accepted",
        signed_pdf_path: signedPdfPath,
        accepted_at: new Date().toISOString(),
      })
      .eq("id", offer_id)
      .eq("tenant_id", member.tenant_id)

    // Create event
    await supabase.from("offer_events").insert({
      tenant_id: member.tenant_id,
      offer_id: offer_id,
      type: "accepted",
      meta: { signed_pdf_path: signedPdfPath },
    })

    // Audit log
    await createAuditLog({
      tenantId: member.tenant_id,
      userId: user.id,
      action: "offer:esign:complete",
      entity: "offer",
      entityId: offer_id,
      metadata: { signed_pdf_path: signedPdfPath },
    })

    revalidatePath("/talent/offers")
    revalidatePath(`/talent/offers/${offer_id}`)
  }

  return signerPayload
}

// ============================================================================
// Accept/Decline/Expire
// ============================================================================

export async function acceptOffer(offer_id: string, candidate_id?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { error } = await supabase
    .from("offers")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: "accepted",
    actor: user.id,
    meta: { candidate_id },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:accepted",
    entity: "offer",
    entityId: offer_id,
    metadata: { candidate_id },
  })

  // TODO: Create hire pipeline / onboarding handoff

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${offer_id}`)
}

export async function declineOffer(offer_id: string, reason?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { error } = await supabase
    .from("offers")
    .update({ status: "declined" })
    .eq("id", offer_id)
    .eq("tenant_id", member.tenant_id)

  if (error) throw error

  // Create event
  await supabase.from("offer_events").insert({
    tenant_id: member.tenant_id,
    offer_id: offer_id,
    type: "declined",
    actor: user.id,
    meta: { reason },
  })

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:declined",
    entity: "offer",
    entityId: offer_id,
    metadata: { reason },
  })

  revalidatePath("/talent/offers")
  revalidatePath(`/talent/offers/${offer_id}`)
}

export async function expireOffersJob() {
  const supabase = await createClient()

  // Find expired offers
  const { data: expired } = await supabase
    .from("offers")
    .select("id, tenant_id")
    .in("status", ["sent", "viewed"])
    .lt("valid_until", new Date().toISOString().split("T")[0])

  if (!expired || expired.length === 0) return

  for (const offer of expired) {
    await supabase.from("offers").update({ status: "expired" }).eq("id", offer.id)

    await supabase.from("offer_events").insert({
      tenant_id: offer.tenant_id,
      offer_id: offer.id,
      type: "expired",
      meta: { auto: true },
    })

    await createAuditLog({
      tenantId: offer.tenant_id,
      userId: "system",
      action: "offer:expired",
      entity: "offer",
      entityId: offer.id,
      metadata: { auto: true },
    })
  }

  return { expired: expired.length }
}

// ============================================================================
// Bulk Ops
// ============================================================================

export async function bulkCreateOffers(
  inputs: Array<{
    application_id: string
    requisition_id: string
    template_id?: string
    comp?: any
    valid_days?: number
  }>,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  if (inputs.length > 200) throw new Error("Maximum 200 offers per bulk operation")

  const results = []

  for (const input of inputs) {
    try {
      const offer = await createOfferDraft(input)
      results.push({ success: true, offer_id: offer.id })
    } catch (error) {
      results.push({ success: false, error: (error as Error).message })
    }
  }

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:bulk_create",
    entity: "offer",
    entityId: "bulk",
    metadata: { count: inputs.length, results },
  })

  revalidatePath("/talent/offers")

  return results
}

// ============================================================================
// Exports & Analytics
// ============================================================================

export async function exportOffersCsv(params: { status?: string; from?: string; to?: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  let query = supabase
    .from("offers")
    .select("*, application:applications(*, candidate:candidates(*), requisition:requisitions(*))")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50000)

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.from) {
    query = query.gte("created_at", params.from)
  }

  if (params.to) {
    query = query.lte("created_at", params.to)
  }

  const { data, error } = await query

  if (error) throw error

  // TODO: Convert to CSV and upload to storage
  const csvPath = `exports/offers/offers-${Date.now()}.csv`

  // Audit log
  await createAuditLog({
    tenantId: member.tenant_id,
    userId: user.id,
    action: "offer:export",
    entity: "offer",
    entityId: "export",
    metadata: { count: data?.length || 0, params },
  })

  return { csv_path: csvPath, count: data?.length || 0 }
}

export async function getOfferAnalytics(params: { from?: string; to?: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  let query = supabase.from("offers").select("*").eq("tenant_id", member.tenant_id)

  if (params.from) {
    query = query.gte("created_at", params.from)
  }

  if (params.to) {
    query = query.lte("created_at", params.to)
  }

  const { data: offers } = await query

  if (!offers) return null

  // Calculate metrics
  const total = offers.length
  const accepted = offers.filter((o) => o.status === "accepted").length
  const declined = offers.filter((o) => o.status === "declined").length
  const expired = offers.filter((o) => o.status === "expired").length
  const pending = offers.filter((o) => o.status === "sent" || o.status === "viewed").length

  const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0

  // Time to offer (from created to sent)
  const sentOffers = offers.filter((o) => o.sent_at)
  const timeToOfferDays =
    sentOffers.length > 0
      ? sentOffers.reduce((sum, o) => {
          const created = new Date(o.created_at).getTime()
          const sent = new Date(o.sent_at).getTime()
          return sum + (sent - created) / (1000 * 60 * 60 * 24)
        }, 0) / sentOffers.length
      : 0

  // Avg comp by band
  const compByBand: Record<string, { count: number; total: number }> = {}
  offers.forEach((o) => {
    const band = (o as any).band || "unknown"
    const base = (o.comp as any)?.base || 0
    if (!compByBand[band]) {
      compByBand[band] = { count: 0, total: 0 }
    }
    compByBand[band].count++
    compByBand[band].total += base
  })

  const avgCompByBand = Object.entries(compByBand).map(([band, data]) => ({
    band,
    avg: data.total / data.count,
  }))

  // Expiring soon (within 7 days)
  const today = new Date()
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const expiringSoonCount = offers.filter((o) => {
    if (!o.valid_until || o.status !== "sent") return false
    const validUntil = new Date(o.valid_until)
    return validUntil >= today && validUntil <= sevenDaysFromNow
  }).length

  return {
    total,
    accepted,
    declined,
    expired,
    pending,
    acceptanceRate,
    timeToOfferAvgDays: Math.round(timeToOfferDays * 10) / 10,
    avgCompByBand,
    expiringSoonCount,
  }
}

// ============================================================================
// Audit Verify
// ============================================================================

export async function getAuditMini(limit = 10) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .like("action", "offer:%")
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}

export async function verifyHash(hash: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("audit_log").select("*").eq("hash", hash).single()

  if (!data) return { valid: false, message: "Hash not found" }

  // TODO: Verify hash chain integrity
  return { valid: true, entry: data }
}

// ============================================================================
// List Offers
// ============================================================================

export async function listOffers(params?: {
  status?: string
  requisition_id?: string
  recruiter_id?: string
  from?: string
  to?: string
  q?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  let query = supabase
    .from("offers")
    .select("*, application:applications(*, candidate:candidates(*), requisition:requisitions(*))")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })

  if (params?.status) {
    query = query.eq("status", params.status)
  }

  if (params?.requisition_id) {
    query = query.eq("requisition_id", params.requisition_id)
  }

  if (params?.from) {
    query = query.gte("created_at", params.from)
  }

  if (params?.to) {
    query = query.lte("created_at", params.to)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}

export async function getOffer(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No active tenant")

  const { data, error } = await supabase
    .from("offers")
    .select(
      "*, application:applications(*, candidate:candidates(*), requisition:requisitions(*)), versions:offer_versions(*), events:offer_events(*)",
    )
    .eq("id", id)
    .eq("tenant_id", member.tenant_id)
    .single()

  if (error) throw error

  return data
}

export async function getOfferDetail(id: string) {
  try {
    const data = await getOffer(id)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
