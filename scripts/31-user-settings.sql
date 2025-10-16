-- User Settings & Preferences Schema
-- User-level settings (cross-tenant)

-- User preferences (notifications, AI, theme)
CREATE TABLE IF NOT EXISTS app.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications JSONB DEFAULT '{}'::jsonb,
  ai_config JSONB DEFAULT '{}'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal API keys (user-level)
CREATE TABLE IF NOT EXISTS app.user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,        -- showable (e.g., "sk_live_abc...")
  key_hash TEXT NOT NULL,          -- sha256 hash
  scopes TEXT[] DEFAULT '{}',      -- e.g., ['read:reports', 'write:leads']
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON app.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_prefix ON app.user_api_keys(key_prefix);

-- Personal webhooks (user-level)
CREATE TABLE IF NOT EXISTS app.user_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,          -- ['lead.created', 'invoice.paid']
  enabled BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_webhooks_user ON app.user_webhooks(user_id);

-- Personal integrations (user-level OAuth tokens)
CREATE TABLE IF NOT EXISTS app.user_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,          -- 'google_calendar', 'slack_dm', 'github', 'notion'
  access_token TEXT NOT NULL,      -- encrypted or stub
  refresh_token TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON app.user_integrations(user_id);

-- RLS: user can only see/modify their own rows
ALTER TABLE app.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_integrations ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS pref_self ON app.user_preferences;
CREATE POLICY pref_self ON app.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS keys_self ON app.user_api_keys;
CREATE POLICY keys_self ON app.user_api_keys
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS hooks_self ON app.user_webhooks;
CREATE POLICY hooks_self ON app.user_webhooks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS ints_self ON app.user_integrations;
CREATE POLICY ints_self ON app.user_integrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION app.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_preferences_updated_at ON app.user_preferences;
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON app.user_preferences
  FOR EACH ROW EXECUTE FUNCTION app.update_updated_at();
