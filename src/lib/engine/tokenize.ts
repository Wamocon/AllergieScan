/**
 * Tokenizes an ingredient list text into individual ingredient tokens.
 * Handles: comma-separated, semicolons, parenthetical sub-ingredients, percentage annotations.
 */
export function tokenizeIngredients(text: string): string[] {
  if (!text || !text.trim()) return []

  // Replace semicolons with commas for uniform splitting
  let normalized = text.replace(/;/g, ',')

  // Handle parenthetical content: extract sub-ingredients
  // e.g. "Schokolade (Zucker, Kakaobutter, Milchpulver)" -> "Schokolade, Zucker, Kakaobutter, Milchpulver"
  normalized = expandParentheses(normalized)

  // Split by comma
  const tokens = normalized
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    // Remove percentage annotations like "13%" or "(19%)"
    .map((token) => token.replace(/\s*\(?\d+([.,]\d+)?%?\)?\.?\s*/g, ' ').trim())
    // Remove E-number standalone entries that are just numbers
    .filter((token) => token.length > 1)

  return tokens
}

/**
 * Expands parenthetical sub-ingredients into separate comma-delimited items.
 * "Schokolade (Zucker, Kakaobutter)" -> "Schokolade, Zucker, Kakaobutter"
 */
function expandParentheses(text: string): string {
  // Match pattern: "Word (sub1, sub2, sub3)"
  return text.replace(/([^,()]+)\s*\(([^)]+)\)/g, (_match, prefix, content) => {
    const prefixTrimmed = prefix.trim()
    const subItems = content.split(',').map((s: string) => s.trim())

    // If the parenthetical content looks like sub-ingredients (has commas), expand
    if (subItems.length > 1) {
      return `${prefixTrimmed}, ${subItems.join(', ')}`
    }
    // Otherwise keep as-is (might be a clarification like "Lecithin (Soja)")
    return `${prefixTrimmed} ${content.trim()}`
  })
}
