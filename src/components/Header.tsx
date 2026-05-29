'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname.includes(path)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-red-500">&#9888;</span>
          <span>{t('appName')}</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {t('dashboard')}
              </Link>
              <Link
                href="/profile"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {t('profile')}
              </Link>
              <Link
                href="/history"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive('/history')
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {t('history')}
              </Link>
            </>
          )}

          <div className="ml-2 flex items-center gap-1 border-l border-zinc-200 pl-2 dark:border-zinc-700">
            <LanguageSwitcher />
            <ThemeToggle />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
              >
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
