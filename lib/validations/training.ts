import { z } from "zod"

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration_hours: z.number().min(1, "Duration must be at least 1 hour").max(1000, "Duration too long"),
  format: z.enum(["online", "classroom", "hybrid", "self_paced"]),
  instructor: z.string().min(1, "Instructor is required"),
  max_participants: z.number().min(1, "Must allow at least 1 participant").max(1000, "Too many participants"),
  cost: z.number().min(0, "Cost cannot be negative"),
  currency: z.string().default("USD"),
  prerequisites: z.array(z.string()).default([]),
  learning_objectives: z.array(z.string()).default([]),
  certification_available: z.boolean().default(false),
  status: z.enum(["draft", "active", "inactive", "archived"]).default("draft"),
})

export const createSessionSchema = z
  .object({
    program_id: z.string().uuid("Invalid program ID"),
    session_name: z.string().min(1, "Session name is required").max(200, "Session name too long"),
    start_date: z.string().datetime("Invalid start date"),
    end_date: z.string().datetime("Invalid end date"),
    location: z.string().min(1, "Location is required"),
    virtual_link: z.string().url("Invalid virtual link").optional(),
    instructor: z.string().min(1, "Instructor is required"),
    max_participants: z.number().min(1, "Must allow at least 1 participant").max(1000, "Too many participants"),
    materials: z.array(z.string()).default([]),
    status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled"),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })

export const createEnrollmentSchema = z.object({
  session_id: z.string().uuid("Invalid session ID"),
  user_id: z.string().uuid("Invalid user ID"),
  status: z.enum(["enrolled", "in_progress", "completed", "dropped", "failed"]).default("enrolled"),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type CreateSessionInput = z.infer<typeof createSessionSchema>
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>
