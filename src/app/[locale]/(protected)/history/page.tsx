'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface ScanRecord {
  id: string
  ingredients_text: string
  result: 'safe' | 'warning' | 'danger'
  matched_allergens: { allergen_name_de: string; category: string }[]
  unknown_tokens: string[]
  scan_source: string
  created_at: string
}

export default function HistoryPage() {
  const t = useTranslations('history')
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        return
      }

      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      setScans(data.scans || [])
      setLoading(false)
    }

    load()
  }, [])

  const resultConfig = {
    safe: {
      badge: 'bg-[#e3f1e9] text-[#1a4d3a]',
      dot: 'bg-[#2d8659]',
      label: t('safe'),
    },
    warning: {
      badge: 'bg-[#faf0d8] text-[#7a5408]',
      dot: 'bg-[#c08810]',
      label: t('warning'),
    },
    danger: {
      badge: 'bg-[#f7e1d4] text-[#7a2608]',
      dot: 'bg-[#b3380e]',
      label: t('danger'),
    },
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
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8275]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1a4d3a]" />
        {t('title')}
      </div>
      <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-[#1a1a1a] sm:text-[42px]">
        Dein <span className="font-serif-italic text-[#1a4d3a]">Verlauf</span>.
      </h1>
      <p className="mt-2 text-sm text-[#4a4a4a]">{t('subtitle')}</p>

      {scans.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fbf8f2] border border-[#e8e0d0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8a8275" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="mt-5 font-serif-italic text-xl text-[#1a1a1a]">Noch nichts gescannt.</p>
          <p className="mt-1 text-sm text-[#8a8275]">{t('empty')}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {scans.map((scan) => {
            const cfg = resultConfig[scan.result]
            return (
              <div
                key={scan.id}
                className="group rounded-[24px] border border-[#e8e0d0] bg-white p-5 transition-all hover:border-[#d4c8b0] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <time className="text-xs text-[#8a8275]">
                    {new Date(scan.created_at).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </time>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#1a1a1a]">
                  {scan.ingredients_text.slice(0, 100)}
                  {scan.ingredients_text.length > 100 && '...'}
                </p>

                {scan.matched_allergens.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {scan.matched_allergens.slice(0, 3).map((a, i) => (
                      <span key={i} className="rounded-full bg-[#fbf8f2] border border-[#e8e0d0] px-2 py-0.5 text-[11px] text-[#4a4a4a]">
                        {a.allergen_name_de}
                      </span>
                    ))}
                    {scan.matched_allergens.length > 3 && (
                      <span className="text-[11px] text-[#8a8275]">
                        +{scan.matched_allergens.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {scan.scan_source && (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[#8a8275]">
                    {scan.scan_source}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
