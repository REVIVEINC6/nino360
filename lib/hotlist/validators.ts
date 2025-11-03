import { z } from "zod"

// =====================================================
// HOTLIST CANDIDATE VALIDATORS
// =====================================================

export const hotlistCandidateSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  candidate_id: z.string().uuid(),
  priority_level: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  status: z.enum(["active", "packaged", "sent", "interested", "archived"]).default("active"),
  readiness_score: z.number().int().min(0).max(100).default(0),
  match_score: z.number().int().min(0).max(100).default(0),
  added_reason: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
})

export type HotlistCandidateInput = z.infer<typeof hotlistCandidateSchema>

// =====================================================
// HOTLIST REQUIREMENT VALIDATORS
// =====================================================

export const hotlistRequirementSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  client_id: z.string().uuid().optional(),
  client_name: z.string().optional(),
  client_contact_name: z.string().optional(),
  client_contact_email: z.string().email().optional(),
  client_contact_phone: z.string().optional(),
  skills: z.any().optional(), // JSONB
  required_skills: z.array(z.string()).default([]),
  preferred_skills: z.array(z.string()).default([]),
  experience_years: z.number().int().min(0).optional(),
  work_authorization: z.array(z.string()).default([]),
  location: z.string().optional(),
  remote_allowed: z.boolean().default(false),
  pay_range_min: z.number().min(0).optional(),
  pay_range_max: z.number().min(0).optional(),
  currency: z.string().default("USD"),
  urgency: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  status: z.enum(["open", "in_progress", "filled", "on_hold", "closed"]).default("open"),
  open_slots: z.number().int().min(1).default(1),
  filled_slots: z.number().int().min(0).default(0),
  posted_date: z.string().optional(),
  target_fill_date: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
})

export type HotlistRequirementInput = z.infer<typeof hotlistRequirementSchema>

// =====================================================
// HOTLIST MATCH VALIDATORS
// =====================================================

export const hotlistMatchSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  requirement_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
  match_score: z.number().int().min(0).max(100).default(0),
  skills_score: z.number().int().min(0).max(100).default(0),
  availability_score: z.number().int().min(0).max(100).default(0),
  history_score: z.number().int().min(0).max(100).default(0),
  ai_score: z.number().int().min(0).max(100).optional(),
  explainability: z.any().optional(), // JSONB
  match_reasons: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([]),
  status: z.enum(["suggested", "reviewed", "submitted", "rejected", "accepted"]).default("suggested"),
  rank: z.number().int().optional(),
  matched_by: z.enum(["auto", "manual", "ai"]).default("auto"),
  notes: z.string().optional(),
})

export type HotlistMatchInput = z.infer<typeof hotlistMatchSchema>

// =====================================================
// HOTLIST ONE-PAGER VALIDATORS
// =====================================================

export const hotlistOnePagerSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  candidate_id: z.string().uuid(),
  requirement_id: z.string().uuid().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  skills: z.any().optional(), // JSONB
  projects: z.any().optional(), // JSONB
  highlights: z.array(z.string()).default([]),
  availability: z.string().optional(),
  contact_masked: z.boolean().default(true),
  generated_by: z.enum(["ai", "manual", "template"]).default("ai"),
  tone: z.enum(["professional", "conversational", "urgent", "formal"]).default("professional"),
  anonymized: z.boolean().default(false),
  version: z.number().int().default(1),
})

export type HotlistOnePagerInput = z.infer<typeof hotlistOnePagerSchema>

// =====================================================
// HOTLIST CAMPAIGN VALIDATORS
// =====================================================

