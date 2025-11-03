"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getJobBoards() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("job_boards").select("*").order("name")

  if (error) throw error
  return data || []
}

export async function getJobPostings() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("job_postings")
    .select(`
      *,
      job_boards (name, logo_url)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function connectJobBoard(boardId: string, credentials: any) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("job_board_connections")
    .insert({
      job_board_id: boardId,
      credentials,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function postToJobBoard(jobId: string, boardIds: string[]) {
  const supabase = await createServerClient()

  const postings = boardIds.map((boardId) => ({
    job_id: jobId,
    job_board_id: boardId,
    status: "pending",
  }))

  const { data, error } = await supabase.from("job_postings").insert(postings).select()

  if (error) throw error
  return data
}
