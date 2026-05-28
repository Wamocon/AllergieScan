-- Migration: Create synonyms table
-- Maps variant spellings/names to normalized ingredients

CREATE TABLE synonyms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term            TEXT NOT NULL,
  term_normalized TEXT NOT NULL,
  ingredient_id   UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  language        TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('de', 'en')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_synonyms_term_normalized ON synonyms(term_normalized);
CREATE INDEX idx_synonyms_language ON synonyms(language);
CREATE INDEX idx_synonyms_ingredient ON synonyms(ingredient_id);

ALTER TABLE synonyms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "synonyms_read_all" ON synonyms FOR SELECT USING (true);
