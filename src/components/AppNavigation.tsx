'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function HomeIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>) }
function ScanIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg>) }
function HistoryIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>) }
function ProfileIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) }
function HelpIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>) }
function LogoutIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>) }

export function AppNavigation() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsLoggedIn(!!session))
    return () => subscription.unsubscribe()
  }, [])

  if (!isLoggedIn) return null

  const isActive = (href: string) => pathname.includes(href)

  const items = [
    { href: '/dashboard', label: t('dashboard'), icon: <HomeIcon /> },
    { href: '/scan', label: t('scan'), icon: <ScanIcon /> },
    { href: '/history', label: t('history'), icon: <HistoryIcon /> },
    { href: '/profile', label: t('profile'), icon: <ProfileIcon /> },
    { href: '/help', label: t('help'), icon: <HelpIcon /> },
  ]

  return (
    <>
      {/* Mobile: Bottom Tab Bar with central FAB pointing to /scan */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-app bg-canvas/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
          <NavLink href="/dashboard" label={t('dashboard')} icon={<HomeIcon />} active={isActive('/dashboard')} />
          <NavLink href="/history" label={t('history')} icon={<HistoryIcon />} active={isActive('/history')} />
          <ScanFAB />
          <NavLink href="/profile" label={t('profile')} icon={<ProfileIcon />} active={isActive('/profile')} />
          <NavLink href="/help" label={t('help')} icon={<HelpIcon />} active={isActive('/help')} />
        </div>
      </nav>

      {/* Desktop: Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[240px] flex-col border-r border-app bg-canvas-raised lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <span className="font-serif-italic text-2xl text-brand">A</span>
          <span className="text-base font-medium tracking-tight text-app">{t('appName')}</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-brand text-on-brand shadow-brand'
                  : 'text-app-secondary hover:bg-brand-tint hover:text-brand'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-app p-3">
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
        active ? 'text-brand' : 'text-app-muted'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <span className="mt-0.5 h-1 w-1 rounded-full bg-brand" />}
    </Link>
  )
}

function ScanFAB() {
  return (
    <Link
      href="/scan"
      className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-brand ring-4 ring-[var(--canvas)] transition-transform hover:scale-105 active:scale-95"
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
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-app-muted transition-colors hover:bg-danger-tint hover:text-danger"
    >
      <LogoutIcon />
      {t('logout')}
    </button>
  )
}
