-- ============================================================================
-- Phase 7: User Settings & Preferences Tables
-- ============================================================================
-- Creates tables for global user settings hub:
-- - user_preferences (notifications, AI, theme)
-- - user_api_keys (personal API keys)
-- - user_webhooks (personal webhooks)
-- - user_integrations (OAuth tokens)
-- ============================================================================

BEGIN;

-- Replaced RAISE NOTICE with DO block to avoid syntax error
DO $$ BEGIN
  RAISE NOTICE '🚀 Phase 7: Creating User Settings Tables...';
END $$;

-- ============================================================================
-- 1. User Preferences (cross-tenant user settings)
-- ============================================================================

-- Changed app. to public. schema
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications JSONB DEFAULT '{}'::JSONB,
  ai_config JSONB DEFAULT '{}'::JSONB,
  theme JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_preferences IS 'User-level preferences across all tenants';
COMMENT ON COLUMN public.user_preferences.notifications IS 'Email, in-app, SMS, digest, quiet hours settings';
COMMENT ON COLUMN public.user_preferences.ai_config IS 'AI model, tone, privacy, token limits';
COMMENT ON COLUMN public.user_preferences.theme IS 'Dark/light mode, high contrast, reduce motion, font scale';

-- ============================================================================
-- 2. User API Keys (personal API keys for external integrations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,        -- First 8 chars, showable (e.g., "nino_abc")
  key_hash TEXT NOT NULL,          -- SHA-256 hash of full key
  scopes TEXT[] DEFAULT '{}',      -- e.g., ['read:reports', 'write:crm']
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_prefix ON public.user_api_keys(key_prefix);

COMMENT ON TABLE public.user_api_keys IS 'Personal API keys for programmatic access';
COMMENT ON COLUMN public.user_api_keys.key_hash IS 'SHA-256 hash - never store plaintext';
COMMENT ON COLUMN public.user_api_keys.key_prefix IS 'First 8 chars for identification';

-- ============================================================================
-- 3. User Webhooks (personal webhook endpoints)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,            -- HMAC secret for signature verification
  events TEXT[] NOT NULL,          -- e.g., ['lead.created', 'invoice.paid']
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_webhooks_user ON public.user_webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_webhooks_active ON public.user_webhooks(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE public.user_webhooks IS 'Personal webhook endpoints for event notifications';
COMMENT ON COLUMN public.user_webhooks.secret IS 'HMAC secret - rotate periodically';

-- ============================================================================
-- 4. User Integrations (OAuth tokens for external services)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,          -- 'google_calendar', 'slack_dm', 'github', 'notion'
  access_token TEXT NOT NULL,      -- Encrypted or use Vault
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  meta JSONB DEFAULT '{}'::JSONB,  -- Provider-specific metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON public.user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON public.user_integrations(provider);

COMMENT ON TABLE public.user_integrations IS 'OAuth tokens for personal integrations';
COMMENT ON COLUMN public.user_integrations.access_token IS 'Encrypted token - use pgcrypto or Vault';

-- ============================================================================
-- 5. Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

-- User can only access their own preferences
DROP POLICY IF EXISTS pref_self ON public.user_preferences;
CREATE POLICY pref_self ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User can only access their own API keys
DROP POLICY IF EXISTS keys_self ON public.user_api_keys;
CREATE POLICY keys_self ON public.user_api_keys
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User can only access their own webhooks
DROP POLICY IF EXISTS hooks_self ON public.user_webhooks;
CREATE POLICY hooks_self ON public.user_webhooks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User can only access their own integrations
DROP POLICY IF EXISTS ints_self ON public.user_integrations;
CREATE POLICY ints_self ON public.user_integrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. Updated At Triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_integrations_updated_at ON public.user_integrations;
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Wrap RAISE NOTICE in DO block for proper SQL syntax
DO $$
BEGIN
  RAISE NOTICE '✅ Phase 7: User Settings Tables Created Successfully!';
  RAISE NOTICE '📊 Tables: user_preferences, user_api_keys, user_webhooks, user_integrations';
  RAISE NOTICE '🔒 RLS Policies: Enabled for all tables (user-only access)';
END $$;