export const hotlistCampaignSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  name: z.string().min(2, "Campaign name is required"),
  type: z.enum(["outreach", "submission", "follow_up", "nurture"]).default("outreach"),
  requirement_id: z.string().uuid().optional(),
  candidate_ids: z.array(z.string().uuid()).default([]),
  recipient_type: z.enum(["client", "vendor", "internal"]).optional(),
  recipient_emails: z.array(z.string().email()).default([]),
  template_id: z.string().uuid().optional(),
  subject: z.string().max(500).optional(),
  body: z.string().optional(),
  personalized: z.boolean().default(false),
  channel: z.enum(["email", "sms", "linkedin", "portal"]).default("email"),
  send_window_start: z.string().optional(),
  send_window_end: z.string().optional(),
  throttle_limit: z.number().int().min(1).default(50),
  status: z.enum(["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).default("draft"),
})

export type HotlistCampaignInput = z.infer<typeof hotlistCampaignSchema>

// =====================================================
// HOTLIST REPLY VALIDATORS
// =====================================================

export const hotlistReplySchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  message_id: z.string().uuid().optional(),
  campaign_id: z.string().uuid().optional(),
  candidate_id: z.string().uuid().optional(),
  from_email: z.string().email(),
  from_name: z.string().optional(),
  subject: z.string().optional(),
  body: z.string(),
  intent_label: z
    .enum([
      "interested",
      "maybe",
      "not_interested",
      "need_more_info",
      "request_interview",
      "request_rate",
      "out_of_office",
      "unsubscribe",
    ])
    .optional(),
  intent_confidence: z.number().min(0).max(1).optional(),
  suggested_action: z.string().optional(),
})

export type HotlistReplyInput = z.infer<typeof hotlistReplySchema>

// =====================================================
// HOTLIST CONSENT VALIDATORS
// =====================================================

export const hotlistConsentSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  candidate_id: z.string().uuid(),
  share_id: z.string().uuid().optional(),
  share_type: z.enum(["campaign", "message", "export", "onepager"]).optional(),
  requested_for: z.string(),
  requested_reason: z.string().optional(),
  fields_revealed: z.array(z.string()).default([]),
  expires_at: z.string().optional(),
})

export type HotlistConsentInput = z.infer<typeof hotlistConsentSchema>

// =====================================================
// HOTLIST AUTOMATION RULE VALIDATORS
// =====================================================

export const hotlistAutomationRuleSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  name: z.string().min(2, "Rule name is required"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  trigger_type: z.enum([
    "requirement.urgent",
    "candidate.added",
    "availability_in_14_days",
    "low_supply_skill",
    "manual",
    "scheduled",
  ]),
  trigger_conditions: z.any().optional(), // JSONB
  actions: z.any().optional(), // JSONB array
  throttle_limit: z.number().int().optional(),
  throttle_window_minutes: z.number().int().optional(),
  priority: z.number().int().min(1).max(10).default(5),
})

export type HotlistAutomationRuleInput = z.infer<typeof hotlistAutomationRuleSchema>

// =====================================================
// FILTER & QUERY VALIDATORS
// =====================================================

export const hotlistCandidateFiltersSchema = z.object({
  status: z.enum(["active", "packaged", "sent", "interested", "archived"]).optional(),
  priority_level: z.enum(["critical", "high", "medium", "low"]).optional(),
  min_readiness_score: z.number().int().min(0).max(100).optional(),
  skills: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
})

export type HotlistCandidateFilters = z.infer<typeof hotlistCandidateFiltersSchema>

export const hotlistRequirementFiltersSchema = z.object({
  status: z.enum(["open", "in_progress", "filled", "on_hold", "closed"]).optional(),
  urgency: z.enum(["critical", "high", "medium", "low"]).optional(),
  client_id: z.string().uuid().optional(),
  skills: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
})

export type HotlistRequirementFilters = z.infer<typeof hotlistRequirementFiltersSchema>

// =====================================================
// ANALYTICS VALIDATORS
// =====================================================

export const hotlistAnalyticsQuerySchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  metric: z
    .enum(["response_rate", "time_to_submit", "conversion_rate", "campaign_performance", "match_accuracy"])
    .optional(),
})

export type HotlistAnalyticsQuery = z.infer<typeof hotlistAnalyticsQuerySchema>
