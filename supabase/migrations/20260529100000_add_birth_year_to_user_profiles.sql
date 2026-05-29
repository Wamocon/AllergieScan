-- Migration: add birth_year column to user_profiles (captured by registration wizard, optional)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS birth_year INTEGER CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM now())::INT));
