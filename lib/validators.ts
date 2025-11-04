import { z } from "zod"

// Auth validators
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

// AI Marketing validators
export const aiMarketingSchema = z.object({
  productName: z.string().min(1, "Product name is required").max(100, "Product name is too long"),
  persona: z.enum(["SMB Owner", "HR Lead", "CTO", "Marketer", "Custom"]),
  tone: z.enum(["Professional", "Friendly", "Bold", "Technical"]),
  variants: z.number().int().min(1).max(3),
  locale: z.string().default("en-US"),
  features: z.array(z.string()).default([]),
  refine: z.string().optional(),
})

export type AIMarketingInput = z.infer<typeof aiMarketingSchema>

export interface AIMarketingVariant {
  headline: string
  subhead: string
  bullets: string[]
  cta: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  imagePrompt: string
}

export interface AIMarketingResponse {
  ok: boolean
  data?: AIMarketingVariant[]
  error?: {
    code: string
    message: string
  }
}
