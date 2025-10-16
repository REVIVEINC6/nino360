import { z } from "zod"

export const dateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
})

export const usageQuerySchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  grain: z.enum(["day", "week", "month"]).default("day"),
})

export const exportSchema = z.object({
  kind: z.enum(["csv", "pdf"]),
  sections: z.array(z.string()),
  from: z.string().datetime(),
  to: z.string().datetime(),
})

export type DateRange = z.infer<typeof dateRangeSchema>
export type UsageQuery = z.infer<typeof usageQuerySchema>
export type ExportRequest = z.infer<typeof exportSchema>
