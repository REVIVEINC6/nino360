"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { generateObject } from "ai"

// Validation schemas
const importCsvSchema = z.object({
  file: z.any(),
  poolId: z.string().uuid().optional(),
  mapping: z.record(z.string()).optional(),
})

const poolSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

const vendorSubmissionSchema = z.object({
  vendorKey: z.string(),
  candidateData: z.any(),
})

const matchSchema = z.object({
  candidateIds: z.array(z.string().uuid()),
  requisitionIds: z.array(z.string().uuid()),
  k: z.number().optional(),
})

// Context
export async function getContext() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Get intake alias
    const { data: alias } = await supabase
      .from("email_intake_aliases")
      .select("key")
      .eq("tenant_id", profile.tenant_id)
      .eq("active", true)
      .single()

    // Get pools count
    const { count: poolsCount } = await supabase
      .from("pools")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", profile.tenant_id)

    return {
      success: true,
      data: {
        tenantId: profile.tenant_id,
        tz: "UTC",
        features: { copilot: true, audit: true },
        intakeAlias: alias?.key || null,
        poolsCount: poolsCount || 0,
      },
    }
  } catch (error) {
    console.error("[v0] Error getting context:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get context" }
  }
}

// Import CSV
export async function importCsv(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const file = formData.get("file") as File
    const poolId = formData.get("poolId") as string | null

    if (!file) throw new Error("File is required")

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const candidates = []
    let duplicates = 0
    let errors = 0

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const candidate: any = { tenant_id: profile.tenant_id, created_by: user.id, source: "csv" }

        headers.forEach((header, index) => {
          const value = values[index]
          if (!value) return

          switch (header.toLowerCase()) {
            case "first name":
            case "first_name":
              candidate.first_name = value
              break
            case "last name":
            case "last_name":
              candidate.last_name = value
              break
            case "email":
              candidate.email = value
              break
            case "phone":
              candidate.phone = value
              break
            case "skills":
              candidate.skills = value.split(",").map((s: string) => s.trim())
              break
            case "location":
            case "city":
              candidate.location = value
              break
            case "job title":
            case "current_title":
              candidate.current_title = value
              break
          }
        })

        if (candidate.email) {
          // Check for duplicates
          const { data: existing } = await supabase
            .from("candidates")
            .select("id")
            .eq("tenant_id", profile.tenant_id)
            .eq("email", candidate.email)
            .single()

          if (existing) {
            duplicates++
            continue
          }
        }

        candidates.push(candidate)
      } catch (err) {
        errors++
      }
    }

    // Bulk insert
    const { data: inserted, error: insertError } = await supabase.from("candidates").insert(candidates).select()

    if (insertError) throw insertError

    // Add to pool if specified
    if (poolId && inserted) {
      const poolMembers = inserted.map((c) => ({
        pool_id: poolId,
        candidate_id: c.id,
        tenant_id: profile.tenant_id,
      }))
      await supabase.from("pool_members").insert(poolMembers)
    }

    // Log import
    await supabase.from("imports").insert({
      tenant_id: profile.tenant_id,
      kind: "csv",
      filename: file.name,
      size_bytes: file.size,
      rows: lines.length - 1,
      inserted: inserted?.length || 0,
      duplicates,
      errors,
      status: "completed",
      created_by: user.id,
    })

    revalidatePath("/talent/sourcing")
    return {
      success: true,
      data: { inserted: inserted?.length || 0, duplicates, errors },
    }
  } catch (error) {
    console.error("[v0] Error importing CSV:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to import CSV" }
  }
}

// Import ZIP of resumes
export async function importZip(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const file = formData.get("file") as File
    const poolId = formData.get("poolId") as string | null

    if (!file) throw new Error("File is required")

    // TODO: Implement ZIP extraction and resume parsing
    // For now, return mock data
    const inserted = 0
    const errors = 0

    await supabase.from("imports").insert({
      tenant_id: profile.tenant_id,
      kind: "zip",
      filename: file.name,
      size_bytes: file.size,
      rows: 0,
      inserted,
      errors,
      status: "completed",
      created_by: user.id,
    })

    revalidatePath("/talent/sourcing")
    return { success: true, data: { inserted, errors } }
  } catch (error) {
    console.error("[v0] Error importing ZIP:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to import ZIP" }
  }
}

// AI Resume Parsing
export async function aiParseResume(resumeText: string) {
  try {
    const resumeSchema = z.object({
      personalInfo: z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        linkedin: z.string().optional(),
      }),
      summary: z.string(),
      skills: z.array(z.string()),
      experience: z.array(
        z.object({
          company: z.string(),
          title: z.string(),
          duration: z.string(),
          description: z.string(),
        }),
      ),
      education: z.array(
        z.object({
          institution: z.string(),
          degree: z.string(),
          field: z.string(),
          year: z.string(),
        }),
      ),
      certifications: z.array(z.string()),
    })

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: resumeSchema,
      prompt: `Parse this resume and extract structured information:\n\n${resumeText}`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error parsing resume:", error)
    return { success: false, error: "Failed to parse resume" }
  }
}

