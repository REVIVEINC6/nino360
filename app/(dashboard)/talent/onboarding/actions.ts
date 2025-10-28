"use server"

import { createClient } from "@/lib/supabase/server"
import { logAudit } from "@/lib/audit/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const convertOfferSchema = z.object({
  offer_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hire_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  manager_id: z.string().uuid().optional(),
  location: z.string().optional(),
  region: z.string().optional(),
})

const checklistSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  scope: z.record(z.any()).optional(),
  items: z.array(
    z.object({
      key: z.string().regex(/^[a-z0-9_]+$/),
      label: z.string().min(2).max(120),
      description: z.string().optional(),
      kind: z.enum(["task", "form", "approval", "training", "provision"]),
      owner_role: z.string(),
      due_days: z.number().int().min(0),
      sla_hours: z.number().int().min(0),
      meta: z.record(z.any()).optional(),
    }),
  ),
})

const taskSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]+$/),
  label: z.string().min(2).max(120),
  description: z.string().optional(),
  kind: z.enum(["task", "form", "approval", "training", "provision"]),
  owner_id: z.string().uuid().optional(),
  owner_role: z.string().optional(),
  due_at: z.string().optional(),
  meta: z.record(z.any()).optional(),
})

const formSchema = z.object({
  form_key: z.enum(["i9", "tax_w4", "nda", "bank_setup", "emergency_contact"]),
  form_name: z.string(),
  data: z.record(z.any()),
  signed_by: z.string().optional(),
  storage_key: z.string().optional(),
})

// ============================================================================
// CONTEXT & LISTS
// ============================================================================

export async function getContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get tenant from RLS context
  const { data: tenant } = await supabase.from("tenants").select("id, name, timezone, settings").single()

  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  return {
    success: true,
    data: {
      tenantId: tenant.id,
      tz: tenant.timezone || "UTC",
      features: {
        copilot: tenant.settings?.features?.copilot || false,
        bg_checks: tenant.settings?.features?.bg_checks || false,
        provisioning: tenant.settings?.features?.provisioning || false,
        audit: true,
      },
      default_checklist: "standard_new_hire",
    },
  }
}

