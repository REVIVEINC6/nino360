"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_handle: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type ContactInput = z.infer<typeof contactSchema>

export async function listContacts(filters?: {
  company?: string
  search?: string
  tags?: string[]
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    let query = supabase
      .from("crm_contacts")
      .select("*", { count: "exact" })
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })

    if (filters?.company) {
      query = query.eq("company", filters.company)
    }
    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
      )
    }
    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains("tags", filters.tags)
    }

    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    }
  } catch (error) {
    console.error("[v0] Error listing contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list contacts",
    }
  }
}

export async function getContact(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_contacts").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get contact",
    }
  }
}

export async function createContact(input: ContactInput) {
  try {
    const validated = contactSchema.parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    const { data, error } = await supabase
      .from("crm_contacts")
      .insert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating contact:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create contact",
    }
  }
}

export async function updateContact(id: string, input: Partial<ContactInput>) {
  try {
    const validated = contactSchema.partial().parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_contacts").update(validated).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating contact:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update contact",
    }
  }
}

export async function deleteContact(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase.from("crm_contacts").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete contact",
    }
  }
}
