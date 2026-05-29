'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AppTopBar() {
  const t = useTranslations('common')

  return (
    <header className="sticky top-0 z-50 border-b border-app bg-surface-overlay backdrop-blur-xl lg:pl-[240px]">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="font-serif-italic text-xl text-brand">A</span>
          <span className="text-sm font-medium tracking-tight text-app">{t('appName')}</span>
        </Link>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
