'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

interface ScanRecord {
  id: string
  result: 'safe' | 'warning' | 'danger'
  product_name?: string
  ingredients_text: string
  created_at: string
}

interface DashboardData {
  displayName: string
  allergenCount: number
  scans: ScanRecord[]
  totals: { safe: number; warning: number; danger: number }
}

const SIGNAL_CHIP = {
  safe: { bg: 'bg-safe-tint', text: 'text-safe', dot: 'bg-safe', label: 'Geeignet' },
  warning: { bg: 'bg-warning-tint', text: 'text-warning', dot: 'bg-warning', label: 'Vorsicht' },
  danger: { bg: 'bg-danger-tint', text: 'text-danger', dot: 'bg-danger', label: 'Nicht geeignet' },
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const to = useTranslations('onboarding')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const headers = { 'Authorization': `Bearer ${session.access_token}` }

      const [profileRes, historyRes] = await Promise.all([
        fetch('/api/profile', { headers }),
        fetch('/api/history', { headers }),
      ])
      const { profile } = await profileRes.json().catch(() => ({ profile: null }))
      const { scans } = await historyRes.json().catch(() => ({ scans: [] }))

      const totals = { safe: 0, warning: 0, danger: 0 }
      ;(scans || []).forEach((s: ScanRecord) => { totals[s.result] = (totals[s.result] || 0) + 1 })

      setData({
        displayName: profile?.display_name || session.user.email?.split('@')[0] || '',
        allergenCount: profile?.allergen_config?.length || 0,
        scans: (scans || []).slice(0, 5),
        totals,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12 animate-pulse">
        <div className="h-3 w-20 rounded-full bg-canvas-raised" />
        <div className="mt-4 h-11 w-80 rounded-2xl bg-canvas-raised" />
        <div className="mt-3 h-4 w-44 rounded-full bg-canvas-raised" />
        <div className="mt-8 h-[100px] rounded-[28px] bg-canvas-raised" />
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-[24px] border border-app bg-surface" />
          ))}
        </div>
        <div className="mt-10 space-y-3">
          <div className="h-6 w-32 rounded-full bg-canvas-raised" />
          <div className="h-16 rounded-[24px] border border-app bg-surface" />
          <div className="h-16 rounded-[24px] border border-app bg-surface" />
        </div>
      </div>
    )
  }

  const greetKey = greet()
  const greeting = t(`greet${greetKey.charAt(0).toUpperCase() + greetKey.slice(1)}` as 'greetMorgen' | 'greetTag' | 'greetAbend')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Onboarding banner */}
      {data.allergenCount === 0 && (
        <Link
          href="/profile"
          className="mb-6 flex items-center gap-3 rounded-[20px] border border-warning/40 bg-warning-tint p-4 transition-all hover:border-warning"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-warning">{to('banner')}</p>
          </div>
          <span className="rounded-full bg-warning px-3 py-1.5 text-xs font-medium text-on-brand">
            {to('ctaButton')}
          </span>
        </Link>
      )}

      {/* Greeting */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {t('eyebrow')}
      </div>
      <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-app sm:text-[46px]">
        {greeting},{' '}
        <span className="font-serif-italic text-brand">
          {data.displayName || t('friend')}.
        </span>
      </h1>
      <p className="mt-2 text-sm text-app-secondary">{t('subtitle')}</p>

      {/* Primary CTA */}
      <Link
        href="/scan"
        className="group mt-8 flex items-center justify-between gap-4 rounded-[28px] bg-brand p-6 text-on-brand shadow-brand transition-all hover:bg-brand-hover sm:p-8"
      >
        <div className="flex items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-on-brand/15 animate-pulse-ring" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-on-brand/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-70">
              {t('quickAction')}
            </p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl">{t('newScan')}</p>
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>

      {/* Stats grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <StatCard label={t('statAllergens')} value={data.allergenCount} hint={t('statAllergensHint')} href="/profile" />
        <StatCard label={t('statSafe')} value={data.totals.safe} tone="safe" />
        <StatCard label={t('statWarning')} value={data.totals.warning} tone="warning" />
        <StatCard label={t('statDanger')} value={data.totals.danger} tone="danger" />
      </div>

      {/* Recent scans */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-muted">
              {t('recentEyebrow')}
            </p>
            <h2 className="mt-1 font-serif text-2xl text-app">
              {t('recentTitle')}
              <span className="font-serif-italic text-brand">.</span>
            </h2>
          </div>
          <Link href="/history" className="text-xs font-medium text-brand hover:text-brand-hover">
            {t('viewAll')} -&gt;
          </Link>
        </div>

        {data.scans.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-app bg-surface p-8 text-center">
            <p className="font-serif-italic text-xl text-app">{t('emptyTitle')}</p>
            <p className="mt-2 text-sm text-app-muted">{t('emptyHint')}</p>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-app/0 rounded-[24px] border border-app bg-surface overflow-hidden">
            {data.scans.map((scan) => {
              const c = SIGNAL_CHIP[scan.result]
              return (
                <li key={scan.id} className="flex items-center gap-4 border-b border-app p-4 last:border-b-0">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${c.bg}`}>
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-app">
                      {scan.product_name || scan.ingredients_text.slice(0, 60)}
                    </p>
                    <p className="text-xs text-app-muted">
                      {new Date(scan.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`hidden rounded-full px-3 py-1 text-[11px] font-medium ${c.bg} ${c.text} sm:inline-flex`}>
                    {c.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label, value, hint, tone, href,
}: { label: string; value: number; hint?: string; tone?: 'safe' | 'warning' | 'danger'; href?: string }) {
  const toneClass = tone === 'safe' ? 'text-safe' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-app'
  const inner = (
    <div className="rounded-[24px] border border-app bg-surface p-5 transition-all hover:border-app-strong">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-muted">{label}</p>
      <p className={`mt-2 font-serif text-[34px] leading-none ${toneClass}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-app-muted">{hint}</p>}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function greet(): string {
  const h = new Date().getHours()
  if (h < 11) return 'morgen'
  if (h < 17) return 'tag'
  return 'abend'
}
