'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface ScanRecord {
  id: string
  ingredients_text: string
  product_name?: string
  result: 'safe' | 'warning' | 'danger'
  matched_allergens: { allergen_name_de: string; allergen_name_en: string; category: string }[]
  unknown_tokens: string[]
  scan_source: string
  created_at: string
}

export default function HistoryPage() {
  const t = useTranslations('history')
  const locale = useLocale()
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'safe' | 'warning' | 'danger'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      setScans(data.scans || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredScans = scans.filter((scan) => {
    if (filter !== 'all' && scan.result !== filter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const nameMatch = scan.product_name?.toLowerCase().includes(q)
      const ingredientMatch = scan.ingredients_text.toLowerCase().includes(q)
      const allergenMatch = scan.matched_allergens.some((a) =>
        a.allergen_name_de.toLowerCase().includes(q) || a.allergen_name_en.toLowerCase().includes(q)
      )
      if (!nameMatch && !ingredientMatch && !allergenMatch) return false
    }
    return true
  })

  const config = {
    safe:    { badge: 'bg-safe-tint text-safe',       dot: 'bg-safe',    label: t('safe') },
    warning: { badge: 'bg-warning-tint text-warning', dot: 'bg-warning', label: t('warning') },
    danger:  { badge: 'bg-danger-tint text-danger',   dot: 'bg-danger',  label: t('danger') },
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12 animate-pulse">
        <div className="h-3 w-24 rounded-full bg-canvas-raised" />
        <div className="mt-4 h-10 w-56 rounded-2xl bg-canvas-raised" />
        <div className="mt-3 h-4 w-40 rounded-full bg-canvas-raised" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-[24px] border border-app bg-surface" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {t('title')}
      </div>
      <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-app sm:text-[42px]">
        {t('heading')} <span className="font-serif-italic text-brand">{t('headingHighlight')}</span>.
      </h1>
      <p className="mt-2 text-sm text-app-secondary">{t('subtitle')}</p>

      {/* Filter bar */}
      {scans.length > 0 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-full border border-app bg-canvas-raised p-1">
            {(['all', 'safe', 'warning', 'danger'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === f ? 'bg-brand text-on-brand shadow-brand' : 'text-app-secondary hover:text-brand'
                }`}
              >
                {t(`filter${f.charAt(0).toUpperCase() + f.slice(1)}` as 'filterAll' | 'filterSafe' | 'filterWarning' | 'filterDanger')}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-full border border-app bg-surface py-2 pl-8 pr-3 text-xs text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      )}

      {scans.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-canvas-raised border border-app">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-app-muted">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="mt-5 font-serif-italic text-xl text-app">{t('emptyTitle')}</p>
          <p className="mt-1 text-sm text-app-muted">{t('empty')}</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="mt-12 text-center text-sm text-app-muted">
          {t('empty')}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {filteredScans.map((scan) => {
            const c = config[scan.result]
            return (
              <div key={scan.id} className="group rounded-[24px] border border-app bg-surface p-5 transition-all hover:border-app-strong hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${c.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                    {c.label}
                  </span>
                  <time className="text-xs text-app-muted">
                    {new Date(scan.created_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </time>
                </div>

                {scan.product_name && (
                  <p className="mt-3 text-sm font-medium text-app">{scan.product_name}</p>
                )}

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-app-secondary">
                  {scan.ingredients_text.slice(0, 100)}
                  {scan.ingredients_text.length > 100 && '...'}
                </p>

                {scan.matched_allergens.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {scan.matched_allergens.slice(0, 4).map((a, i) => (
                      <span key={i} className="rounded-full bg-canvas-raised border border-app px-2 py-0.5 text-[10px] text-app-secondary">
                        {locale === 'de' ? a.allergen_name_de : a.allergen_name_en}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
