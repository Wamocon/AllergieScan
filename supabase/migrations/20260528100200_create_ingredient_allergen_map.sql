-- Migration: Create ingredient-allergen mapping table
-- Links ingredients to one or more allergens with confidence level

CREATE TABLE ingredient_allergen_map (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  allergen_id   UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  confidence    TEXT NOT NULL DEFAULT 'definite' CHECK (confidence IN ('definite', 'probable', 'possible')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ingredient_id, allergen_id)
);

CREATE INDEX idx_iam_ingredient ON ingredient_allergen_map(ingredient_id);
CREATE INDEX idx_iam_allergen ON ingredient_allergen_map(allergen_id);

ALTER TABLE ingredient_allergen_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "map_read_all" ON ingredient_allergen_map FOR SELECT USING (true);
