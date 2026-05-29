'use client'

import { useTranslations } from 'next-intl'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-4xl">&#9888;&#65039;</div>
      <h2 className="text-xl font-bold">{t('error')}</h2>
      <p className="text-sm text-zinc-500">Something went wrong.</p>
      <button
        onClick={reset}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Try again
      </button>
    </div>
  )
}
