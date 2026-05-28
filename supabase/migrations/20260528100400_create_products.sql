-- Migration: Create products table
-- Stores product data from various sources (Open Food Facts, OCR, manual)

CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ean              TEXT UNIQUE,
  name             TEXT NOT NULL,
  brand            TEXT,
  ingredients_text TEXT,
  source           TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'openfoodfacts', 'user_ocr')),
  image_url        TEXT,
  data_quality     TEXT NOT NULL DEFAULT 'unverified' CHECK (data_quality IN ('verified', 'unverified')),
  source_updated_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_ean ON products(ean);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('german', name));

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_authenticated" ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
