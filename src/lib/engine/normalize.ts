/**
 * Text normalization for ingredient matching.
 * Handles: lowercase, unicode normalization, umlaut variants, special chars, whitespace.
 */
export function normalizeText(input: string): string {
  return input
    .normalize('NFC')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s\-()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normalize a single term for database comparison.
 * Strips parenthetical content and extra formatting.
 */
export function normalizeTerm(term: string): string {
  return normalizeText(term)
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
