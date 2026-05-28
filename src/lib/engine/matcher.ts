import { normalizeTerm } from './normalize'
import type { IngredientMatch } from './types'

interface MatcherData {
  ingredients: Array<{
    id: string
    name_normalized: string
    allergen_ids: string[]
    allergen_codes: string[]
    confidence: string
  }>
  synonyms: Array<{
    term_normalized: string
    ingredient_id: string
  }>
}

/**
 * Matches tokenized ingredients against the allergen database.
 * Uses exact match first, then substring match.
 */
export function matchIngredients(
  tokens: string[],
  data: MatcherData
): { matches: IngredientMatch[]; unknownTokens: string[] } {
  const matches: IngredientMatch[] = []
  const unknownTokens: string[] = []

  for (const token of tokens) {
    const normalizedToken = normalizeTerm(token)

    if (!normalizedToken) continue

    const match = findMatch(normalizedToken, data)

    if (match) {
      for (let i = 0; i < match.allergen_ids.length; i++) {
        matches.push({
          token,
          matched_term: match.matched_term,
          ingredient_id: match.ingredient_id,
          allergen_id: match.allergen_ids[i],
          allergen_code: match.allergen_codes[i],
          confidence: match.confidence as IngredientMatch['confidence'],
        })
      }
    } else {
      unknownTokens.push(token)
    }
  }

  return { matches, unknownTokens }
}

function findMatch(
  normalizedToken: string,
  data: MatcherData
): {
  ingredient_id: string
  allergen_ids: string[]
  allergen_codes: string[]
  confidence: string
  matched_term: string
} | null {
  // 1. Exact match against ingredients
  const exactIngredient = data.ingredients.find(
    (ing) => ing.name_normalized === normalizedToken
  )
  if (exactIngredient && exactIngredient.allergen_ids.length > 0) {
    return {
      ingredient_id: exactIngredient.id,
      allergen_ids: exactIngredient.allergen_ids,
      allergen_codes: exactIngredient.allergen_codes,
      confidence: exactIngredient.confidence,
      matched_term: exactIngredient.name_normalized,
    }
  }

  // 2. Exact match against synonyms
  const exactSynonym = data.synonyms.find(
    (syn) => syn.term_normalized === normalizedToken
  )
  if (exactSynonym) {
    const parentIngredient = data.ingredients.find(
      (ing) => ing.id === exactSynonym.ingredient_id
    )
    if (parentIngredient && parentIngredient.allergen_ids.length > 0) {
      return {
        ingredient_id: parentIngredient.id,
        allergen_ids: parentIngredient.allergen_ids,
        allergen_codes: parentIngredient.allergen_codes,
        confidence: parentIngredient.confidence,
        matched_term: exactSynonym.term_normalized,
      }
    }
  }

  // 3. Substring match: check if token contains a known allergen ingredient
  for (const ing of data.ingredients) {
    if (
      ing.allergen_ids.length > 0 &&
      ing.name_normalized.length >= 4 &&
      normalizedToken.includes(ing.name_normalized)
    ) {
      return {
        ingredient_id: ing.id,
        allergen_ids: ing.allergen_ids,
        allergen_codes: ing.allergen_codes,
        confidence: 'probable',
        matched_term: ing.name_normalized,
      }
    }
  }

  // 4. Substring match against synonyms
  for (const syn of data.synonyms) {
    if (syn.term_normalized.length >= 4 && normalizedToken.includes(syn.term_normalized)) {
      const parentIngredient = data.ingredients.find(
        (ing) => ing.id === syn.ingredient_id
      )
      if (parentIngredient && parentIngredient.allergen_ids.length > 0) {
        return {
          ingredient_id: parentIngredient.id,
          allergen_ids: parentIngredient.allergen_ids,
          allergen_codes: parentIngredient.allergen_codes,
          confidence: 'probable',
          matched_term: syn.term_normalized,
        }
      }
    }
  }

  return null
}
