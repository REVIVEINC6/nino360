"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures, maskFields, maskFieldsArray } from "@/lib/fbac"

// Validation schemas
const employeeFilterSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  q: z.string().optional(),
  status: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  managerId: z.string().uuid().optional(),
  hasDocuments: z.boolean().optional(),
  sortBy: z.string().default("hire_date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

const employeeProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
})

const employeeEmploymentSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  hire_date: z.string().min(1, "Hire date is required"),
  employment_type: z.string().min(1, "Employment type is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  reporting_manager_id: z.string().uuid().optional(),
  status: z.enum(["active", "on_leave", "terminated"]).default("active"),
})

const lifecycleActionSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["onboard", "transfer", "promote", "terminate"]),
  effective_date: z.string(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  // Action-specific fields
  new_department: z.string().optional(),
  new_designation: z.string().optional(),
  new_manager_id: z.string().uuid().optional(),
  new_location: z.string().optional(),
  termination_reason: z.string().optional(),
  rehire_eligible: z.boolean().optional(),
})

// Get directory with filters and pagination
export async function getDirectory(input: z.infer<typeof employeeFilterSchema>) {
  try {
    const validated = employeeFilterSchema.parse(input)
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Get tenant context
    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures(["hrms.employees.read", "hrms.employees.pii.read", "hrms.employees.pii.unmask"])

    if (!features["hrms.employees.read"]) {
      throw new Error("Permission denied: hrms.employees.read required")
    }

    // Build query
    let query = supabase
      .from("hrms_employees")
      .select(
        `
        id,
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        department,
        designation,
        employment_type,
        status,
        hire_date,
        termination_date,
        reporting_manager_id,
        manager:hrms_employees!reporting_manager_id(first_name, last_name)
      `,
        { count: "exact" },
      )
      .eq("tenant_id", member.tenant_id)

    // Apply filters
    if (validated.q) {
      query = query.or(
        `first_name.ilike.%${validated.q}%,last_name.ilike.%${validated.q}%,email.ilike.%${validated.q}%,employee_id.ilike.%${validated.q}%`,
      )
    }
    if (validated.status?.length) {
      query = query.in("status", validated.status)
    }
    if (validated.type?.length) {
      query = query.in("employment_type", validated.type)
    }
    if (validated.department) {
      query = query.eq("department", validated.department)
    }
    if (validated.managerId) {
      query = query.eq("reporting_manager_id", validated.managerId)
    }

    // Sorting and pagination
    query = query.order(validated.sortBy, { ascending: validated.sortOrder === "asc" })
    const from = (validated.page - 1) * validated.pageSize
    const to = from + validated.pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    // Mask PII fields based on FBAC
    const fieldMap = {
      phone: "hrms.employees.pii.read",
      email: "hrms.employees.pii.read",
      date_of_birth: "hrms.employees.pii.read",
    }

    const maskedData = maskFieldsArray(data || [], features, fieldMap)

    // Audit read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "employees:list",
      entity: "hrms_employees",
      diff: { filters: validated, count: data?.length || 0 },
    })

    return {
      success: true,
      data: maskedData,
      pagination: {
        page: validated.page,
        pageSize: validated.pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / validated.pageSize),
      },
    }
  } catch (error) {
    console.error("[v0] Error getting directory:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get directory",
    }
  }
}

// Get single employee with full details
export async function getEmployee(id: string) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures([
      "hrms.employees.read",
      "hrms.employees.pii.read",
      "hrms.employees.pii.unmask",
      "hrms.compensation.read",
    ])

    if (!features["hrms.employees.read"]) {
      throw new Error("Permission denied")
    }

    const { data, error } = await supabase
      .from("hrms_employees")
      .select(
        `
        *,
        manager:hrms_employees!reporting_manager_id(id, first_name, last_name, email),
        timesheets:hrms_timesheets(count),
        leave_requests:hrms_leave_requests(count)
      `,
      )
      .eq("id", id)
      .eq("tenant_id", member.tenant_id)
      .single()

    if (error) throw error

    // Mask PII
    const fieldMap = {
      phone: "hrms.employees.pii.unmask",
      date_of_birth: "hrms.employees.pii.unmask",
      address: "hrms.employees.pii.unmask",
      city: "hrms.employees.pii.unmask",
      state: "hrms.employees.pii.unmask",
      postal_code: "hrms.employees.pii.unmask",
    }

    const maskedData = maskFields(data, features, fieldMap)

    // Audit PII read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "employee:view",
      entity: "hrms_employees",
      entityId: id,
      diff: { pii_accessed: !features["hrms.employees.pii.unmask"] },
    })

    return { success: true, data: maskedData }
  } catch (error) {
    console.error("[v0] Error getting employee:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get employee",
    }
  }
}

