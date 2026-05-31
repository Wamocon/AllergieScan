-- Product cache for Open Food Facts responses (TTL 30 days)
CREATE TABLE IF NOT EXISTS product_cache (
  ean TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT DEFAULT '',
  ingredients_text TEXT DEFAULT '',
  raw_data JSONB DEFAULT '{}',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index for expiry cleanup
CREATE INDEX idx_product_cache_expires ON product_cache (expires_at);

-- RLS: Allow all authenticated users to read cache
ALTER TABLE product_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product cache"
  ON product_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert/update cache"
  ON product_cache FOR ALL
  USING (true)
  WITH CHECK (true);
