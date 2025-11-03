import { z } from "zod"

// Branding validators
export const brandingSchema = z.object({
  logo_url: z.string().url().optional().nullable(),
  primary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  accent_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  dark_mode: z.boolean().optional(),
})

export type BrandingInput = z.infer<typeof brandingSchema>

// Locale validators
export const localeSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  locale: z.string().min(1, "Locale is required"),
  week_start: z.enum(["mon", "sun"]),
  number_format: z.enum(["1,234.56", "1.234,56"]),
  date_format: z.enum(["ISO", "MDY", "DMY"]),
  currency: z.string().length(3, "Currency must be 3 letters"),
})

export type LocaleInput = z.infer<typeof localeSchema>

// Policies validators
export const policiesSchema = z.object({
  securityMd: z.string().optional(),
  privacyMd: z.string().optional(),
  acceptableUseMd: z.string().optional(),
  jsonPolicy: z.record(z.any()).optional(),
})

export type PoliciesInput = z.infer<typeof policiesSchema>

// AI Draft validators
export const aiDraftSchema = z.object({
  topics: z.array(z.string()).min(1, "At least one topic required"),
})

export type AiDraftInput = z.infer<typeof aiDraftSchema>

// Integration validators
export const integrationSchema = z.object({
  provider: z.enum(["google_calendar", "email_smtp", "slack_webhook"]),
  config: z.record(z.any()),
})

export type IntegrationInput = z.infer<typeof integrationSchema>

// Feature flags validators
export const featureFlagsSchema = z.object({
  flags: z.record(z.boolean()),
})

export type FeatureFlagsInput = z.infer<typeof featureFlagsSchema>

// Security validators
const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/

export const securitySchema = z.object({
  ip_allowlist: z.array(z.string().regex(cidrRegex, "Invalid CIDR notation")),
  dlp_preset: z.enum(["standard", "strict", "custom"]),
})

export type SecurityInput = z.infer<typeof securitySchema>

// Import/Export validators
export const importConfigSchema = z.object({
  strategy: z.enum(["merge", "replace"]),
})

export type ImportConfigInput = z.infer<typeof importConfigSchema>
