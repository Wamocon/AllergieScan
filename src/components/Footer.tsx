'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="mt-auto border-t border-[#e8e0d0] dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-[#8a8275]">
            <span className="font-serif-italic text-base text-[#1a4d3a]">A</span>
            &copy; {new Date().getFullYear()} WAMOCON GmbH, Eschborn
          </div>

          <nav className="flex gap-5 text-xs">
            <Link href="/legal/impressum" className="text-[#8a8275] transition-colors hover:text-[#1a4d3a]">
              {t('impressum')}
            </Link>
            <Link href="/legal/datenschutz" className="text-[#8a8275] transition-colors hover:text-[#1a4d3a]">
              {t('datenschutz')}
            </Link>
            <Link href="/legal/agb" className="text-[#8a8275] transition-colors hover:text-[#1a4d3a]">
              {t('agb')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
