import { z } from "zod"

export const createBenchResourceSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  experience_years: z.number().min(0, "Experience cannot be negative").max(50, "Experience too high"),
  availability_status: z.enum(["available", "allocated", "on_leave", "unavailable"]).default("available"),
  billing_rate: z.number().min(0, "Billing rate cannot be negative").optional(),
  cost_rate: z.number().min(0, "Cost rate cannot be negative").optional(),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  notes: z.string().optional(),
})

export const createProjectAllocationSchema = z
  .object({
    resource_id: z.string().uuid("Invalid resource ID"),
    project_name: z.string().min(1, "Project name is required").max(200, "Project name too long"),
    client_name: z.string().optional(),
    allocation_percentage: z
      .number()
      .min(1, "Allocation must be at least 1%")
      .max(100, "Allocation cannot exceed 100%"),
    start_date: z.string().date("Invalid start date"),
    end_date: z.string().date("Invalid end date").optional(),
    billing_rate: z.number().min(0, "Billing rate cannot be negative").optional(),
    role: z.string().optional(),
    status: z.enum(["planned", "active", "completed", "cancelled"]).default("planned"),
    notes: z.string().optional(),
  })
  .refine((data) => !data.end_date || new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })

export type CreateBenchResourceInput = z.infer<typeof createBenchResourceSchema>
export type CreateProjectAllocationInput = z.infer<typeof createProjectAllocationSchema>
