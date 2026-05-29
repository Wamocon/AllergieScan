'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} WAMOCON GmbH, Eschborn
          </div>

          <nav className="flex gap-4 text-xs text-zinc-500">
            <Link href="/legal/impressum" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('impressum')}
            </Link>
            <Link href="/legal/datenschutz" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('datenschutz')}
            </Link>
            <Link href="/legal/agb" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('agb')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
