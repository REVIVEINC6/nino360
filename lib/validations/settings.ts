import { z } from "zod"

export const settingsSchema = z.object({
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  key: z.string().min(1, "Key is required").max(100, "Key too long"),
  value: z.any(),
  description: z.string().optional(),
  data_type: z.enum(["string", "number", "boolean", "json", "array"]).default("string"),
  is_sensitive: z.boolean().default(false),
  is_required: z.boolean().default(false),
  // z.record in this zod version expects a key schema and a value schema.
  validation_rules: z.record(z.string(), z.any()).optional(),
  default_value: z.any().optional(),
})

export const settingUpdateSchema = z.object({
  id: z.string().uuid("Invalid setting ID"),
  value: z.any(),
})

export const bulkSettingsSchema = z.object({
  settings: z.array(settingUpdateSchema).min(1, "At least one setting is required"),
})

export const settingsQuerySchema = z.object({
  category: z.string().optional(),
  includeMetadata: z.boolean().default(false),
  includeSensitive: z.boolean().default(false),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
})

export const settingsCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name too long"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
})

export type SettingsInput = z.infer<typeof settingsSchema>
export type SettingUpdate = z.infer<typeof settingUpdateSchema>
export type BulkSettingsInput = z.infer<typeof bulkSettingsSchema>
export type SettingsQuery = z.infer<typeof settingsQuerySchema>
export type SettingsCategoryInput = z.infer<typeof settingsCategorySchema>
