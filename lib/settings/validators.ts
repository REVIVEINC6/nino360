import { z } from "zod"

// Account
export const accountSchema = z.object({
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional().nullable(),
  locale: z.string().default("en"),
  timezone: z.string().default("America/New_York"),
})

// Notifications
export const notificationsSchema = z.object({
  email: z.object({
    enabled: z.boolean().default(true),
    leads: z.boolean().default(true),
    interviews: z.boolean().default(true),
    invoices: z.boolean().default(true),
    reports: z.boolean().default(false),
  }),
  inapp: z.object({
    enabled: z.boolean().default(true),
    sound: z.boolean().default(true),
  }),
  sms: z.object({
    enabled: z.boolean().default(false),
  }),
  digest: z.object({
    daily: z.boolean().default(false),
    weekly: z.boolean().default(true),
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    start: z.string().default("22:00"),
    end: z.string().default("08:00"),
  }),
})

// AI Config
export const aiConfigSchema = z.object({
  model: z.enum(["gpt-4", "gpt-3.5-turbo", "claude-3", "grok-2"]).default("gpt-4"),
  tone: z.enum(["neutral", "friendly", "formal"]).default("neutral"),
  redaction: z.boolean().default(true),
  logPrompts: z.boolean().default(false),
  tokenLimit: z.number().min(100).max(4000).default(2000),
  autoSummarize: z.boolean().default(true),
})

// Theme
export const themeSchema = z.object({
  mode: z.enum(["dark", "light", "system"]).default("dark"),
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  fontScale: z.number().min(0.8).max(1.5).default(1.0),
})

// API Key
export const apiKeySchema = z.object({
  name: z.string().min(1).max(50),
  scopes: z.array(z.string()).min(1),
  expires_at: z.string().datetime().optional().nullable(),
})

// Webhook
export const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
})
