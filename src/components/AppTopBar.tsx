'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AppTopBar() {
  const t = useTranslations('common')

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e0d0] bg-[#f5f0e8]/85 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80 lg:pl-[240px]">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo - mobile only */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="font-serif-italic text-xl text-[#1a4d3a]">A</span>
          <span className="text-sm font-medium tracking-tight">{t('appName')}</span>
        </Link>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
