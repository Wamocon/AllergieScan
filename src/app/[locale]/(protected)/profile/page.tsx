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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e8e0d0] border-t-[#1a4d3a]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8275]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a4d3a]" />
            {t('title')}
          </div>
          <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-[#1a1a1a] sm:text-[42px]">
            Dein <span className="font-serif-italic text-[#1a4d3a]">Profil</span>.
          </h1>
          <p className="mt-2 text-sm text-[#4a4a4a]">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f1e9] px-3 py-1 text-xs font-medium text-[#1a4d3a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2d8659]" />
              {t('saved')}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a4d3a] px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e] disabled:opacity-50"
          >
            {saving ? tc('loading') : tc('save')}
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#8a8275]">
        {t('allergenCount', { count: selected.length })}
      </p>

      <div className="mt-8 space-y-10">
        {/* Top-14 EU Mandatory Allergens */}
        <section>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#b3380e]" />
            <h2 className="font-serif text-2xl text-[#1a1a1a]">{t('categoryTop14')}</h2>
          </div>
          <p className="mt-1 text-xs text-[#8a8275]">{t('categoryTop14Desc')}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allergens.filter((a) => a.category === 'top14').map((allergen) => {
              const isSelected = selected.some((s) => s.allergen_id === allergen.id)
              const entry = selected.find((s) => s.allergen_id === allergen.id)

              return (
                <div
                  key={allergen.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-[#e8b89a] bg-[#fdf4ee]'
                      : 'border-[#e8e0d0] bg-white hover:border-[#d4c8b0]'
                  }`}
                >
                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isSelected}
                      onClick={() => toggleAllergen(allergen)}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                        isSelected ? 'bg-[#b3380e]' : 'bg-[#e8e0d0]'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                        isSelected ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium truncate text-[#1a1a1a]">{allergen.name_de}</span>
                      <span className="block text-xs text-[#8a8275] truncate">{allergen.name_en}</span>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-3 pl-12">
                      <select
                        value={entry?.risk_level || 'high'}
                        onChange={(e) =>
                          setRiskLevel(allergen.id, e.target.value as ProfileAllergen['risk_level'])
                        }
                        className="w-full rounded-xl border border-[#e8e0d0] bg-white px-3 py-1.5 text-xs text-[#1a1a1a] focus:border-[#1a4d3a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3a]/15"
                      >
                        <option value="critical">{t('critical')}</option>
                        <option value="high">{t('high')}</option>
                        <option value="medium">{t('medium')}</option>
                      </select>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Top-30 Extended Allergens */}
        <section>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c08810]" />
            <h2 className="font-serif text-2xl text-[#1a1a1a]">{t('categoryTop30')}</h2>
          </div>
          <p className="mt-1 text-xs text-[#8a8275]">{t('categoryTop30Desc')}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allergens.filter((a) => a.category === 'top30').map((allergen) => {
              const isSelected = selected.some((s) => s.allergen_id === allergen.id)
              const entry = selected.find((s) => s.allergen_id === allergen.id)

              return (
                <div
                  key={allergen.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-[#e8d49a] bg-[#fcf6e4]'
                      : 'border-[#e8e0d0] bg-white hover:border-[#d4c8b0]'
                  }`}
                >
                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isSelected}
                      onClick={() => toggleAllergen(allergen)}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                        isSelected ? 'bg-[#c08810]' : 'bg-[#e8e0d0]'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                        isSelected ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium truncate text-[#1a1a1a]">{allergen.name_de}</span>
                      <span className="block text-xs text-[#8a8275] truncate">{allergen.name_en}</span>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-3 pl-12">
                      <select
                        value={entry?.risk_level || 'high'}
                        onChange={(e) =>
                          setRiskLevel(allergen.id, e.target.value as ProfileAllergen['risk_level'])
                        }
                        className="w-full rounded-xl border border-[#e8e0d0] bg-white px-3 py-1.5 text-xs text-[#1a1a1a] focus:border-[#1a4d3a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3a]/15"
                      >
                        <option value="critical">{t('critical')}</option>
                        <option value="high">{t('high')}</option>
                        <option value="medium">{t('medium')}</option>
                      </select>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
