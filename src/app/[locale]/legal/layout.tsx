import type { ReactNode } from 'react'

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <article className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
        {children}
      </article>
    </div>
  )
}
