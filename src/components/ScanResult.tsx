'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { ScanDecision } from '@/lib/engine/types'

interface Product {
  id?: string
  ean: string
  name: string
  brand: string
  ingredients_text: string
}

interface Props {
  result: ScanDecision
  product: Product | null
  onDismiss: () => void
}

type Signal = 'safe' | 'warning' | 'danger'

const CONFIG: Record<Signal, {
  iconBg: string
  ringBg: string
  detailBg: string
  detailBorder: string
  detailHeading: string
  labelKey: string
  icon: React.ReactNode
}> = {
  safe: {
    iconBg: 'bg-safe',
    ringBg: 'bg-safe/30',
    detailBg: 'bg-safe-tint',
    detailBorder: 'border-safe/30',
    detailHeading: 'text-safe',
    labelKey: 'resultSafe',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  warning: {
    iconBg: 'bg-warning',
    ringBg: 'bg-warning/30',
    detailBg: 'bg-warning-tint',
    detailBorder: 'border-warning/30',
    detailHeading: 'text-warning',
    labelKey: 'resultWarning',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  danger: {
    iconBg: 'bg-danger',
    ringBg: 'bg-danger/30',
    detailBg: 'bg-danger-tint',
    detailBorder: 'border-danger/30',
    detailHeading: 'text-danger',
    labelKey: 'resultDanger',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
}

export function ScanResult({ result, product, onDismiss }: Props) {
  const t = useTranslations('scan')
  const tr = useTranslations('result')

  const signal: Signal = result.result
  const c = CONFIG[signal]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-canvas animate-in fade-in" style={{ animationDuration: '300ms' }}>
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 sm:py-12">
        {/* Breathing signal icon */}
        <div className="flex flex-col items-center pt-8">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className={`absolute inset-0 rounded-full ${c.ringBg} animate-pulse-ring`} />
            <div className={`absolute inset-2 rounded-full ${c.ringBg} animate-pulse-ring`} style={{ animationDelay: '0.6s' }} />
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${c.iconBg} text-on-brand shadow-[0_8px_24px_rgba(0,0,0,0.18)] animate-breathe`}>
              {c.icon}
            </div>
          </div>

          <h2 className="mt-8 font-serif text-[40px] leading-none text-app sm:text-[48px]">
            {t(c.labelKey)}
          </h2>
          {product && (
            <p className="mt-3 max-w-md text-center text-sm text-app-muted">
              {product.name}{product.brand ? ` - ${product.brand}` : ''}
            </p>
          )}
        </div>

        {/* Detail card */}
        <div className={`mt-10 rounded-[24px] border ${c.detailBorder} ${c.detailBg} p-6`}>
          {result.matched_allergens && result.matched_allergens.length > 0 && (
            <>
              <p className={`text-[11px] font-medium uppercase tracking-[0.14em] ${c.detailHeading}`}>
                {t('matchedAllergens')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.matched_allergens.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-app shadow-soft">
                    {a.allergen_name_de}
                  </span>
                ))}
              </div>
            </>
          )}

          {result.unknown_tokens && result.unknown_tokens.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-app-muted">
                {t('unknownIngredients')}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-app-secondary">
                {result.unknown_tokens.join(', ')}
              </p>
            </div>
          )}

          {result.total_tokens > 0 && (
            <div className="mt-5 flex items-center justify-between text-xs text-app-muted">
              <span>{t('tokensMatched')}</span>
              <span className="font-medium text-app">{result.matched_tokens} / {result.total_tokens}</span>
            </div>
          )}
        </div>

        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-app-muted">
          {tr('disclaimer')}
        </p>

        {/* Dismiss CTA */}
        <div className="mt-auto pt-10">
          <button
            onClick={onDismiss}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover"
          >
            {t('scanAgain')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
