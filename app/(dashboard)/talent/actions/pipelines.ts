"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { z } from "zod"

const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function getPipeline(jobId: string) {
  const supabase = createClient()

  const { data: stages, error: stagesError } = await supabase
    .from("job_stages")
    .select("*")
    .eq("job_id", jobId)
    .order("position")

  if (stagesError) throw stagesError

  const { data: apps, error: appsError } = await supabase
    .from("applications")
    .select("*, candidate:candidate_id(*), stage:stage_id(*)")
    .eq("job_id", jobId)

  if (appsError) throw appsError

  return { stages: stages || [], apps: apps || [] }
}

export async function moveApplication({
  application_id,
  to_stage,
}: {
  application_id: string
  to_stage: string
}) {
  const supabase = createClient()

  // Get current stage
  const { data: currentApp } = await supabase.from("applications").select("stage_id").eq("id", application_id).single()

  // Update application
  const { data: app, error } = await supabase
    .from("applications")
    .update({ stage_id: to_stage, updated_at: new Date().toISOString() })
    .eq("id", application_id)
    .select()
    .single()

  if (error) throw error

  // Log event
  await supabase.from("application_events").insert({
    application_id,
    type: "moved",
    from_stage: currentApp?.stage_id,
    to_stage,
  })

  return app
}

const applicationSchema = z.object({
  job_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
  stage_id: z.string().uuid().optional(),
  status: z.enum(["in_process", "offered", "hired", "rejected", "withdrawn"]).default("in_process"),
  score: z.number().optional(),
  match_json: z.record(z.any()).optional(),
})

export async function createApplication(input: unknown) {
  const body = applicationSchema.parse(input)
  const supabase = createClient()

  const { data, error } = await supabase.from("applications").insert(body).select().single()

  if (error) throw error

  await supabase.from("application_events").insert({
    application_id: data.id,
    type: "created",
    note: "Application created",
  })

  return data
}

export async function addNote({
  application_id,
  note,
}: {
  application_id: string
  note: string
}) {
  const supabase = createClient()

  const { error } = await supabase.from("application_events").insert({
    application_id,
    type: "note",
    note,
  })

  if (error) throw error
  return { ok: true }
}
