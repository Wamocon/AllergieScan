import { describe, it, expect } from 'vitest'
import { tokenizeIngredients } from '@/lib/engine/tokenize'
import { normalizeText } from '@/lib/engine/normalize'

describe('tokenizeIngredients', () => {
  it('splits comma-separated ingredients', () => {
    const tokens = tokenizeIngredients('Weizenmehl, Zucker, Butter')
    expect(tokens).toHaveLength(3)
    expect(tokens.map(t => t.toLowerCase())).toContain('weizenmehl')
    expect(tokens.map(t => t.toLowerCase())).toContain('zucker')
  })

  it('handles parenthetical sub-ingredients', () => {
    const tokens = tokenizeIngredients('Schokolade (Kakao, Zucker, Sojalecithin)')
    expect(tokens.length).toBeGreaterThanOrEqual(3)
    expect(tokens.map(t => t.toLowerCase())).toContain('schokolade')
    expect(tokens.map(t => t.toLowerCase())).toContain('sojalecithin')
  })

  it('returns empty array for empty input', () => {
    expect(tokenizeIngredients('')).toEqual([])
  })

  it('handles semicolons as delimiters', () => {
    const tokens = tokenizeIngredients('Mehl; Wasser; Salz')
    expect(tokens.map(t => t.toLowerCase())).toContain('mehl')
    expect(tokens.map(t => t.toLowerCase())).toContain('wasser')
    expect(tokens.map(t => t.toLowerCase())).toContain('salz')
  })
})

describe('normalizeText', () => {
  it('lowercases input', () => {
    expect(normalizeText('MEHL')).toBe('mehl')
  })

  it('preserves hyphens (used for compound words)', () => {
    const result = normalizeText('Soja-Lecithin')
    expect(result).toBe('soja-lecithin')
  })

  it('trims whitespace', () => {
    expect(normalizeText('  zucker  ')).toBe('zucker')
  })
})
