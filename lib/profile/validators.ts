import { z } from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
  title: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  locale: z.string().default("en"),
  timezone: z.string().default("America/New_York"),
  avatar_url: z.string().url().optional().or(z.literal("")),
})

export const notificationPrefsSchema = z.object({
  email: z
    .object({
      digestDaily: z.boolean().default(false),
      digestWeekly: z.boolean().default(true),
      mentions: z.boolean().default(true),
      updates: z.boolean().default(true),
    })
    .optional(),
  inapp: z
    .object({
      enabled: z.boolean().default(true),
      sound: z.boolean().default(false),
    })
    .optional(),
  sms: z
    .object({
      enabled: z.boolean().default(false),
      urgentOnly: z.boolean().default(true),
    })
    .optional(),
})

export const aiPrivacySchema = z.object({
  promptLogging: z.boolean().default(true),
  tone: z.enum(["neutral", "friendly", "formal"]).default("neutral"),
  model: z.string().optional(),
  exportRequest: z.boolean().default(false),
})

export const deleteAccountSchema = z.object({
  confirm: z.literal("DELETE", {
    errorMap: () => ({ message: 'You must type "DELETE" to confirm' }),
  }),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type NotificationPrefsInput = z.infer<typeof notificationPrefsSchema>
export type AiPrivacyInput = z.infer<typeof aiPrivacySchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
