import type {
  AllergenCategory,
  AllergenHit,
  Confidence,
  IngredientMatch,
  RiskLevel,
  ScanDecision,
  ScanResultType,
  UserAllergenConfig,
} from './types'

interface AllergenInfo {
  id: string
  code: string
  name_de: string
  name_en: string
  category: AllergenCategory
}

/**
 * Calculates the scan decision based on matches and user profile.
 *
 * Decision logic (two-tier model):
 * - DANGER: Top-14 definite match on critical/high allergen (hard decision per LMIV)
 * - WARNING: Top-30 hit (extended risk), probable/possible match, medium risk, or unknown tokens
 * - SAFE: no matches on user allergens, all tokens identified, no uncertainty
 *
 * Key distinction:
 * - Top-14 allergens (EU mandatory) can trigger DANGER (red)
 * - Top-30 allergens (extended) max out at WARNING (yellow) - clearly labeled as extended risk
 *
 * Conservative policy: unknown ingredients = minimum WARNING, never SAFE.
 */
export function calculateDecision(
  matches: IngredientMatch[],
  unknownTokens: string[],
  totalTokens: number,
  userProfile: UserAllergenConfig[],
  allergenInfo: AllergenInfo[]
): ScanDecision {
  const userAllergenIds = new Set(userProfile.map((p) => p.allergen_id))

  // Filter matches to only those in the user's profile
  const relevantMatches = matches.filter((m) => userAllergenIds.has(m.allergen_id))

  // Group matches by allergen
  const allergenHits = groupByAllergen(relevantMatches, userProfile, allergenInfo)

  // Determine result
  const result = determineResult(allergenHits, unknownTokens, totalTokens)

  return {
    result,
    matched_allergens: allergenHits,
    unknown_tokens: unknownTokens,
    total_tokens: totalTokens,
    matched_tokens: totalTokens - unknownTokens.length,
    checked_at: new Date().toISOString(),
  }
}

function groupByAllergen(
  matches: IngredientMatch[],
  userProfile: UserAllergenConfig[],
  allergenInfo: AllergenInfo[]
): AllergenHit[] {
  const grouped = new Map<string, AllergenHit>()

  for (const match of matches) {
    const existing = grouped.get(match.allergen_id)
    const profileEntry = userProfile.find((p) => p.allergen_id === match.allergen_id)
    const info = allergenInfo.find((a) => a.id === match.allergen_id)

    if (!profileEntry || !info) continue

    if (existing) {
      if (!existing.matched_terms.includes(match.token)) {
        existing.matched_terms.push(match.token)
      }
      // Upgrade confidence if more definitive
      existing.confidence = higherConfidence(existing.confidence, match.confidence)
    } else {
      grouped.set(match.allergen_id, {
        allergen_id: match.allergen_id,
        allergen_code: info.code,
        allergen_name_de: info.name_de,
        allergen_name_en: info.name_en,
        category: info.category,
        matched_terms: [match.token],
        confidence: match.confidence,
        risk_level: profileEntry.risk_level,
      })
    }
  }

  // Sort: critical first, then high, then medium
  const riskOrder: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2 }
  return Array.from(grouped.values()).sort(
    (a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]
  )
}

function determineResult(
  allergenHits: AllergenHit[],
  unknownTokens: string[],
  totalTokens: number
): ScanResultType {
  // No tokens at all = cannot determine = warning
  if (totalTokens === 0) return 'warning'

  // Separate hits by category
  const top14Hits = allergenHits.filter((hit) => hit.category === 'top14')
  const top30Hits = allergenHits.filter((hit) => hit.category === 'top30')

  // TOP-14: Hard decision logic (LMIV mandatory allergens)
  if (top14Hits.length > 0) {
    // Definite match on critical/high Top-14 allergen = DANGER
    const hasDangerHit = top14Hits.some(
      (hit) =>
        hit.confidence === 'definite' &&
        (hit.risk_level === 'critical' || hit.risk_level === 'high')
    )
    if (hasDangerHit) return 'danger'

    // Probable on critical Top-14 = still DANGER (conservative)
    const hasProbableCritical = top14Hits.some(
      (hit) => hit.risk_level === 'critical' && hit.confidence !== 'possible'
    )
    if (hasProbableCritical) return 'danger'

    // Any other Top-14 hit = at minimum WARNING
    return 'warning'
  }

  // TOP-30: Extended risk layer (max outcome = WARNING, never DANGER)
  if (top30Hits.length > 0) {
    return 'warning'
  }

  // Unknown tokens present = conservative warning
  if (unknownTokens.length > 0) {
    const unknownRatio = unknownTokens.length / totalTokens
    if (unknownRatio > 0.5) return 'warning'
    return 'warning'
  }

  // All tokens identified, no allergen matches
  return 'safe'
}

function higherConfidence(a: Confidence, b: Confidence): Confidence {
  const order: Record<Confidence, number> = { definite: 2, probable: 1, possible: 0 }
  return order[a] >= order[b] ? a : b
}
