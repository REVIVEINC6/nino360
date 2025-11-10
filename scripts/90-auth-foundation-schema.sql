-- =====================================================
-- NINO360 AUTHENTICATION SYSTEM - PHASE 1: FOUNDATION
-- Complete Multi-Tenant Authentication Database Schema
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. CORE AUTHENTICATION TABLES
-- =====================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS auth.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone_number VARCHAR(50),
  phone_verified BOOLEAN DEFAULT FALSE,
  timezone VARCHAR(100) DEFAULT 'UTC',
  locale VARCHAR(10) DEFAULT 'en-US',
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  UNIQUE(tenant_id, email)
);

-- Multi-Factor Authentication
CREATE TABLE IF NOT EXISTS auth.mfa_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  factor_type VARCHAR(50) NOT NULL, -- 'totp', 'sms', 'email', 'webauthn'
  factor_name VARCHAR(100),
  secret_encrypted TEXT, -- Encrypted TOTP secret or device credential
  backup_codes_encrypted TEXT[], -- Encrypted backup codes
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, factor_type, factor_name)
);

-- MFA Verification Attempts
CREATE TABLE IF NOT EXISTS auth.mfa_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  factor_id UUID REFERENCES auth.mfa_factors(id) ON DELETE CASCADE,
  attempt_type VARCHAR(50) NOT NULL, -- 'verify', 'challenge'
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Verification Tokens
CREATE TABLE IF NOT EXISTS auth.email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth Connections
CREATE TABLE IF NOT EXISTS auth.oauth_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'google', 'facebook', 'github', 'microsoft'
  provider_user_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255),
  provider_data JSONB DEFAULT '{}',
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_user_id),
  UNIQUE(user_id, provider)
);

-- =====================================================
-- 2. SESSION MANAGEMENT
-- =====================================================

-- Active Sessions
CREATE TABLE IF NOT EXISTS auth.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  refresh_token VARCHAR(255) UNIQUE,
  device_id VARCHAR(255),
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- 'web', 'mobile', 'tablet', 'desktop'
  os VARCHAR(100),
  browser VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  location JSONB, -- {country, city, lat, lon}
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_active ON auth.sessions(user_id, is_active);
CREATE INDEX idx_sessions_token ON auth.sessions(session_token);
CREATE INDEX idx_sessions_expires ON auth.sessions(expires_at);

-- Session Activity Log
CREATE TABLE IF NOT EXISTS auth.session_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES auth.sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'login', 'refresh', 'logout', 'timeout'
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_activity_session ON auth.session_activity(session_id);
CREATE INDEX idx_session_activity_user ON auth.session_activity(user_id);

-- =====================================================
-- 3. SECURITY & AUDIT
-- =====================================================

-- Login Attempts (Rate Limiting & Brute Force Protection)
CREATE TABLE IF NOT EXISTS auth.login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(255),
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  location JSONB,
  mfa_required BOOLEAN DEFAULT FALSE,
  mfa_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email ON auth.login_attempts(email, created_at DESC);
CREATE INDEX idx_login_attempts_ip ON auth.login_attempts(ip_address, created_at DESC);
CREATE INDEX idx_login_attempts_user ON auth.login_attempts(user_id, created_at DESC);

-- Security Events
CREATE TABLE IF NOT EXISTS auth.security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- 'suspicious_login', 'password_change', 'mfa_disabled', etc.
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON auth.security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_type ON auth.security_events(event_type, created_at DESC);
CREATE INDEX idx_security_events_severity ON auth.security_events(severity, resolved);

-- Audit Trail with Blockchain Verification
CREATE TABLE IF NOT EXISTS auth.audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  -- Blockchain verification
  hash VARCHAR(64) NOT NULL,
  previous_hash VARCHAR(64),
  block_number BIGINT,
  blockchain_verified BOOLEAN DEFAULT FALSE,
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_trail_user ON auth.audit_trail(user_id, created_at DESC);
CREATE INDEX idx_audit_trail_resource ON auth.audit_trail(resource_type, resource_id);
CREATE INDEX idx_audit_trail_hash ON auth.audit_trail(hash);

