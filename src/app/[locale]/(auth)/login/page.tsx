'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'

export default function LoginPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
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

  async function handleMagicLink() {
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setError(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('loginTitle')}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {tc('appName')}
          </p>
        </div>

        {magicLinkSent ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            {t('magicLinkSent')}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {t('loginTitle')}
            </button>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="w-full rounded-lg border border-zinc-300 py-2.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {t('magicLink')}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {t('noAccount')}{' '}
          <Link href="/register" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            {tc('register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
