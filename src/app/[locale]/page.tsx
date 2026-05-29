import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LiveAmpel } from '@/components/LiveAmpel'

export default function HomePage() {
  const t = useTranslations('common')
  const th = useTranslations('home')

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-12 lg:px-8 lg:pt-20">
      {/* Editorial eyebrow */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8275]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1a4d3a]" />
        AllergieScan &nbsp;&middot;&nbsp; Fuer die DACH-Region
      </div>

      {/* Hero - editorial */}
      <section className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-[44px] leading-[1.02] tracking-[-0.025em] text-[#1a1a1a] sm:text-[60px] lg:text-[72px]">
            <span className="font-sans font-light">Weiss,</span>{' '}
            <span className="font-serif-italic text-[#1a4d3a]">was drin ist.</span>
            <br />
            <span className="font-sans font-light">Bevor du es isst.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-[1.65] text-[#4a4a4a] lg:text-lg">
            {th('hero')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#1a4d3a] px-7 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e] hover:shadow-[0_6px_20px_rgba(26,77,58,0.35)]"
            >
              {t('register')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#1a1a1a] underline decoration-[#d4c8b0] decoration-2 underline-offset-[6px] transition-colors hover:decoration-[#1a4d3a]"
            >
              {t('login')}
            </Link>
          </div>

          {/* Trust micro-row */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#8a8275]">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e3f1e9] text-[10px] font-semibold text-[#2d8659]">14</span>
              EU-Pflicht-Allergene
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0eb] text-[10px] font-semibold text-[#1a4d3a]">+</span>
              30 erweiterte Allergene
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1a4d3a]" />
              Open Food Facts
            </div>
          </div>
        </div>

        {/* Live Ampel bento */}
        <div className="min-h-[480px]">
          <LiveAmpel />
        </div>
      </section>

      {/* Bento feature grid */}
      <section className="mt-24 grid gap-4 sm:grid-cols-6 sm:grid-rows-2 lg:gap-5">
        {/* Big card - barcode */}
        <div className="group relative overflow-hidden rounded-[28px] border border-[#e8e0d0] bg-white p-7 transition-all hover:border-[#d4c8b0] sm:col-span-4 sm:row-span-2">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f0e8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8275]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1a4d3a]" />
                Methode 01
              </div>
              <h3 className="mt-5 font-serif text-[32px] leading-[1.05] text-[#1a1a1a] sm:text-[40px]">
                {th('feature2Title')}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#4a4a4a]">
                {th('feature2Desc')}
              </p>
            </div>
            <div className="flex h-20 items-end gap-[3px] overflow-hidden rounded-2xl bg-[#fbf8f2] p-5">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a4d3a]"
                  style={{
                    width: i % 3 === 0 ? '4px' : '2px',
                    height: `${30 + ((i * 13) % 50)}%`,
                    opacity: i % 5 === 0 ? 1 : 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Small card - search */}
        <div className="group rounded-[28px] border border-[#e8e0d0] bg-white p-6 transition-all hover:border-[#d4c8b0] sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f0eb]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a4d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-[22px] leading-tight text-[#1a1a1a]">{th('feature1Title')}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a]">{th('feature1Desc')}</p>
        </div>

        {/* Small card - profile */}
        <div className="group rounded-[28px] border border-[#e8e0d0] bg-white p-6 transition-all hover:border-[#d4c8b0] sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f0eb]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a4d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-[22px] leading-tight text-[#1a1a1a]">{th('feature3Title')}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a]">{th('feature3Desc')}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-28">
        <div className="flex items-end justify-between gap-8">
          <h2 className="font-serif text-[40px] leading-[1.05] text-[#1a1a1a] sm:text-[52px]">
            {th('howTitle')}
            <span className="font-serif-italic text-[#1a4d3a]">.</span>
          </h2>
          <div className="hidden text-right text-xs uppercase tracking-[0.18em] text-[#8a8275] sm:block">
            3 Schritte
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-[#e8e0d0] bg-[#e8e0d0] sm:grid-cols-3">
          {[
            { n: '01', text: th('step1') },
            { n: '02', text: th('step2') },
            { n: '03', text: th('step3') },
          ].map((step) => (
            <div key={step.n} className="bg-[#fbf8f2] p-7">
              <div className="font-serif-italic text-3xl text-[#1a4d3a]">{step.n}</div>
              <p className="mt-4 text-sm leading-relaxed text-[#1a1a1a]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-24 overflow-hidden rounded-[32px] bg-[#1a4d3a] px-8 py-14 text-center sm:px-12 sm:py-20">
        <h2 className="font-serif text-[36px] leading-[1.05] text-white sm:text-[48px]">
          Einkaufen ohne <span className="font-serif-italic text-[#e3f1e9]">Sorge.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/70">
          Erstelle dein Allergieprofil in unter einer Minute. Kostenlos, ohne Werbung.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#1a4d3a] transition-all hover:bg-[#fbf8f2]"
        >
          {t('register')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>
    </div>
  )
}
