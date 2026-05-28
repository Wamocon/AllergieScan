'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { ScanDecision } from '@/lib/engine/types'

export default function DashboardPage() {
  const t = useTranslations('scan')
  const tr = useTranslations('result')
  const [ingredientsText, setIngredientsText] = useState('')
  const [result, setResult] = useState<ScanDecision | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheck() {
    if (!ingredientsText.trim()) return

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ ingredients_text: ingredientsText }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unknown error')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const resultColors = {
    safe: 'border-green-500 bg-green-50 dark:bg-green-950',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
    danger: 'border-red-500 bg-red-50 dark:bg-red-950',
  }

  const resultLabels = {
    safe: t('resultSafe'),
    warning: t('resultWarning'),
    danger: t('resultDanger'),
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium">
            {t('inputLabel')}
          </label>
          <textarea
            id="ingredients"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={t('inputPlaceholder')}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !ingredientsText.trim()}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? '...' : t('checkButton')}
        </button>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className={`rounded-lg border-2 p-4 ${resultColors[result.result]}`}>
            <div className="text-lg font-bold">{resultLabels[result.result]}</div>

            <div className="mt-2 text-sm">
              {result.matched_tokens}/{result.total_tokens} tokens matched
            </div>

            {result.matched_allergens.length > 0 && (
              <div className="mt-3">
                <h3 className="font-medium">{t('matchedAllergens')}:</h3>
                <ul className="mt-1 space-y-1">
                  {result.matched_allergens.map((hit, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{hit.allergen_name_de}</span>
                      {' '}&mdash;{' '}
                      {hit.matched_terms.join(', ')}
                      <span className="ml-2 text-xs opacity-70">
                        ({hit.confidence}, {hit.risk_level})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.unknown_tokens.length > 0 && (
              <div className="mt-3">
                <h3 className="font-medium">{t('unknownIngredients')}:</h3>
                <p className="mt-1 text-sm opacity-70">
                  {result.unknown_tokens.join(', ')}
                </p>
              </div>
            )}

            <p className="mt-4 text-xs italic opacity-60">{tr('disclaimer')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
