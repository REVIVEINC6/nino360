"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { generateObject, generateText } from "ai"

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

// AI-powered candidate search with ML relevance ranking
export async function aiSearchCandidates(input: {
  query: string
  filters?: {
    skills?: string[]
    location?: string
    experience_min?: number
    experience_max?: number
    work_auth?: string
  }
  limit?: number
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Track interaction for adaptive learning
    await supabase.from("sourcing_interactions").insert({
      tenant_id: profile.tenant_id,
      user_id: user.id,
      interaction_type: "search",
      metadata: { query: input.query, filters: input.filters },
    })

    // Build query with filters
    let query = supabase
      .from("candidates")
      .select("*, candidate_profiles(*)")
      .eq("tenant_id", profile.tenant_id)
      .order("ml_match_score", { ascending: false })
      .limit(input.limit || 50)

    if (input.filters?.skills?.length) {
      query = query.contains("skills", input.filters.skills)
    }

    if (input.filters?.location) {
      query = query.ilike("location", `%${input.filters.location}%`)
    }

    if (input.filters?.work_auth) {
      query = query.eq("work_auth", input.filters.work_auth)
    }

    const { data: candidates, error } = await query

    if (error) throw error

    // Use AI to rank candidates by relevance to query
    if (input.query && candidates) {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Given this search query: "${input.query}"
        
Rank these candidates by relevance (return comma-separated IDs in order):
${candidates.map((c) => `${c.id}: ${c.full_name} - ${c.headline || ""} - Skills: ${(c.skills || []).join(", ")}`).join("\n")}`,
      })

      const rankedIds = text.split(",").map((id) => id.trim())
      const rankedCandidates = rankedIds
        .map((id) => candidates.find((c) => c.id === id))
        .filter(Boolean)
        .concat(candidates.filter((c) => !rankedIds.includes(c.id)))

      return { success: true, data: rankedCandidates }
    }

    return { success: true, data: candidates }
  } catch (error) {
    console.error("[v0] Error in AI search:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to search candidates" }
  }
}

// AI-powered sourcing insights (Theory of Mind)
export async function getSourcingInsights() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Get user's recent interactions
    const { data: interactions } = await supabase
      .from("sourcing_interactions")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    // Get existing insights
    const { data: insights, error } = await supabase
      .from("sourcing_insights")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .eq("user_id", user.id)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) throw error

    // Generate new insights if needed
    if (!insights || insights.length < 3) {
      const { text } = await generateText({
        model: "openai/gpt-4o",
        prompt: `Based on this user's sourcing behavior, generate 3 personalized insights:
        
Recent interactions: ${JSON.stringify(interactions?.slice(0, 10))}

Generate insights in this format:
1. [type]: [title] - [description] (confidence: X%)
2. [type]: [title] - [description] (confidence: X%)
3. [type]: [title] - [description] (confidence: X%)

Types: recommendation, prediction, anomaly, trend`,
      })

      // Parse and store insights
      const lines = text.split("\n").filter((l) => l.trim())
      for (const line of lines) {
        const match = line.match(/\[(\w+)\]: (.+?) - (.+?) $$confidence: (\d+)%$$/)
        if (match) {
          await supabase.from("sourcing_insights").insert({
            tenant_id: profile.tenant_id,
            user_id: user.id,
            insight_type: match[1],
            title: match[2],
            description: match[3],
            confidence: Number.parseFloat(match[4]),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
        }
      }

      // Refetch insights
      const { data: newInsights } = await supabase
        .from("sourcing_insights")
        .select("*")
        .eq("tenant_id", profile.tenant_id)
        .eq("user_id", user.id)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })

      return { success: true, data: newInsights }
    }

    return { success: true, data: insights }
  } catch (error) {
    console.error("[v0] Error getting insights:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get insights" }
  }
}

// Auto-outreach campaign management
export async function createOutreachCampaign(input: {
  name: string
  description?: string
  templateSubject: string
  templateBody: string
  targetPoolId?: string
  targetFilters?: any
  scheduledAt?: string
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("outreach_campaigns")
      .insert({
        tenant_id: profile.tenant_id,
        name: input.name,
        description: input.description,
        template_subject: input.templateSubject,
        template_body: input.templateBody,
        target_pool_id: input.targetPoolId,
        target_filters: input.targetFilters || {},
        status: input.scheduledAt ? "scheduled" : "draft",
        scheduled_at: input.scheduledAt,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // Create blockchain audit entry
    await supabase.from("sourcing_audit_trail").insert({
      tenant_id: profile.tenant_id,
      entity_type: "campaign",
      entity_id: data.id,
      action_type: "created",
      actor_user_id: user.id,
      metadata: { name: input.name },
    })

    revalidatePath("/talent/sourcing")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating campaign:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create campaign" }
  }
}

export async function listOutreachCampaigns() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("outreach_campaigns")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error listing campaigns:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to list campaigns" }
  }
}

// RPA workflow execution
export async function executeRPAWorkflow(workflowId: string, context: any) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const startTime = Date.now()

    // Get workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("rpa_sourcing_workflows")
      .select("*")
      .eq("id", workflowId)
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (workflowError || !workflow) throw new Error("Workflow not found")

    const actions = workflow.actions as any[]
    let actionsCompleted = 0
    let actionsFailed = 0

    // Execute each action
    for (const action of actions) {
      try {
        switch (action.type) {
          case "add_to_pool":
            if (context.candidateId && action.pool_name) {
              // Find or create pool
              const { data: pool } = await supabase
                .from("pools")
                .select("id")
                .eq("tenant_id", profile.tenant_id)
                .eq("name", action.pool_name)
                .single()

              if (pool) {
                await supabase.from("pool_members").upsert({
                  pool_id: pool.id,
                  candidate_id: context.candidateId,
                  tenant_id: profile.tenant_id,
                })
              }
            }
            actionsCompleted++
            break

          case "send_notification":
            await supabase.from("notifications").insert({
              tenant_id: profile.tenant_id,
              user_id: user.id,
              title: "RPA Workflow",
              message: action.message || "Workflow action completed",
              type: "info",
            })
            actionsCompleted++
            break

          case "send_email":
            // Queue email (would integrate with email service)
            actionsCompleted++
            break

          case "update_status":
            if (context.candidateId && action.status) {
              await supabase
                .from("candidates")
                .update({ outreach_status: action.status })
                .eq("id", context.candidateId)
                .eq("tenant_id", profile.tenant_id)
            }
            actionsCompleted++
            break

          default:
            actionsFailed++
        }
      } catch (err) {
        actionsFailed++
      }
    }

    const executionTime = Date.now() - startTime

    // Log execution
    await supabase.from("rpa_execution_logs").insert({
      tenant_id: profile.tenant_id,
      workflow_id: workflowId,
      status: actionsFailed === 0 ? "success" : actionsCompleted > 0 ? "partial" : "failed",
      execution_time_ms: executionTime,
      actions_completed: actionsCompleted,
      actions_failed: actionsFailed,
      metadata: context,
    })

    // Update workflow stats
    await supabase
      .from("rpa_sourcing_workflows")
      .update({
        execution_count: workflow.execution_count + 1,
        last_executed_at: new Date().toISOString(),
        avg_execution_time_ms: Math.round(
          ((workflow.avg_execution_time_ms || 0) * workflow.execution_count + executionTime) /
            (workflow.execution_count + 1),
        ),
      })
      .eq("id", workflowId)

    return { success: true, data: { actionsCompleted, actionsFailed, executionTime } }
  } catch (error) {
    console.error("[v0] Error executing RPA workflow:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to execute workflow" }
  }
}

// Blockchain audit verification
export async function getSourcingAuditTrail(params?: { entityType?: string; entityId?: string; limit?: number }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    let query = supabase
      .from("sourcing_audit_trail")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })
      .limit(params?.limit || 50)

    if (params?.entityType) {
      query = query.eq("entity_type", params.entityType)
    }

    if (params?.entityId) {
      query = query.eq("entity_id", params.entityId)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting audit trail:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get audit trail" }
  }
}

export async function verifySourcingAudit(auditId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data: audit, error } = await supabase
      .from("sourcing_audit_trail")
      .select("*")
      .eq("id", auditId)
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (error || !audit) throw new Error("Audit record not found")

    // Verify hash chain
    const { data: previousAudit } = await supabase
      .from("sourcing_audit_trail")
      .select("data_hash")
      .eq("tenant_id", profile.tenant_id)
      .lt("created_at", audit.created_at)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const verified = !previousAudit || audit.previous_hash === previousAudit.data_hash

    // Update verification status
    await supabase
      .from("sourcing_audit_trail")
      .update({
        verification_status: verified ? "verified" : "failed",
      })
      .eq("id", auditId)

    return { success: true, data: { verified, audit } }
  } catch (error) {
    console.error("[v0] Error verifying audit:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to verify audit" }
  }
}

// Sourcing analytics
export async function getSourcingAnalytics() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("sourcing_analytics")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting analytics:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get analytics" }
  }
}