export async function listHires(filters?: {
  status?: string
  manager_id?: string
  start_date_from?: string
  start_date_to?: string
  region?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  let query = supabase
    .from("hires")
    .select(`
      *,
      candidate:candidates(id, first_name, last_name, email, phone),
      application:applications(id, job_title, department),
      manager:auth.users!hires_manager_id_fkey(id, email)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.manager_id) {
    query = query.eq("manager_id", filters.manager_id)
  }
  if (filters?.start_date_from) {
    query = query.gte("start_date", filters.start_date_from)
  }
  if (filters?.start_date_to) {
    query = query.lte("start_date", filters.start_date_to)
  }
  if (filters?.region) {
    query = query.eq("region", filters.region)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] listHires error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// ============================================================================
// CONVERSION & SEED
// ============================================================================

export async function convertOfferToHire(input: z.infer<typeof convertOfferSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const validated = convertOfferSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.message }
  }

  const { offer_id, start_date, hire_date, manager_id, location, region } = validated.data

  // Get offer details
  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select(`
      *,
      application:applications(
        id,
        candidate_id,
        job_title,
        department,
        requisition:requisitions(id, hiring_manager_id)
      )
    `)
    .eq("id", offer_id)
    .single()

  if (offerError || !offer) {
    return { success: false, error: "Offer not found" }
  }

  if (offer.status !== "accepted") {
    return { success: false, error: "Offer must be accepted before conversion" }
  }

  // Get tenant
  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  // Create hire record
  const { data: hire, error: hireError } = await supabase
    .from("hires")
    .insert({
      tenant_id: tenant.id,
      application_id: offer.application.id,
      candidate_id: offer.application.candidate_id,
      hire_date: hire_date || new Date().toISOString().split("T")[0],
      start_date,
      location: location || offer.location,
      region: region || offer.region,
      job_title: offer.application.job_title,
      department: offer.application.department,
      manager_id: manager_id || offer.application.requisition?.hiring_manager_id,
      status: "pending",
      onboarding_meta: {},
    })
    .select()
    .single()

  if (hireError || !hire) {
    console.error("[v0] convertOfferToHire error:", hireError)
    return { success: false, error: hireError?.message || "Failed to create hire" }
  }

  // Instantiate default checklist
  const checklistResult = await instantiateChecklist({
    checklist_name: "Standard New Hire",
    hire_id: hire.id,
    start_date,
  })

  if (!checklistResult.success) {
    console.error("[v0] Failed to instantiate checklist:", checklistResult.error)
  }

  // Create candidate portal token
  const tokenResult = await createCandidatePortalToken(hire.id, 168) // 7 days

  // Audit log
  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:hire_create",
    entity: "hire",
    entityId: hire.id,
    metadata: { offer_id, start_date },
    diff: { status: "created" },
  })

  revalidatePath("/talent/onboarding")

  return {
    success: true,
    data: {
      hire,
      portal_token: tokenResult.success ? tokenResult.data : null,
    },
  }
}

// ============================================================================
// CHECKLIST MANAGEMENT
// ============================================================================

export async function listChecklists() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("onboard_checklists")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] listChecklists error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createChecklist(input: z.infer<typeof checklistSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const validated = checklistSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("onboard_checklists")
    .insert({
      tenant_id: tenant.id,
      ...validated.data,
      created_by: user.id,
      active: true,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] createChecklist error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:checklist_create",
    entity: "checklist",
    entityId: data.id,
    metadata: { name: data.name },
    diff: { status: "created" },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

export async function updateChecklist(id: string, patch: Partial<z.infer<typeof checklistSchema>>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("onboard_checklists")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] updateChecklist error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:checklist_update",
    entity: "checklist",
    entityId: id,
    metadata: { name: data.name },
    diff: patch,
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

export async function instantiateChecklist(input: {
  checklist_name: string
  hire_id: string
  start_date: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  // Get checklist template
  const { data: checklist, error: checklistError } = await supabase
    .from("onboard_checklists")
    .select("*")
    .eq("name", input.checklist_name)
    .eq("active", true)
    .single()

  if (checklistError || !checklist) {
    return { success: false, error: "Checklist template not found" }
  }

  // Create tasks from checklist items
  const startDate = new Date(input.start_date)
  const tasks = (checklist.items as any[]).map((item) => {
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + item.due_days)

    const slaDueDate = new Date(startDate)
    slaDueDate.setHours(slaDueDate.getHours() + item.sla_hours)

    return {
      tenant_id: tenant.id,
      hire_id: input.hire_id,
      key: item.key,
      label: item.label,
      description: item.description || null,
      kind: item.kind,
      owner_role: item.owner_role,
      due_at: dueDate.toISOString(),
      sla_due_at: slaDueDate.toISOString(),
      meta: item.meta || {},
      status: "pending",
    }
  })

  const { data, error } = await supabase.from("onboard_tasks").insert(tasks).select()

  if (error) {
    console.error("[v0] instantiateChecklist error:", error)
    return { success: false, error: error.message }
  }

  // Update hire with checklist reference
  await supabase
    .from("hires")
    .update({
      onboarding_meta: { checklist_id: checklist.id },
      status: "in_progress",
    })
    .eq("id", input.hire_id)

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:checklist_instantiate",
    entity: "hire",
    entityId: input.hire_id,
    metadata: { checklist_id: checklist.id, task_count: tasks.length },
    diff: { status: "checklist_instantiated" },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// TASKS CRUD & FLOW
// ============================================================================

export async function listTasks(hire_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("onboard_tasks")
    .select(`
      *,
      owner:auth.users!onboard_tasks_owner_id_fkey(id, email),
      completed_by_user:auth.users!onboard_tasks_completed_by_fkey(id, email)
    `)
    .eq("hire_id", hire_id)
    .order("due_at", { ascending: true })

  if (error) {
    console.error("[v0] listTasks error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function upsertTask(hire_id: string, task: z.infer<typeof taskSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const validated = taskSchema.safeParse(task)
  if (!validated.success) {
    return { success: false, error: validated.error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("onboard_tasks")
    .upsert({
      tenant_id: tenant.id,
      hire_id,
      ...validated.data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] upsertTask error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:task_upsert",
    entity: "task",
    entityId: data.id,
    metadata: { hire_id, key: data.key },
    diff: validated.data,
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

export async function setTaskStatus(task_id: string, status: string, note?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString()
    updateData.completed_by = user.id
  }

  const { data, error } = await supabase.from("onboard_tasks").update(updateData).eq("id", task_id).select().single()

  if (error) {
    console.error("[v0] setTaskStatus error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:task_status",
    entity: "task",
    entityId: task_id,
    metadata: { status, note },
    diff: { status },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// FORMS & SIGNATURES
// ============================================================================

export async function getForms(hire_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("onboard_forms")
    .select("*")
    .eq("hire_id", hire_id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getForms error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function submitForm(hire_id: string, input: z.infer<typeof formSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const validated = formSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("onboard_forms")
    .insert({
      tenant_id: tenant.id,
      hire_id,
      form_key: validated.data.form_key,
      form_name: validated.data.form_name,
      data: validated.data.data,
      signed: !!validated.data.signed_by,
      signed_by: validated.data.signed_by ? user.id : null,
      signed_at: validated.data.signed_by ? new Date().toISOString() : null,
      storage_key: validated.data.storage_key,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] submitForm error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:form_submit",
    entity: "form",
    entityId: data.id,
    metadata: { hire_id, form_key: data.form_key, signed: data.signed },
    diff: { status: "submitted" },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// CANDIDATE PORTAL
// ============================================================================

export async function createCandidatePortalToken(hire_id: string, expiresHours = 168) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Generate secure token
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + expiresHours)

  // Store token in hire meta
  const { data, error } = await supabase
    .from("hires")
    .update({
      onboarding_meta: {
        portal_token: token,
        portal_token_expires: expiresAt.toISOString(),
      },
    })
    .eq("id", hire_id)
    .select()
    .single()

  if (error) {
    console.error("[v0] createCandidatePortalToken error:", error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    data: {
      token,
      expires_at: expiresAt.toISOString(),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/accept/${token}`,
    },
  }
}

