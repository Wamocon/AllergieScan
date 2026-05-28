-- Migration: Create scan_results table
-- Logs every product check with full result details
-- GDPR: health-related data, strict RLS

CREATE TABLE scan_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  ingredients_text  TEXT NOT NULL,
  result            TEXT NOT NULL CHECK (result IN ('safe', 'warning', 'danger')),
  matched_allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Format: [{"allergen_id": "uuid", "allergen_code": "gluten", "matched_terms": ["Weizenmehl"], "confidence": "definite", "risk_level": "critical"}]
  unknown_tokens    JSONB NOT NULL DEFAULT '[]'::jsonb,
  scan_source       TEXT NOT NULL DEFAULT 'text' CHECK (scan_source IN ('barcode', 'ocr', 'text', 'search')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scan_results_user ON scan_results(user_id);
CREATE INDEX idx_scan_results_created ON scan_results(created_at DESC);

ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scans_select_own" ON scan_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scans_insert_own" ON scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scans_delete_own" ON scan_results
  FOR DELETE USING (auth.uid() = user_id);
