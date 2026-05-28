'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Allergen {
  id: string
  code: string
  name_de: string
  name_en: string
  category: string
}

interface ProfileAllergen {
  allergen_id: string
  allergen_code: string
  risk_level: 'critical' | 'high' | 'medium'
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tc = useTranslations('common')
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [selected, setSelected] = useState<ProfileAllergen[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadData() {
      const allergensRes = await fetch('/api/allergens')
      const { allergens: allergenList } = await allergensRes.json()
      setAllergens(allergenList || [])

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const profileRes = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        })
        const { profile } = await profileRes.json()
        if (profile?.allergen_config) {
          setSelected(profile.allergen_config)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [])

  function toggleAllergen(allergen: Allergen) {
    setSelected((prev) => {
      const exists = prev.find((p) => p.allergen_id === allergen.id)
      if (exists) {
        return prev.filter((p) => p.allergen_id !== allergen.id)
      }
      return [...prev, { allergen_id: allergen.id, allergen_code: allergen.code, risk_level: 'high' }]
    })
    setSaved(false)
  }

  function setRiskLevel(allergenId: string, level: ProfileAllergen['risk_level']) {
    setSelected((prev) =>
      prev.map((p) => (p.allergen_id === allergenId ? { ...p, risk_level: level } : p))
    )
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ allergen_config: selected }),
    })

    setSaving(false)
    setSaved(true)
  }

  if (loading) return <div className="p-8">{tc('loading')}</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('subtitle')}</p>

      <div className="mt-6 space-y-3">
        {allergens.map((allergen) => {
          const isSelected = selected.some((s) => s.allergen_id === allergen.id)
          const entry = selected.find((s) => s.allergen_id === allergen.id)

          return (
            <div
              key={allergen.id}
              className={`rounded-lg border p-3 transition-colors ${
                isSelected
                  ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAllergen(allergen)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="font-medium">{allergen.name_de}</span>
                  <span className="text-xs text-zinc-500">({allergen.name_en})</span>
                </label>

                {isSelected && (
                  <select
                    value={entry?.risk_level || 'high'}
                    onChange={(e) =>
                      setRiskLevel(allergen.id, e.target.value as ProfileAllergen['risk_level'])
                    }
                    className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="critical">{t('critical')}</option>
                    <option value="high">{t('high')}</option>
                    <option value="medium">{t('medium')}</option>
                  </select>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {tc('save')}
        </button>

        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400">{t('saved')}</span>
        )}

        <span className="text-sm text-zinc-500">
          {t('allergenCount', { count: selected.length })}
        </span>
      </div>
    </div>
  )
}
