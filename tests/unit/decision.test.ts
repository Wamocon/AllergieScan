import { describe, it, expect } from 'vitest'
import { calculateDecision } from '@/lib/engine/decision'
import type { IngredientMatch, UserAllergenConfig } from '@/lib/engine/types'

const mockAllergenInfo = [
  { id: 'a1', code: 'gluten', name_de: 'Gluten', name_en: 'Gluten', category: 'top14' as const },
  { id: 'a2', code: 'milk', name_de: 'Milch', name_en: 'Milk', category: 'top14' as const },
  { id: 'a3', code: 'soy', name_de: 'Soja', name_en: 'Soy', category: 'top30' as const },
]

const userProfile: UserAllergenConfig[] = [
  { allergen_id: 'a1', allergen_code: 'gluten', risk_level: 'critical' },
  { allergen_id: 'a2', allergen_code: 'milk', risk_level: 'high' },
  { allergen_id: 'a3', allergen_code: 'soy', risk_level: 'medium' },
]

describe('calculateDecision', () => {
  it('returns safe when no allergens matched', () => {
    const result = calculateDecision([], [], 5, userProfile, mockAllergenInfo)
    expect(result.result).toBe('safe')
    expect(result.matched_allergens).toHaveLength(0)
  })

  it('returns danger for definite top14 critical match', () => {
    const matches: IngredientMatch[] = [{
      token: 'weizenmehl',
      matched_term: 'weizenmehl',
      ingredient_id: 'i1',
      allergen_id: 'a1',
      allergen_code: 'gluten',
      confidence: 'definite',
    }]
    const result = calculateDecision(matches, [], 5, userProfile, mockAllergenInfo)
    expect(result.result).toBe('danger')
  })

  it('returns danger for definite top14 high match', () => {
    const matches: IngredientMatch[] = [{
      token: 'vollmilch',
      matched_term: 'vollmilch',
      ingredient_id: 'i2',
      allergen_id: 'a2',
      allergen_code: 'milk',
      confidence: 'definite',
    }]
    const result = calculateDecision(matches, [], 5, userProfile, mockAllergenInfo)
    expect(result.result).toBe('danger')
  })

  it('returns warning for top30 match', () => {
    const matches: IngredientMatch[] = [{
      token: 'sojalecithin',
      matched_term: 'sojalecithin',
      ingredient_id: 'i3',
      allergen_id: 'a3',
      allergen_code: 'soy',
      confidence: 'definite',
    }]
    const result = calculateDecision(matches, [], 5, userProfile, mockAllergenInfo)
    expect(result.result).toBe('warning')
  })

  it('returns warning when unknown tokens present', () => {
    const result = calculateDecision([], ['unbekannt1', 'unbekannt2'], 4, userProfile, mockAllergenInfo)
    expect(result.result).toBe('warning')
  })

  it('returns warning for zero tokens', () => {
    const result = calculateDecision([], [], 0, userProfile, mockAllergenInfo)
    expect(result.result).toBe('warning')
  })
})
