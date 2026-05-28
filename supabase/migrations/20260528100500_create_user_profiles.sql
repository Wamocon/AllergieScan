-- Migration: Create user_profiles table
-- Stores allergy profiles (GDPR: health data - Art. 9)
-- RLS ensures users can only access their own profile

CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  allergen_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Format: [{"allergen_id": "uuid", "risk_level": "critical|high|medium"}]
  language        TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('de', 'en')),
  theme           TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  scan_count_month INTEGER NOT NULL DEFAULT 0,
  scan_count_reset_at TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now()),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