// AI Candidate Matching
export async function matchToRequisitions(input: z.infer<typeof matchSchema>) {
  try {
    const validated = matchSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Fetch candidates and requisitions
    const { data: candidates } = await supabase
      .from("candidates")
      .select("*")
      .in("id", validated.candidateIds)
      .eq("tenant_id", profile.tenant_id)

    const { data: requisitions } = await supabase
      .from("requisitions")
      .select("*")
      .in("id", validated.requisitionIds)
      .eq("tenant_id", profile.tenant_id)

    if (!candidates || !requisitions) throw new Error("Data not found")

    const matches = []

    for (const candidate of candidates) {
      for (const req of requisitions) {
        // Simple matching algorithm (in production, use ML)
        const candidateSkills = candidate.skills || []
        const reqSkills = req.skills || []
        const matchedSkills = candidateSkills.filter((s: string) => reqSkills.includes(s))
        const score = Math.min(100, (matchedSkills.length / Math.max(reqSkills.length, 1)) * 100)

        const explain = [
          { reason: "Skills Match", value: `${matchedSkills.length}/${reqSkills.length}` },
          { reason: "Experience", value: `${candidate.experience_years || 0} years` },
        ]

        matches.push({
          tenant_id: profile.tenant_id,
          requisition_id: req.id,
          candidate_id: candidate.id,
          score: Math.round(score),
          explain,
        })
      }
    }

    // Upsert matches
    const { error } = await supabase.from("matches").upsert(matches)
    if (error) throw error

    revalidatePath("/talent/sourcing")
    return { success: true, data: matches }
  } catch (error) {
    console.error("[v0] Error matching candidates:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to match candidates" }
  }
}

// Pool Management
export async function listPools() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("pools")
      .select("*, pool_members(count)")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error listing pools:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to list pools" }
  }
}

export async function upsertPool(input: z.infer<typeof poolSchema>) {
  try {
    const validated = poolSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("pools")
      .upsert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/talent/sourcing")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error upserting pool:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save pool" }
  }
}

export async function addToPool(poolId: string, candidateIds: string[]) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const members = candidateIds.map((candidateId) => ({
      pool_id: poolId,
      candidate_id: candidateId,
      tenant_id: profile.tenant_id,
    }))

    const { error } = await supabase.from("pool_members").upsert(members)
    if (error) throw error

    revalidatePath("/talent/sourcing")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error adding to pool:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to add to pool" }
  }
}

// Vendor Submissions
export async function listVendorInbox(params?: { status?: string[]; q?: string }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    let query = supabase
      .from("vendor_submissions")
      .select("*, candidate:candidates(*)")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })

    if (params?.status?.length) {
      query = query.in("status", params.status)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error listing vendor inbox:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to list vendor submissions" }
  }
}

export async function acceptVendorSubmission(id: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { error } = await supabase
      .from("vendor_submissions")
      .update({ status: "accepted" })
      .eq("id", id)
      .eq("tenant_id", profile.tenant_id)

    if (error) throw error

    revalidatePath("/talent/sourcing")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error accepting vendor submission:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to accept submission" }
  }
}

// Deduplication
export async function checkDedupe(input: { email?: string; phone?: string; name?: string }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const matches = []

    if (input.email) {
      const { data } = await supabase
        .from("candidates")
        .select("id, first_name, last_name, email")
        .eq("tenant_id", profile.tenant_id)
        .eq("email", input.email)

      if (data) {
        matches.push(...data.map((c) => ({ ...c, reason: "Email match", score: 100 })))
      }
    }

    return { success: true, data: matches }
  } catch (error) {
    console.error("[v0] Error checking dedupe:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to check duplicates" }
  }
}

// Consent Management
export async function requestConsent(candidateId: string, channel: "email" | "portal") {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    await supabase.from("consent_events").insert({
      tenant_id: profile.tenant_id,
      candidate_id: candidateId,
      action: "request",
      channel,
    })

    revalidatePath("/talent/sourcing")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error requesting consent:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to request consent" }
  }
}

// Export
export async function exportCsv(params?: { poolId?: string }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    let query = supabase.from("candidates").select("*").eq("tenant_id", profile.tenant_id)

    if (params?.poolId) {
      const { data: members } = await supabase
        .from("pool_members")
        .select("candidate_id")
        .eq("pool_id", params.poolId)
        .eq("tenant_id", profile.tenant_id)

      if (members) {
        const candidateIds = members.map((m) => m.candidate_id)
        query = query.in("id", candidateIds)
      }
    }

    const { data, error } = await query

    if (error) throw error

    // Generate CSV
    const csv = [
      "First Name,Last Name,Email,Phone,Location,Skills,Status",
      ...(data || []).map(
        (c) =>
          `${c.first_name},${c.last_name},${c.email},${c.phone || ""},${c.location || ""},${(c.skills || []).join(";")},${c.status}`,
      ),
    ].join("\n")

    return { success: true, data: csv }
  } catch (error) {
    console.error("[v0] Error exporting CSV:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to export CSV" }
  }
}

// Audit
export async function getAuditMini(limit = 10) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .eq("entity", "talent.sourcing")
      .order("ts", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting audit:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get audit log" }
  }
}

export async function verifyHash(hash: string) {
  // TODO: Implement blockchain-style hash verification
  return { success: true, valid: true }
}
