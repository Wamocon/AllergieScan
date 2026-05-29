'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { Handbook, HandbookBlock, HandbookSection } from '@/lib/handbook/content'

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="rounded bg-warning-tint px-0.5 text-warning">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function matchesQuery(section: HandbookSection, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  if (section.title.toLowerCase().includes(q)) return true
  if (section.intro.toLowerCase().includes(q)) return true
  return section.blocks.some((b) => {
    if (b.type === 'p' || b.type === 'note' || b.type === 'h3') return b.text.toLowerCase().includes(q)
    return b.items.some((i) => i.toLowerCase().includes(q))
  })
}

function Block({ block, query }: { block: HandbookBlock; query: string }) {
  switch (block.type) {
    case 'h3':
      return <h3 className="mt-6 font-serif text-xl text-app">{highlight(block.text, query)}</h3>
    case 'p':
      return <p className="mt-3 text-[15px] leading-[1.7] text-app-secondary">{highlight(block.text, query)}</p>
    case 'ul':
      return (
        <ul className="mt-3 space-y-2 text-[15px] leading-[1.65] text-app-secondary">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-brand" />
              <span>{highlight(item, query)}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="mt-3 space-y-2 text-[15px] leading-[1.65] text-app-secondary">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-serif-italic text-brand">{i + 1}.</span>
              <span>{highlight(item, query)}</span>
            </li>
          ))}
        </ol>
      )
    case 'note':
      return (
        <div className="mt-4 rounded-2xl border-l-2 border-brand bg-brand-tint px-5 py-4 text-[14px] leading-[1.65] text-brand">
          {highlight(block.text, query)}
        </div>
      )
  }
}

export function HandbookViewer({ handbook }: { handbook: Handbook }) {
  const t = useTranslations('help')
  const locale = useLocale()
  const [query, setQuery] = useState('')

  const visibleSections = useMemo(
    () => handbook.sections.filter((s) => matchesQuery(s, query)),
    [handbook.sections, query],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {t('eyebrow')}
      </div>
      <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-app sm:text-[44px]">
        {handbook.title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className="font-serif-italic text-brand">{handbook.title.split(' ').slice(-1)}.</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-app-secondary">{handbook.subtitle}</p>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-app-muted"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-full border border-app bg-canvas-raised py-3 pl-11 pr-4 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <a
          href={`/api/handbook/pdf?locale=${locale}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('downloadPdf')}
        </a>
      </div>

      {/* Body grid */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-muted">
            {t('contents')}
          </p>
          <nav className="mt-4 space-y-1 text-sm">
            {handbook.sections.map((s, i) => {
              const visible = visibleSections.some((v) => v.id === s.id)
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`flex items-baseline gap-2 rounded-xl px-3 py-2 transition-colors ${
                    visible ? 'text-app-secondary hover:bg-brand-tint hover:text-brand' : 'text-app-muted opacity-50'
                  }`}
                >
                  <span className="font-serif-italic text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s.title}</span>
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <div>
          {visibleSections.length === 0 && (
            <div className="rounded-[28px] border border-app bg-surface p-10 text-center">
              <p className="font-serif-italic text-2xl text-app">{t('noResults')}</p>
              <p className="mt-2 text-sm text-app-muted">{t('noResultsHint')}</p>
            </div>
          )}

          <div className="space-y-14">
            {visibleSections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-[28px] border border-app bg-surface p-6 sm:p-10 shadow-soft"
              >
                <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
                  <span className="font-serif-italic text-base normal-case tracking-normal text-brand">
                    {String(handbook.sections.indexOf(section) + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-app" />
                </div>
                <h2 className="mt-4 font-serif text-[28px] leading-[1.1] text-app sm:text-[34px]">
                  {highlight(section.title, query)}
                </h2>
                <p className="mt-2 font-serif-italic text-base text-app-muted">{highlight(section.intro, query)}</p>
                <div className="mt-2">
                  {section.blocks.map((block, idx) => (
                    <Block key={`${section.id}-${idx}-${i}`} block={block} query={query} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
