import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function HomePage() {
  const t = useTranslations('common')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="flex max-w-xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t('appName')}
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t('tagline')}
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t('login')}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {t('register')}
          </Link>
        </div>
      </main>
    </div>
  )
}
