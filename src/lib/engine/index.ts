import { createAdminClient } from '@/lib/supabase/admin'
import { calculateDecision } from './decision'
import { matchIngredients } from './matcher'
import { tokenizeIngredients } from './tokenize'
import type { AllergenCategory, ScanDecision, UserAllergenConfig } from './types'

/**
 * Main entry point: checks a product's ingredients against a user's allergy profile.
 *
 * @param ingredientsText - Raw ingredient list text (from label, OCR, or manual input)
 * @param userProfile - User's allergen configuration with risk levels
 * @returns Full scan decision with matched allergens and reasoning
 */
export async function checkProduct(
  ingredientsText: string,
  userProfile: UserAllergenConfig[]
): Promise<ScanDecision> {
  // 1. Tokenize the ingredient text
  const tokens = tokenizeIngredients(ingredientsText)

  if (tokens.length === 0) {
    return {
      result: 'warning',
      matched_allergens: [],
      unknown_tokens: [],
      total_tokens: 0,
      matched_tokens: 0,
      checked_at: new Date().toISOString(),
    }
  }

  // 2. Load matching data from database
  const matcherData = await loadMatcherData()

  // 3. Match tokens against allergen database
  const { matches, unknownTokens } = matchIngredients(tokens, matcherData)

  // 4. Load allergen info for display
  const allergenInfo = await loadAllergenInfo()

  // 5. Calculate decision
  return calculateDecision(
    matches,
    unknownTokens,
    tokens.length,
    userProfile,
    allergenInfo
  )
}

async function loadMatcherData() {
  const supabase = createAdminClient()

  // Load ingredients with their allergen mappings
  const { data: ingredients } = await supabase
    .from('ingredients')
    .select(`
      id,
      name_normalized,
      ingredient_allergen_map (
        allergen_id,
        confidence,
        allergens (code)
      )
    `)

  // Load synonyms
  const { data: synonyms } = await supabase
    .from('synonyms')
    .select('term_normalized, ingredient_id')

  const formattedIngredients = (ingredients || []).map((ing: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const maps = ing.ingredient_allergen_map || []
    return {
      id: ing.id as string,
      name_normalized: ing.name_normalized as string,
      allergen_ids: maps.map((m: Record<string, unknown>) => m.allergen_id as string),
      allergen_codes: maps.map((m: Record<string, unknown>) => (m.allergens as Record<string, unknown>)?.code as string),
      confidence: (maps[0]?.confidence as string) || 'definite',
    }
  })

  return {
    ingredients: formattedIngredients,
    synonyms: synonyms || [],
  }
}

async function loadAllergenInfo() {
  const supabase = createAdminClient()

  const { data: allergens } = await supabase
    .from('allergens')
    .select('id, code, name_de, name_en, category')

  return (allergens || []).map((a) => ({
    id: a.id,
    code: a.code,
    name_de: a.name_de,
    name_en: a.name_en,
    category: (a.category || 'top14') as AllergenCategory,
  }))
}

export type { ScanDecision, UserAllergenConfig }
export { tokenizeIngredients } from './tokenize'
export { normalizeText } from './normalize'
