import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function HomePage() {
  const t = useTranslations('common')
  const th = useTranslations('home')

  return (
    <div className="flex flex-col items-center px-6 py-16">
      {/* Hero */}
      <section className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="text-5xl">&#9888;&#65039;</span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('appName')}
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {th('hero')}
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t('register')}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {t('login')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 grid max-w-4xl gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-900">&#128270;</div>
          <h3 className="font-semibold">{th('feature1Title')}</h3>
          <p className="mt-1 text-sm text-zinc-500">{th('feature1Desc')}</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl dark:bg-yellow-900">&#128247;</div>
          <h3 className="font-semibold">{th('feature2Title')}</h3>
          <p className="mt-1 text-sm text-zinc-500">{th('feature2Desc')}</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl dark:bg-green-900">&#9989;</div>
          <h3 className="font-semibold">{th('feature3Title')}</h3>
          <p className="mt-1 text-sm text-zinc-500">{th('feature3Desc')}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20 max-w-2xl text-center">
        <h2 className="text-2xl font-bold">{th('howTitle')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="text-2xl font-bold text-zinc-300 dark:text-zinc-600">1</div>
            <p className="mt-1 text-sm">{th('step1')}</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-300 dark:text-zinc-600">2</div>
            <p className="mt-1 text-sm">{th('step2')}</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-300 dark:text-zinc-600">3</div>
            <p className="mt-1 text-sm">{th('step3')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