-- =====================================================
-- 4. DEVICE MANAGEMENT
-- =====================================================

-- Trusted Devices
CREATE TABLE IF NOT EXISTS auth.trusted_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  device_id VARCHAR(255) NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(50),
  device_fingerprint TEXT NOT NULL,
  os VARCHAR(100),
  browser VARCHAR(100),
  is_trusted BOOLEAN DEFAULT FALSE,
  trust_expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  ip_address INET,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_fingerprint)
);

CREATE INDEX idx_trusted_devices_user ON auth.trusted_devices(user_id, is_trusted);

-- =====================================================
-- 5. AI-POWERED SECURITY
-- =====================================================

-- AI Anomaly Detection
CREATE TABLE IF NOT EXISTS auth.ai_anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anomaly_type VARCHAR(100) NOT NULL, -- 'unusual_location', 'unusual_time', 'unusual_device', etc.
  confidence_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
  risk_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  detected_patterns JSONB,
  baseline_patterns JSONB,
  ai_model_version VARCHAR(50),
  action_taken VARCHAR(100), -- 'blocked', 'challenged', 'allowed', 'flagged'
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  false_positive BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_anomalies_user ON auth.ai_anomalies(user_id, created_at DESC);
CREATE INDEX idx_ai_anomalies_risk ON auth.ai_anomalies(risk_level, reviewed);

-- AI Security Recommendations
CREATE TABLE IF NOT EXISTS auth.ai_security_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'urgent'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  action_items JSONB,
  ai_reasoning TEXT,
  confidence_score DECIMAL(5,4),
  implemented BOOLEAN DEFAULT FALSE,
  implemented_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_recommendations_user ON auth.ai_security_recommendations(user_id, implemented, dismissed);

-- =====================================================
-- 6. RATE LIMITING & THROTTLING
-- =====================================================

-- Rate Limit Buckets
CREATE TABLE IF NOT EXISTS auth.rate_limit_buckets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  identifier VARCHAR(255) NOT NULL, -- email, IP, user_id
  identifier_type VARCHAR(50) NOT NULL, -- 'email', 'ip', 'user'
  action VARCHAR(100) NOT NULL, -- 'login', 'password_reset', 'mfa_verify'
  attempts INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, identifier_type, action, window_start)
);

CREATE INDEX idx_rate_limit_identifier ON auth.rate_limit_buckets(identifier, identifier_type, action);
CREATE INDEX idx_rate_limit_window ON auth.rate_limit_buckets(window_end);

-- =====================================================
-- 7. MOBILE SUPPORT
-- =====================================================

-- Mobile Device Registrations
CREATE TABLE IF NOT EXISTS auth.mobile_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  device_id VARCHAR(255) NOT NULL UNIQUE,
  device_name VARCHAR(255),
  platform VARCHAR(50) NOT NULL, -- 'ios', 'android'
  platform_version VARCHAR(50),
  app_version VARCHAR(50),
  push_token TEXT,
  push_enabled BOOLEAN DEFAULT TRUE,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  biometric_type VARCHAR(50), -- 'fingerprint', 'face', 'iris'
  last_sync_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mobile_devices_user ON auth.mobile_devices(user_id, is_active);

-- Push Notifications
CREATE TABLE IF NOT EXISTS auth.push_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  device_id UUID REFERENCES auth.mobile_devices(id) ON DELETE CASCADE,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed BOOLEAN DEFAULT FALSE,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_push_notifications_user ON auth.push_notifications(user_id, created_at DESC);
CREATE INDEX idx_push_notifications_device ON auth.push_notifications(device_id);

-- =====================================================
-- 8. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON auth.user_profiles
  FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

