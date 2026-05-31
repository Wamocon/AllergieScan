-- V17: Multi-profile support (family members)
-- Each user can have multiple allergen profiles (e.g. for children)

CREATE TABLE IF NOT EXISTS family_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  allergen_config JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX idx_family_profiles_user ON family_profiles (user_id);

-- RLS
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own family profiles"
  ON family_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure only one default per user
CREATE UNIQUE INDEX idx_family_profiles_default
  ON family_profiles (user_id) WHERE is_default = true;
