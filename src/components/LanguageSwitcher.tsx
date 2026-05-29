'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale() {
    const next = locale === 'de' ? 'en' : 'de'
    router.replace(pathname, { locale: next })
  }

  return (
    <button
      onClick={switchLocale}
      className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      {locale === 'de' ? 'EN' : 'DE'}
    </button>
  )
}
