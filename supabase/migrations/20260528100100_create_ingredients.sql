-- Migration: Create ingredients table
-- Normalized ingredient entries that map to allergens

CREATE TABLE ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_normalized TEXT NOT NULL UNIQUE,
  name_original   TEXT NOT NULL,
  language        TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('de', 'en')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingredients_normalized ON ingredients(name_normalized);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ingredients_read_all" ON ingredients FOR SELECT USING (true);