CREATE TRIGGER update_mfa_factors_updated_at BEFORE UPDATE ON auth.mfa_factors
  FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

CREATE TRIGGER update_oauth_connections_updated_at BEFORE UPDATE ON auth.oauth_connections
  FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

-- Function: Generate blockchain hash for audit trail
CREATE OR REPLACE FUNCTION auth.generate_audit_hash()
RETURNS TRIGGER AS $$
DECLARE
  prev_hash VARCHAR(64);
  content TEXT;
BEGIN
  -- Get previous hash
  SELECT hash INTO prev_hash
  FROM auth.audit_trail
  WHERE tenant_id = NEW.tenant_id
  ORDER BY created_at DESC, id DESC
  LIMIT 1;
  
  -- Generate content to hash
  content := NEW.tenant_id::TEXT || NEW.user_id::TEXT || NEW.action || 
             NEW.resource_type || COALESCE(NEW.resource_id::TEXT, '') ||
             COALESCE(prev_hash, '0') || NEW.created_at::TEXT;
  
  -- Generate hash
  NEW.hash := encode(digest(content, 'sha256'), 'hex');
  NEW.previous_hash := prev_hash;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_audit_hash_trigger BEFORE INSERT ON auth.audit_trail
  FOR EACH ROW EXECUTE FUNCTION auth.generate_audit_hash();

-- Function: Clean expired tokens
CREATE OR REPLACE FUNCTION auth.clean_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.password_reset_tokens WHERE expires_at < NOW() AND used_at IS NULL;
  DELETE FROM auth.email_verification_tokens WHERE expires_at < NOW() AND verified_at IS NULL;
  DELETE FROM auth.sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE auth.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.session_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.ai_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.ai_security_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mobile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.push_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY user_profiles_policy ON auth.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY mfa_factors_policy ON auth.mfa_factors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY sessions_policy ON auth.sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY trusted_devices_policy ON auth.trusted_devices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY mobile_devices_policy ON auth.mobile_devices
  FOR ALL USING (auth.uid() = user_id);

-- Admin policies for security events and audit trail
CREATE POLICY security_events_admin_policy ON auth.security_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.user_profiles
      WHERE id = auth.uid()
      AND (metadata->>'role' = 'admin' OR metadata->>'role' = 'security_admin')
    )
  );

CREATE POLICY audit_trail_admin_policy ON auth.audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.user_profiles
      WHERE id = auth.uid()
      AND (metadata->>'role' = 'admin' OR metadata->>'role' = 'auditor')
    )
  );

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_profiles_tenant ON auth.user_profiles(tenant_id);
CREATE INDEX idx_user_profiles_email ON auth.user_profiles(email);
CREATE INDEX idx_mfa_factors_user ON auth.mfa_factors(user_id, is_verified);
CREATE INDEX idx_oauth_connections_user ON auth.oauth_connections(user_id);
CREATE INDEX idx_oauth_connections_provider ON auth.oauth_connections(provider, provider_user_id);

-- =====================================================
-- 11. SAMPLE DATA FOR DEVELOPMENT
-- =====================================================

-- Note: In production, this would be populated through the application
-- This is just for development/testing purposes

COMMENT ON TABLE auth.user_profiles IS 'Extended user profile information beyond Supabase auth.users';
COMMENT ON TABLE auth.mfa_factors IS 'Multi-factor authentication factors for users';
COMMENT ON TABLE auth.sessions IS 'Active user sessions with device information';
COMMENT ON TABLE auth.audit_trail IS 'Blockchain-verified audit trail for compliance';
COMMENT ON TABLE auth.ai_anomalies IS 'AI-detected security anomalies and threats';
COMMENT ON TABLE auth.rate_limit_buckets IS 'Rate limiting buckets for brute force protection';
COMMENT ON TABLE auth.mobile_devices IS 'Registered mobile devices for push notifications';

-- =====================================================
-- END OF PHASE 1: FOUNDATION SCHEMA
-- =====================================================
