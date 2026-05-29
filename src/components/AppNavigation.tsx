'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function AppNavigation() {
  const t = useTranslations('common')
  const pathname = usePathname()
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

  // Only show nav for logged-in users
  if (!isLoggedIn) return null

  const isActive = (href: string) => pathname.includes(href)

  return (
    <>
      {/* Mobile: Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8e0d0] bg-[#f5f0e8]/95 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
          <NavLink href="/dashboard" label={t('dashboard')} icon={<HomeIcon />} active={isActive('/dashboard')} />
          <ScanFAB />
          <NavLink href="/history" label={t('history')} icon={<HistoryIcon />} active={isActive('/history')} />
          <NavLink href="/profile" label={t('profile')} icon={<ProfileIcon />} active={isActive('/profile')} />
        </div>
      </nav>

      {/* Desktop: Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[240px] flex-col border-r border-[#e8e0d0] bg-[#fbf8f2] dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-6">
          <span className="font-serif-italic text-2xl text-[#1a4d3a]">A</span>
          <span className="text-base font-medium tracking-tight text-[#1a1a1a]">{t('appName')}</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {[
            { href: '/dashboard', label: t('dashboard'), icon: <ScanIcon /> },
            { href: '/history', label: t('history'), icon: <HistoryIcon /> },
            { href: '/profile', label: t('profile'), icon: <ProfileIcon /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-[#1a4d3a] text-white shadow-[0_2px_8px_rgba(26,77,58,0.18)]'
                  : 'text-[#4a4a4a] hover:bg-[#e8f0eb] hover:text-[#1a4d3a]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[#e8e0d0] p-3">
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium transition-colors ${
        active
          ? 'text-[#1a4d3a]'
          : 'text-[#8a8275]'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <span className="mt-0.5 h-1 w-1 rounded-full bg-[#1a4d3a]" />}
    </Link>
  )
}

function ScanFAB() {
  return (
    <Link
      href="/dashboard"
      className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a4d3a] text-white shadow-[0_6px_18px_rgba(26,77,58,0.4)] ring-4 ring-[#f5f0e8] transition-transform hover:scale-105 active:scale-95"
      aria-label="Scan"
    >
      <ScanIcon />
    </Link>
  )
}

function LogoutButton() {
  const t = useTranslations('common')

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-[#8a8275] transition-colors hover:bg-[#f7e1d4] hover:text-[#b3380e]"
    >
      <LogoutIcon />
      {t('logout')}
    </button>
  )
}
