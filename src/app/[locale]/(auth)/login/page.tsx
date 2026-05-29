'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Link, useRouter } from '@/i18n/navigation'

export default function LoginPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 self-start">
        <span className="font-serif-italic text-2xl text-brand">A</span>
        <span className="text-sm font-medium text-app">{tc('appName')}</span>
      </Link>

      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        {t('loginWelcome')}
      </div>
      <h1 className="mt-2 font-serif text-[36px] leading-[1.05] text-app">
        {t('loginHeading', { app: tc('appName') }).split(tc('appName'))[0]}
        <span className="font-serif-italic text-brand">{tc('appName')}</span>
        {t('loginHeading', { app: tc('appName') }).split(tc('appName'))[1]}
      </h1>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-2xl border border-danger/30 bg-danger-tint p-3 text-sm text-danger">{error}</div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.14em] text-app-muted">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-[0.14em] text-app-muted">
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-2 block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
        >
          {loading ? tc('loading') : t('loginTitle')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-app-secondary">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-medium text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand">
          {tc('register')}
        </Link>
      </p>
    </div>
  )
}
