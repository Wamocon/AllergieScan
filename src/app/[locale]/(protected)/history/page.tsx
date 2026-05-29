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
  const tc = useTranslations('common')
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

  const resultColors = {
    safe: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const resultLabels = {
    safe: t('safe'),
    warning: t('warning'),
    danger: t('danger'),
  }

  if (loading) return <div className="p-8 text-center text-zinc-500">{tc('loading')}</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>

      {scans.length === 0 ? (
        <div className="mt-8 text-center text-sm text-zinc-400">
          {t('empty')}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1 font-medium">
                    {scan.ingredients_text.slice(0, 80)}
                    {scan.ingredients_text.length > 80 && '...'}
                  </p>
                  {scan.matched_allergens.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {scan.matched_allergens.map((a) => a.allergen_name_de).join(', ')}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(scan.created_at).toLocaleString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {scan.scan_source && (
                      <span className="ml-2 opacity-60">({scan.scan_source})</span>
                    )}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${resultColors[scan.result]}`}>
                  {resultLabels[scan.result]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
