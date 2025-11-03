// Authentication System Types

export interface UserProfile {
  id: string
  tenant_id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone_number?: string
  phone_verified: boolean
  timezone: string
  locale: string
  preferences: Record<string, any>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface MFAFactor {
  id: string
  user_id: string
  tenant_id: string
  factor_type: "totp" | "sms" | "email" | "webauthn"
  factor_name?: string
  is_verified: boolean
  is_primary: boolean
  last_used_at?: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  tenant_id: string
  session_token: string
  device_id?: string
  device_name?: string
  device_type?: "web" | "mobile" | "tablet" | "desktop"
  os?: string
  browser?: string
  ip_address?: string
  user_agent?: string
  location?: {
    country?: string
    city?: string
    lat?: number
    lon?: number
  }
  is_active: boolean
  last_activity_at: string
  expires_at: string
  created_at: string
}

export interface SecurityEvent {
  id: string
  tenant_id: string
  user_id?: string
  event_type: string
  severity: "low" | "medium" | "high" | "critical"
  description?: string
  ip_address?: string
  user_agent?: string
  metadata: Record<string, any>
  resolved: boolean
  resolved_at?: string
  resolved_by?: string
  created_at: string
}

export interface AIAnomaly {
  id: string
  tenant_id: string
  user_id?: string
  anomaly_type: string
  confidence_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  description?: string
  detected_patterns: Record<string, any>
  baseline_patterns: Record<string, any>
  ai_model_version?: string
  action_taken?: "blocked" | "challenged" | "allowed" | "flagged"
  reviewed: boolean
  reviewed_at?: string
  reviewed_by?: string
  false_positive?: boolean
  created_at: string
}

export interface TrustedDevice {
  id: string
  user_id: string
  tenant_id: string
  device_id: string
  device_name?: string
  device_type?: string
  device_fingerprint: string
  os?: string
  browser?: string
  is_trusted: boolean
  trust_expires_at?: string
  last_used_at?: string
  ip_address?: string
  location?: Record<string, any>
  created_at: string
}

export interface MobileDevice {
  id: string
  user_id: string
  tenant_id: string
  device_id: string
  device_name?: string
  platform: "ios" | "android"
  platform_version?: string
  app_version?: string
  push_token?: string
  push_enabled: boolean
  biometric_enabled: boolean
  biometric_type?: "fingerprint" | "face" | "iris"
  last_sync_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RateLimitBucket {
  id: string
  tenant_id?: string
  identifier: string
  identifier_type: "email" | "ip" | "user"
  action: string
  attempts: number
  window_start: string
  window_end: string
  blocked_until?: string
  created_at: string
  updated_at: string
}

export interface AuditTrailEntry {
  id: string
  tenant_id: string
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  metadata: Record<string, any>
  hash: string
  previous_hash?: string
  block_number?: number
  blockchain_verified: boolean
  blockchain_tx_hash?: string
  created_at: string
}