export async function verifyPortalToken(token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hires")
    .select("id, onboarding_meta")
    .eq("onboarding_meta->>portal_token", token)
    .single()

  if (error || !data) {
    return { success: false, error: "Invalid token" }
  }

  const meta = data.onboarding_meta as any
  const expiresAt = new Date(meta.portal_token_expires)

  if (expiresAt < new Date()) {
    return { success: false, error: "Token expired" }
  }

  return { success: true, data: { hire_id: data.id } }
}

export async function verifyCandidateToken(token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hires")
    .select(`
      *,
      candidate:candidates(first_name, last_name, email, phone)
    `)
    .eq("onboarding_meta->>portal_token", token)
    .single()

  if (error || !data) {
    return { success: false, error: "Invalid token" }
  }

  const meta = data.onboarding_meta as any
  const expiresAt = new Date(meta.portal_token_expires)

  if (expiresAt < new Date()) {
    return { success: false, error: "Token expired" }
  }

  // Get tasks for this hire
  const { data: tasks } = await supabase
    .from("onboard_tasks")
    .select("*")
    .eq("hire_id", data.id)
    .order("due_at", { ascending: true })

  return {
    success: true,
    data: {
      hire: data,
      tasks: tasks || [],
    },
  }
}

export async function getHireDetail(hire_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: hire, error: hireError } = await supabase
    .from("hires")
    .select(`
      *,
      candidate:candidates(id, first_name, last_name, email, phone),
      application:applications(id, job_title, department),
      manager:auth.users!hires_manager_id_fkey(id, email)
    `)
    .eq("id", hire_id)
    .single()

  if (hireError || !hire) {
    return { success: false, error: "Hire not found" }
  }

  // Get tasks
  const { data: tasks } = await supabase
    .from("onboard_tasks")
    .select(`
      *,
      owner:auth.users!onboard_tasks_owner_id_fkey(id, email),
      completed_by_user:auth.users!onboard_tasks_completed_by_fkey(id, email)
    `)
    .eq("hire_id", hire_id)
    .order("due_at", { ascending: true })

  // Get forms
  const { data: forms } = await supabase.from("onboard_forms").select("*").eq("hire_id", hire_id)

  // Get background checks
  const { data: background_checks } = await supabase.from("background_checks").select("*").eq("hire_id", hire_id)

  // Get provisioning events
  const { data: provisions } = await supabase.from("provision_events").select("*").eq("hire_id", hire_id)

  // Calculate progress
  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.status === "completed").length || 0
  const progress_pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return {
    success: true,
    data: {
      ...hire,
      first_name: hire.candidate?.first_name,
      last_name: hire.candidate?.last_name,
      email: hire.candidate?.email,
      phone: hire.candidate?.phone,
      manager_name: hire.manager?.email,
      tasks: tasks || [],
      forms: forms || [],
      background_checks: background_checks || [],
      provisions: provisions || [],
      progress_pct,
    },
  }
}

