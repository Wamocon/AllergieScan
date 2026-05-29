'use client'

import { useTranslations } from 'next-intl'
import type { ScanDecision } from '@/lib/engine/types'

interface Product {
  id?: string
  ean: string
  name: string
  brand: string
  ingredients_text: string
}

interface ScanResultProps {
  result: ScanDecision
  product: Product | null
  onDismiss: () => void
}

export function ScanResult({ result, product, onDismiss }: ScanResultProps) {
  const t = useTranslations('scan')
  const tr = useTranslations('result')

  const config = {
    safe: {
      bg: 'bg-[#2d8659]',
      ring: 'bg-[#2d8659]/30',
      icon: <CheckIcon />,
      label: t('resultSafe'),
      detail: 'bg-[#e3f1e9] border-[#bcdcc8]',
      heading: 'text-[#1a4d3a]',
    },
    warning: {
      bg: 'bg-[#c08810]',
      ring: 'bg-[#c08810]/30',
      icon: <WarningIcon />,
      label: t('resultWarning'),
      detail: 'bg-[#faf0d8] border-[#e8d49a]',
      heading: 'text-[#7a5408]',
    },
    danger: {
      bg: 'bg-[#b3380e]',
      ring: 'bg-[#b3380e]/30',
      icon: <DangerIcon />,
      label: t('resultDanger'),
      detail: 'bg-[#f7e1d4] border-[#e8b89a]',
      heading: 'text-[#7a2608]',
    },
  }

  const current = config[result.result]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#f5f0e8] animate-in fade-in duration-200">
      {/* Signal Header */}
      <div className={`relative flex flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-14 text-white ${current.bg}`}>
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className={`absolute inset-0 rounded-full ${current.ring} animate-pulse-ring`} />
          <div className={`absolute inset-2 rounded-full ${current.ring} animate-pulse-ring`} style={{ animationDelay: '0.6s' }} />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm animate-breathe">
            {current.icon}
          </div>
        </div>
        <h2 className="mt-6 font-serif text-[40px] leading-none">{current.label}</h2>
        {product && (
          <p className="mt-3 text-center text-sm font-medium opacity-95">
            {product.name}{product.brand ? ` \u00b7 ${product.brand}` : ''}
          </p>
        )}
        <p className="mt-1.5 text-xs uppercase tracking-[0.14em] opacity-75">
          {result.matched_tokens}/{result.total_tokens} {t('tokensMatched')}
        </p>
      </div>

      {/* Detail Sheet */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-xl">
          {/* Matched Allergens */}
          {result.matched_allergens.length > 0 && (
            <div className={`rounded-[24px] border p-5 ${current.detail}`}>
              <h3 className={`text-[10px] font-medium uppercase tracking-[0.16em] ${current.heading}`}>
                {t('matchedAllergens')}
              </h3>
              <ul className="mt-4 space-y-3">
                {result.matched_allergens.map((hit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      hit.category === 'top14' ? 'bg-[#b3380e]' : 'bg-[#c08810]'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="font-medium text-[#1a1a1a]">
                          {hit.allergen_name_de}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#8a8275]">
                          {hit.category === 'top14' ? t('categoryTop14') : t('categoryTop30')}
                        </span>
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-[#4a4a4a]">
                        {hit.matched_terms.join(', ')}
                        <span className="ml-2 text-[#8a8275]">
                          ({hit.confidence}, {hit.risk_level})
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unknown Tokens */}
          {result.unknown_tokens.length > 0 && (
            <div className="mt-4 rounded-[24px] border border-[#e8e0d0] bg-[#fbf8f2] p-5">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a8275]">
                {t('unknownIngredients')}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a4a4a]">
                {result.unknown_tokens.join(', ')}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs italic text-[#8a8275]">
            {tr('disclaimer')}
          </p>
        </div>
      </div>

      {/* Dismiss Button */}
      <div className="border-t border-[#e8e0d0] bg-[#fbf8f2] p-4">
        <button
          onClick={onDismiss}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a4d3a] px-4 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e]"
        >
          {t('scanAgain')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function DangerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}
