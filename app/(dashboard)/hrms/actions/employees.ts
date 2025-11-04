"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2).optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  work_auth: z.string().optional(),
  hire_date: z.string().optional(),
  termination_date: z.string().optional(),
  employment_type: z.enum(["W2", "C2C", "Contract", "Full-Time", "Part-Time"]).optional(),
  department: z.string().optional(),
  title: z.string().optional(),
  manager_id: z.string().uuid().optional(),
  status: z.enum(["active", "leave", "terminated"]).default("active"),
  tags: z.array(z.string()).optional(),
  cost_rate: z.number().optional(),
  bill_rate: z.number().optional(),
  profile: z.record(z.any()).optional(),
})

export async function upsertEmployee(input: unknown) {
  const supabase = await createServerClient()
  const body = employeeSchema.parse(input)

  const { data, error } = await supabase.from("employees").upsert(body).select().single()

  if (error) throw error

  return data
}

export async function listEmployees(filters?: {
  department?: string
  status?: string
  search?: string
}) {
  const supabase = await createServerClient()
  let query = supabase.from("employees").select("*").order("created_at", { ascending: false })

  if (filters?.department) {
    query = query.eq("department", filters.department)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getEmployee(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function deleteEmployee(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) throw error

  return { success: true }
}