// ============================================================================
// BACKGROUND CHECKS
// ============================================================================

export async function requestBackgroundCheck(hire_id: string, packageKey = "standard") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  // Create background check record
  const { data, error } = await supabase
    .from("background_checks")
    .insert({
      tenant_id: tenant.id,
      hire_id,
      provider: "checkr", // stub
      provider_ref: `CHK-${Date.now()}`,
      package_key: packageKey,
      status: "requested",
      requested_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] requestBackgroundCheck error:", error)
    return { success: false, error: error.message }
  }

  // TODO: Call actual provider API

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:bg_request",
    entity: "background_check",
    entityId: data.id,
    metadata: { hire_id, package: packageKey },
    diff: { status: "requested" },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

export async function pollBackgroundCheck(check_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // TODO: Call provider API to get status

  // Stub: randomly return clear or consider
  const statuses = ["clear", "consider"]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  const { data, error } = await supabase
    .from("background_checks")
    .update({
      status: randomStatus,
      result: { stub: true, status: randomStatus },
      completed_at: new Date().toISOString(),
    })
    .eq("id", check_id)
    .select()
    .single()

  if (error) {
    console.error("[v0] pollBackgroundCheck error:", error)
    return { success: false, error: error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (tenant) {
    await logAudit({
      tenantId: tenant.id,
      userId: user.id,
      action: "onboard:bg_update",
      entity: "background_check",
      entityId: check_id,
      metadata: { status: randomStatus },
      diff: { status: randomStatus },
    })
  }

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// PROVISIONING & EQUIPMENT
// ============================================================================

export async function requestProvisioning(hire_id: string, type: string, meta: Record<string, any>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("provision_events")
    .insert({
      tenant_id: tenant.id,
      hire_id,
      type,
      provider: "internal", // stub
      status: "requested",
      meta,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] requestProvisioning error:", error)
    return { success: false, error: error.message }
  }

  // TODO: Call actual provisioning API

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:provision_request",
    entity: "provision_event",
    entityId: data.id,
    metadata: { hire_id, type },
    diff: { status: "requested" },
  })

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

export async function pollProvisioning(event_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Stub: mark as done
  const { data, error } = await supabase
    .from("provision_events")
    .update({
      status: "done",
      updated_at: new Date().toISOString(),
    })
    .eq("id", event_id)
    .select()
    .single()

  if (error) {
    console.error("[v0] pollProvisioning error:", error)
    return { success: false, error: error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (tenant) {
    await logAudit({
      tenantId: tenant.id,
      userId: user.id,
      action: "onboard:provision_update",
      entity: "provision_event",
      entityId: event_id,
      metadata: { status: "done" },
      diff: { status: "done" },
    })
  }

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// AUTOMATION ENGINE HOOKS
// ============================================================================

export async function startAutomationFlow(hire_id: string, flow_key: string, context: Record<string, any>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (!tenant) {
    return { success: false, error: "No tenant found" }
  }

  const { data, error } = await supabase
    .from("onboard_automation_runs")
    .insert({
      tenant_id: tenant.id,
      hire_id,
      flow_key,
      status: "running",
      context,
      log: [{ step: 0, action: "started", timestamp: new Date().toISOString() }],
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] startAutomationFlow error:", error)
    return { success: false, error: error.message }
  }

  await logAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "onboard:automation_start",
    entity: "automation_run",
    entityId: data.id,
    metadata: { hire_id, flow_key },
    diff: { status: "started" },
  })

  return { success: true, data }
}

export async function resumeAutomationStep(run_id: string, stepIndex: number, actionPayload: Record<string, any>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: run, error: runError } = await supabase
    .from("onboard_automation_runs")
    .select("*")
    .eq("id", run_id)
    .single()

  if (runError || !run) {
    return { success: false, error: "Automation run not found" }
  }

  const log = run.log as any[]
  log.push({
    step: stepIndex,
    action: "resumed",
    payload: actionPayload,
    timestamp: new Date().toISOString(),
  })

  const { data, error } = await supabase
    .from("onboard_automation_runs")
    .update({
      log,
      status: "running",
      updated_at: new Date().toISOString(),
    })
    .eq("id", run_id)
    .select()
    .single()

  if (error) {
    console.error("[v0] resumeAutomationStep error:", error)
    return { success: false, error: error.message }
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (tenant) {
    await logAudit({
      tenantId: tenant.id,
      userId: user.id,
      action: "onboard:automation_step",
      entity: "automation_run",
      entityId: run_id,
      metadata: { step: stepIndex },
      diff: { status: "resumed" },
    })
  }

  revalidatePath("/talent/onboarding")

  return { success: true, data }
}

// ============================================================================
// NOTIFICATIONS & REMINDERS
// ============================================================================

export async function sendOnboardReminders(range: { from: string; to: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get overdue tasks
  const { data: tasks, error } = await supabase
    .from("onboard_tasks")
    .select(`
      *,
      hire:hires(id, candidate:candidates(first_name, last_name, email))
    `)
    .in("status", ["pending", "in_progress"])
    .gte("due_at", range.from)
    .lte("due_at", range.to)

  if (error) {
    console.error("[v0] sendOnboardReminders error:", error)
    return { success: false, error: error.message }
  }

  // TODO: Send actual reminder emails

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (tenant) {
    await logAudit({
      tenantId: tenant.id,
      userId: user.id,
      action: "onboard:reminders",
      entity: "system",
      entityId: "reminders",
      metadata: { count: tasks?.length || 0, range },
      diff: {},
    })
  }

  return { success: true, data: { sent: tasks?.length || 0 } }
}

// ============================================================================
// REPORTS & HEALTH
// ============================================================================

export async function getOnboardingHealth(range: { from: string; to: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get hires in range
  const { data: hires } = await supabase
    .from("hires")
    .select("id, start_date, status, created_at")
    .gte("start_date", range.from)
    .lte("start_date", range.to)

  // Get blocked tasks
  const { data: blockedTasks } = await supabase.from("onboard_tasks").select("id").eq("status", "blocked")

  // Get background checks
  const { data: bgChecks } = await supabase
    .from("background_checks")
    .select("status")
    .gte("requested_at", range.from)
    .lte("requested_at", range.to)

  // Get provisioning events
  const { data: provisionEvents } = await supabase
    .from("provision_events")
    .select("status")
    .gte("created_at", range.from)
    .lte("created_at", range.to)

  // Calculate metrics
  const avgTimeToActivate =
    hires
      ?.filter((h) => h.status === "completed")
      .reduce((acc, h) => {
        const days = Math.floor(
          (new Date(h.created_at).getTime() - new Date(h.start_date).getTime()) / (1000 * 60 * 60 * 24),
        )
        return acc + days
      }, 0) / (hires?.filter((h) => h.status === "completed").length || 1)

  const bgFailRate = (bgChecks?.filter((bg) => bg.status === "failed").length || 0) / (bgChecks?.length || 1)

  const equipmentFulfillmentRate =
    (provisionEvents?.filter((p) => p.status === "done").length || 0) / (provisionEvents?.length || 1)

  return {
    success: true,
    data: {
      avgTimeToActivateDays: Math.round(avgTimeToActivate),
      blockedCount: blockedTasks?.length || 0,
      bgCheckFailRate: Math.round(bgFailRate * 100),
      equipmentFulfillmentRate: Math.round(equipmentFulfillmentRate * 100),
    },
  }
}

export async function exportOnboardingCsv(params: {
  status?: string
  start_date_from?: string
  start_date_to?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // TODO: Generate CSV and upload to storage, return signed URL

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  if (tenant) {
    await logAudit({
      tenantId: tenant.id,
      userId: user.id,
      action: "onboard:export",
      entity: "system",
      entityId: "export",
      metadata: { params },
      diff: {},
    })
  }

  return {
    success: true,
    data: {
      url: "https://example.com/export.csv", // stub
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    },
  }
}

// ============================================================================
// AI HELPERS
// ============================================================================

export async function generateWelcomeEmail(hire_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: hire } = await supabase
    .from("hires")
    .select(`
      *,
      candidate:candidates(first_name, last_name),
      manager:auth.users!hires_manager_id_fkey(email)
    `)
    .eq("id", hire_id)
    .single()

  if (!hire) {
    return { success: false, error: "Hire not found" }
  }

  try {
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o",
      prompt: `Generate a warm, professional welcome email for a new hire:
      
Name: ${hire.candidate.first_name} ${hire.candidate.last_name}
Role: ${hire.job_title}
Department: ${hire.department}
Start Date: ${hire.start_date}
Manager: ${hire.manager?.email}

The email should:
- Welcome them to the company
- Confirm their start date and role
- Mention what to expect on their first day
- Provide a contact for questions
- Be friendly but professional
- Be 200-300 words`,
    })

    return { success: true, data: { email: text } }
  } catch (error: any) {
    console.error("[v0] generateWelcomeEmail error:", error)
    return { success: false, error: error.message }
  }
}

export async function generateOnboardingSchedule(hire_id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data: hire } = await supabase
    .from("hires")
    .select("*, candidate:candidates(first_name, last_name)")
    .eq("id", hire_id)
    .single()

  if (!hire) {
    return { success: false, error: "Hire not found" }
  }

  try {
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o",
      prompt: `Generate a detailed first week onboarding schedule for:
      
Role: ${hire.job_title}
Department: ${hire.department}
Start Date: ${hire.start_date}

Create a day-by-day schedule for the first week including:
- Orientation sessions
- Team introductions
- Training sessions
- Setup tasks
- Check-ins with manager
- Social activities

Format as a structured schedule with times and activities.`,
    })

    return { success: true, data: { schedule: text } }
  } catch (error: any) {
    console.error("[v0] generateOnboardingSchedule error:", error)
    return { success: false, error: error.message }
  }
}

// ============================================================================
// AUDIT VERIFY
// ============================================================================

export async function getAuditMini(limit = 10) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] getAuditMini error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function verifyHash(hash: string) {
  // TODO: Implement hash verification logic
  return { success: true, data: { valid: true } }
}