// Update employee profile
export async function updateProfile(input: { id: string; patch: z.infer<typeof employeeProfileSchema> }) {
  try {
    const validated = employeeProfileSchema.parse(input.patch)
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures(["hrms.employees.write"])
    if (!features["hrms.employees.write"]) {
      throw new Error("Permission denied")
    }

    // Get current data for diff
    const { data: current } = await supabase
      .from("hrms_employees")
      .select("*")
      .eq("id", input.id)
      .eq("tenant_id", member.tenant_id)
      .single()

    const { data, error } = await supabase
      .from("hrms_employees")
      .update(validated)
      .eq("id", input.id)
      .eq("tenant_id", member.tenant_id)
      .select()
      .single()

    if (error) throw error

    // Audit with diff
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "employee:update",
      entity: "hrms_employees",
      entityId: input.id,
      diff: { before: current, after: validated },
    })

    revalidatePath("/hrms/employees")
    revalidatePath(`/hrms/employees/${input.id}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

// Lifecycle action (onboard/transfer/promote/terminate)
export async function lifecycleAction(input: z.infer<typeof lifecycleActionSchema>) {
  try {
    const validated = lifecycleActionSchema.parse(input)
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures(["hrms.lifecycles.manage"])
    if (!features["hrms.lifecycles.manage"]) {
      throw new Error("Permission denied")
    }

    // Execute action based on type
    let updates: any = {}
    let auditAction = ""

    switch (validated.action) {
      case "onboard":
        updates = { status: "active", hire_date: validated.effective_date }
        auditAction = "employee:onboard"
        break
      case "transfer":
        updates = {
          department: validated.new_department,
          reporting_manager_id: validated.new_manager_id,
        }
        auditAction = "employee:transfer"
        break
      case "promote":
        updates = {
          designation: validated.new_designation,
          department: validated.new_department,
        }
        auditAction = "employee:promote"
        break
      case "terminate":
        updates = {
          status: "terminated",
          termination_date: validated.effective_date,
        }
        auditAction = "employee:terminate"
        break
    }

    const { data, error } = await supabase
      .from("hrms_employees")
      .update(updates)
      .eq("id", validated.id)
      .eq("tenant_id", member.tenant_id)
      .select()
      .single()

    if (error) throw error

    // Audit lifecycle action
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: auditAction,
      entity: "hrms_employees",
      entityId: validated.id,
      diff: { action: validated.action, updates, reason: validated.reason },
    })

    revalidatePath("/hrms/employees")
    revalidatePath(`/hrms/employees/${validated.id}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error lifecycle action:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to execute lifecycle action",
    }
  }
}

// Export directory as CSV
export async function exportDirectoryCsv(filters: z.infer<typeof employeeFilterSchema>) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures(["exports.allowed", "hrms.employees.pii.unmask"])
    if (!features["exports.allowed"]) {
      throw new Error("Permission denied: exports not allowed")
    }

    // Get all employees matching filters (no pagination for export)
    let query = supabase.from("hrms_employees").select("*").eq("tenant_id", member.tenant_id)

    if (filters.status?.length) {
      query = query.in("status", filters.status)
    }
    if (filters.department) {
      query = query.eq("department", filters.department)
    }

    const { data, error } = await query

    if (error) throw error

    // Mask PII if no unmask permission
    const fieldMap = {
      phone: "hrms.employees.pii.unmask",
      date_of_birth: "hrms.employees.pii.unmask",
      address: "hrms.employees.pii.unmask",
    }

    const maskedData = maskFieldsArray(data || [], features, fieldMap)

    // Audit export
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "export:employees",
      entity: "hrms_employees",
      diff: { filters, count: data?.length || 0, pii_masked: !features["hrms.employees.pii.unmask"] },
    })

    // Convert to CSV
    const headers = [
      "Employee ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Employment Type",
      "Status",
      "Hire Date",
    ]
    const rows = maskedData.map((emp) => [
      emp.employee_id,
      emp.first_name,
      emp.last_name,
      emp.email,
      emp.phone || "",
      emp.department || "",
      emp.designation || "",
      emp.employment_type || "",
      emp.status,
      emp.hire_date || "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    return { success: true, data: csv }
  } catch (error) {
    console.error("[v0] Error exporting CSV:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export CSV",
    }
  }
}
