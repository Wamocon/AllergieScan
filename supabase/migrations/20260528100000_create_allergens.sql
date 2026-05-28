-- Migration: Create allergens table
-- Top-14 EU mandatory allergens + Top-30 extended risk layer

CREATE TABLE allergens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT NOT NULL UNIQUE,
  name_de       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'top14' CHECK (category IN ('top14', 'top30')),
  description_de TEXT,
  description_en TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allergens_read_all" ON allergens FOR SELECT USING (true);
