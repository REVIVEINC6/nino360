// Authentication System Constants

export const AUTH_CONSTANTS = {
  // Session
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  REMEMBER_ME_DURATION: 90 * 24 * 60 * 60 * 1000, // 90 days

  // Rate Limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  MAX_PASSWORD_RESET_ATTEMPTS: 3,
  PASSWORD_RESET_LOCKOUT_DURATION: 60 * 60 * 1000, // 1 hour
  MAX_MFA_ATTEMPTS: 3,
  MFA_LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes

  // Token Expiry
  PASSWORD_RESET_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  EMAIL_VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  MFA_CODE_EXPIRY: 5 * 60 * 1000, // 5 minutes

  // Password Requirements
  MIN_PASSWORD_LENGTH: 12,
  MAX_PASSWORD_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,

  // MFA
  TOTP_WINDOW: 1, // Allow 1 step before/after current time
  BACKUP_CODES_COUNT: 10,

  // Device Trust
  DEVICE_TRUST_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days

  // AI Security
  ANOMALY_CONFIDENCE_THRESHOLD: 0.75,
  HIGH_RISK_THRESHOLD: 0.9,

  // Blockchain
  AUDIT_BATCH_SIZE: 100,
  BLOCKCHAIN_VERIFICATION_INTERVAL: 60 * 60 * 1000, // 1 hour
} as const

export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  GITHUB: "github",
  MICROSOFT: "microsoft",
  APPLE: "apple",
  LINKEDIN: "linkedin",
} as const

export const MFA_TYPES = {
  TOTP: "totp",
  SMS: "sms",
  EMAIL: "email",
  WEBAUTHN: "webauthn",
} as const

export const SECURITY_EVENT_TYPES = {
  SUSPICIOUS_LOGIN: "suspicious_login",
  PASSWORD_CHANGE: "password_change",
  MFA_DISABLED: "mfa_disabled",
  MFA_ENABLED: "mfa_enabled",
  ACCOUNT_LOCKED: "account_locked",
  ACCOUNT_UNLOCKED: "account_unlocked",
  UNUSUAL_LOCATION: "unusual_location",
  UNUSUAL_DEVICE: "unusual_device",
  BRUTE_FORCE_ATTEMPT: "brute_force_attempt",
  TOKEN_THEFT_SUSPECTED: "token_theft_suspected",
} as const

export const ANOMALY_TYPES = {
  UNUSUAL_LOCATION: "unusual_location",
  UNUSUAL_TIME: "unusual_time",
  UNUSUAL_DEVICE: "unusual_device",
  RAPID_REQUESTS: "rapid_requests",
  IMPOSSIBLE_TRAVEL: "impossible_travel",
  SUSPICIOUS_PATTERN: "suspicious_pattern",
} as const
