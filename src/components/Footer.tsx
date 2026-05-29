'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="mt-auto border-t border-app">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-app-muted">
            <span className="font-serif-italic text-base text-brand">A</span>
            &copy; {new Date().getFullYear()} WAMOCON GmbH, Eschborn
          </div>

          <nav className="flex gap-5 text-xs">
            <Link href="/help" className="text-app-muted transition-colors hover:text-brand">
              {t('help')}
            </Link>
            <Link href="/legal/impressum" className="text-app-muted transition-colors hover:text-brand">
              {t('impressum')}
            </Link>
            <Link href="/legal/datenschutz" className="text-app-muted transition-colors hover:text-brand">
              {t('datenschutz')}
            </Link>
            <Link href="/legal/agb" className="text-app-muted transition-colors hover:text-brand">
              {t('agb')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
