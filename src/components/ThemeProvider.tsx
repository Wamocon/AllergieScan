'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((fn) => fn())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => { listeners.delete(callback) }
}

function getSnapshot() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

function getServerSnapshot() {
  return false
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    emitChange()
  }, [])

  return <>{children}</>
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    emitChange()
  }, [])

  return (
    <button
      onClick={toggle}
      className="rounded-full p-2 text-app-muted transition-colors hover:bg-brand-tint hover:text-brand"
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36l-1.42-1.42M7.06 7.06L5.64 5.64m12.72 0l-1.42 1.42M7.06 16.94l-1.42 1.42" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}
