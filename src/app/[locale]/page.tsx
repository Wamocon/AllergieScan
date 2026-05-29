import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LiveAmpel } from '@/components/LiveAmpel'

export default function HomePage() {
  const t = useTranslations('common')
  const th = useTranslations('home')

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-12 lg:px-8 lg:pt-20">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        AllergieScan &nbsp;&middot;&nbsp; Fuer die DACH-Region
      </div>

      {/* Hero */}
      <section className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-[44px] leading-[1.02] tracking-[-0.025em] text-app sm:text-[60px] lg:text-[72px]">
            <span className="font-sans font-light">{th('heroTitle1')}</span>{' '}
            <span className="font-serif-italic text-brand">{th('heroTitle2')}</span>
            <br />
            <span className="font-sans font-light">{th('heroTitle3')}</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-[1.65] text-app-secondary lg:text-lg">{th('hero')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover"
            >
              {t('register')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-app underline decoration-app-strong decoration-2 underline-offset-[6px] transition-colors hover:decoration-brand"
            >
              {t('login')}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-app-muted">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-safe-tint text-[10px] font-semibold text-safe">14</span>
              EU-Pflicht-Allergene
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-tint text-[10px] font-semibold text-brand">+</span>
              30 erweiterte Allergene
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Open Food Facts
            </div>
          </div>
        </div>

        <div className="min-h-[480px]">
          <LiveAmpel />
        </div>
      </section>

      {/* Bento grid */}
      <section className="mt-24 grid gap-4 sm:grid-cols-6 sm:grid-rows-2 lg:gap-5">
        <div className="group relative overflow-hidden rounded-[28px] border border-app bg-surface p-7 transition-all hover:border-app-strong sm:col-span-4 sm:row-span-2">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-app-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {th('method')} 01
              </div>
              <h3 className="mt-5 font-serif text-[32px] leading-[1.05] text-app sm:text-[40px]">{th('feature2Title')}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-app-secondary">{th('feature2Desc')}</p>
            </div>
            <div className="flex h-20 items-end gap-[3px] overflow-hidden rounded-2xl bg-canvas-raised p-5">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-brand"
                  style={{ width: i % 3 === 0 ? '4px' : '2px', height: `${30 + ((i * 13) % 50)}%`, opacity: i % 5 === 0 ? 1 : 0.7 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-app bg-surface p-6 transition-all hover:border-app-strong sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-tint text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-[22px] leading-tight text-app">{th('feature1Title')}</h3>
          <p className="mt-2 text-xs leading-relaxed text-app-secondary">{th('feature1Desc')}</p>
        </div>

        <div className="rounded-[28px] border border-app bg-surface p-6 transition-all hover:border-app-strong sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-tint text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-[22px] leading-tight text-app">{th('feature3Title')}</h3>
          <p className="mt-2 text-xs leading-relaxed text-app-secondary">{th('feature3Desc')}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-28">
        <div className="flex items-end justify-between gap-8">
          <h2 className="font-serif text-[40px] leading-[1.05] text-app sm:text-[52px]">
            {th('howTitle')}
            <span className="font-serif-italic text-brand">.</span>
          </h2>
          <div className="hidden text-right text-xs uppercase tracking-[0.18em] text-app-muted sm:block">{th('steps')}</div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-app bg-app sm:grid-cols-3">
          {[
            { n: '01', text: th('step1') },
            { n: '02', text: th('step2') },
            { n: '03', text: th('step3') },
          ].map((step) => (
            <div key={step.n} className="bg-canvas-raised p-7">
              <div className="font-serif-italic text-3xl text-brand">{step.n}</div>
              <p className="mt-4 text-sm leading-relaxed text-app">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-[32px] bg-brand px-8 py-14 text-center sm:px-12 sm:py-20">
        <h2 className="font-serif text-[36px] leading-[1.05] text-on-brand sm:text-[48px]">
          {th('ctaTitle')} <span className="font-serif-italic text-safe-tint">{th('ctaTitleHighlight')}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-on-brand/75">
          {th('ctaDesc')}
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-surface px-7 py-3.5 text-sm font-medium text-brand transition-all hover:bg-canvas-raised"
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
