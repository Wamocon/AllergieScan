'use client'

import { useTranslations } from 'next-intl'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-tint">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-app">{t('error')}</h2>
      <p className="max-w-sm text-sm text-app-muted">{t('errorMessage')}</p>
      <button
        onClick={reset}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover"
      >
        {t('tryAgain')}
      </button>
    </div>
  )
}
