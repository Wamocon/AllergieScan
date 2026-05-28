export type RiskLevel = 'critical' | 'high' | 'medium'
export type Confidence = 'definite' | 'probable' | 'possible'
export type ScanResultType = 'safe' | 'warning' | 'danger'

export interface UserAllergenConfig {
  allergen_id: string
  allergen_code: string
  risk_level: RiskLevel
}

export interface SynonymEntry {
  term_normalized: string
  ingredient_id: string
  allergen_ids: string[]
  allergen_codes: string[]
  confidence: Confidence
}

export interface IngredientMatch {
  token: string
  matched_term: string
  ingredient_id: string
  allergen_id: string
  allergen_code: string
  confidence: Confidence
}

export interface ScanDecision {
  result: ScanResultType
  matched_allergens: AllergenHit[]
  unknown_tokens: string[]
  total_tokens: number
  matched_tokens: number
  checked_at: string
}

export interface AllergenHit {
  allergen_id: string
  allergen_code: string
  allergen_name_de: string
  allergen_name_en: string
  matched_terms: string[]
  confidence: Confidence
  risk_level: RiskLevel
}
