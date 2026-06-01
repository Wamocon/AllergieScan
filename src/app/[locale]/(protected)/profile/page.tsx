'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Allergen {
  id: string
  code: string
  name_de: string
  name_en: string
  category: string
}

type RiskLevel = 'critical' | 'high' | 'medium'
interface ProfileAllergen {
  allergen_id: string
  allergen_code: string
  risk_level: RiskLevel
}

const PRESETS: { id: string; label: string; codes: string[] }[] = [
  { id: 'gluten-free', label: 'Glutenfrei', codes: ['gluten'] },
  { id: 'lactose-free', label: 'Laktosefrei', codes: ['milk', 'lactose'] },
  { id: 'nut-free', label: 'Nussfrei', codes: ['peanuts', 'tree_nuts', 'almonds', 'hazelnuts', 'walnuts', 'cashews', 'pistachios'] },
  { id: 'fish-free', label: 'Fisch- & Meeresfruechte-frei', codes: ['fish', 'crustaceans', 'molluscs'] },
  { id: 'vegan', label: 'Vegan-Hilfe', codes: ['milk', 'eggs', 'fish', 'crustaceans', 'molluscs', 'lactose'] },
]

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tc = useTranslations('common')
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [selected, setSelected] = useState<ProfileAllergen[]>([])
  const [displayName, setDisplayName] = useState('')
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState<'top14' | 'top30'>('top14')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const allergensRes = await fetch('/api/allergens')
      const { allergens: list } = await allergensRes.json()
      setAllergens(list || [])

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const r = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${session.access_token}` } })
        const { profile } = await r.json()
        if (profile?.allergen_config) setSelected(profile.allergen_config)
        if (profile?.display_name) setDisplayName(profile.display_name)
      }
      setLoading(false)
    }
    load()
  }, [])

  const isOn = (id: string) => selected.some((s) => s.allergen_id === id)
  const getRisk = (id: string): RiskLevel => selected.find((s) => s.allergen_id === id)?.risk_level || 'high'

  function toggle(a: Allergen) {
    setSelected((prev) => {
      if (prev.some((s) => s.allergen_id === a.id)) return prev.filter((s) => s.allergen_id !== a.id)
      return [...prev, { allergen_id: a.id, allergen_code: a.code, risk_level: a.category === 'top14' ? 'high' : 'medium' }]
    })
    setSaved(false)
  }

  function setRisk(id: string, risk: RiskLevel) {
    setSelected((prev) => prev.map((s) => (s.allergen_id === id ? { ...s, risk_level: risk } : s)))
    setSaved(false)
  }

  function applyPreset(codes: string[]) {
    const additions: ProfileAllergen[] = []
    for (const code of codes) {
      const a = allergens.find((x) => x.code === code)
      if (a && !selected.some((s) => s.allergen_id === a.id)) {
        additions.push({ allergen_id: a.id, allergen_code: a.code, risk_level: a.category === 'top14' ? 'high' : 'medium' })
      }
    }
    if (additions.length > 0) {
      setSelected((prev) => [...prev, ...additions])
      setSaved(false)
    }
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify({ allergen_config: selected, display_name: displayName }),
    })
    setSaving(false)
    setSaved(true)
  }

  const sectionItems = useMemo(() => {
    const items = allergens.filter((a) => a.category === activeSection)
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((a) => a.name_de.toLowerCase().includes(q) || a.name_en.toLowerCase().includes(q) || a.code.includes(q))
  }, [allergens, activeSection, query])

  const top14Count = selected.filter((s) => allergens.find((a) => a.id === s.allergen_id)?.category === 'top14').length
  const top30Count = selected.filter((s) => allergens.find((a) => a.id === s.allergen_id)?.category === 'top30').length

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:py-12 animate-pulse">
        <div className="h-3 w-24 rounded-full bg-canvas-raised" />
        <div className="mt-4 h-10 w-48 rounded-2xl bg-canvas-raised" />
        <div className="mt-3 h-4 w-56 rounded-full bg-canvas-raised" />
        <div className="mt-8 h-20 rounded-[24px] border border-app bg-surface" />
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl border border-app bg-surface" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-32 lg:py-12">
      {/* Header */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {t('title')}
      </div>
      <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-app sm:text-[42px]">
        Dein <span className="font-serif-italic text-brand">Profil</span>.
      </h1>
      <p className="mt-2 text-sm text-app-secondary">{t('subtitle')}</p>

      {/* Name */}
      <div className="mt-8 rounded-[24px] border border-app bg-surface p-5">
        <label htmlFor="name" className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-muted">
          {t('nameLabel')}
        </label>
        <input
          id="name"
          type="text"
          value={displayName}
          onChange={(e) => { setDisplayName(e.target.value); setSaved(false) }}
          placeholder={t('namePlaceholder')}
          className="mt-2 block w-full border-0 bg-transparent text-2xl font-serif text-app placeholder:text-app-muted focus:outline-none focus:ring-0"
        />
      </div>

      {/* Quick presets */}
      <div className="mt-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-muted">
          {t('presets')}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.codes)}
              className="rounded-full border border-app bg-surface px-4 py-1.5 text-xs font-medium text-app-secondary transition-all hover:border-brand hover:bg-brand-tint hover:text-brand"
            >
              + {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section switch + search */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-full border border-app bg-canvas-raised p-1">
          <button
            onClick={() => setActiveSection('top14')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeSection === 'top14' ? 'bg-brand text-on-brand shadow-brand' : 'text-app-secondary hover:text-brand'
            }`}
          >
            EU-14
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeSection === 'top14' ? 'bg-on-brand/20 text-on-brand' : 'bg-canvas text-app-muted'}`}>
              {top14Count}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('top30')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeSection === 'top30' ? 'bg-brand text-on-brand shadow-brand' : 'text-app-secondary hover:text-brand'
            }`}
          >
            Top-30
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeSection === 'top30' ? 'bg-on-brand/20 text-on-brand' : 'bg-canvas text-app-muted'}`}>
              {top30Count}
            </span>
          </button>
        </div>

        <div className="relative max-w-xs">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-full border border-app bg-surface py-2 pl-8 pr-3 text-xs text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {/* Section description */}
      <p className="mt-4 text-xs text-app-muted">
        {activeSection === 'top14' ? t('categoryTop14Desc') : t('categoryTop30Desc')}
      </p>

      {/* Compact list of allergens */}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {sectionItems.map((a) => {
          const on = isOn(a.id)
          const risk = getRisk(a.id)
          return (
            <li
              key={a.id}
              className={`rounded-2xl border bg-surface transition-all ${on ? 'border-brand/40' : 'border-app hover:border-app-strong'}`}
            >
              <div className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => toggle(a)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-app'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform ${on ? 'translate-x-4' : ''}`} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-app">{a.name_de}</div>
                  <div className="truncate text-[11px] text-app-muted">{a.name_en}</div>
                </div>
                {on && <RiskSelector value={risk} onChange={(r) => setRisk(a.id, r)} t={t} />}
              </div>
            </li>
          )
        })}
        {sectionItems.length === 0 && (
          <li className="col-span-full rounded-2xl border border-app bg-surface p-6 text-center text-sm text-app-muted">
            {t('noMatches')}
          </li>
        )}
      </ul>

      {/* Sticky save bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-app bg-surface-overlay backdrop-blur-xl lg:bottom-0 lg:pl-[240px]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <p className="text-xs text-app-secondary">
            {t('allergenCount', { count: selected.length })}
            {saved && <span className="ml-3 inline-flex items-center gap-1.5 text-safe">
              <span className="h-1.5 w-1.5 rounded-full bg-safe" />
              {t('saved')}
            </span>}
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
          >
            {saving ? tc('loading') : tc('save')}
          </button>
        </div>
      </div>
    </div>
  )
}

function RiskSelector({ value, onChange, t }: { value: RiskLevel; onChange: (r: RiskLevel) => void; t: (k: string) => string }) {
  const opts: { v: RiskLevel; label: string; cls: string }[] = [
    { v: 'critical', label: 'K', cls: 'bg-danger text-on-brand' },
    { v: 'high',     label: 'H', cls: 'bg-warning text-on-brand' },
    { v: 'medium',   label: 'M', cls: 'bg-safe text-on-brand' },
  ]
  return (
    <div className="flex shrink-0 overflow-hidden rounded-full border border-app text-[10px] font-bold" title={t('riskLevel')}>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`h-6 w-6 transition-all ${value === o.v ? o.cls : 'bg-canvas-raised text-app-muted hover:bg-canvas'}`}
          aria-label={t(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
