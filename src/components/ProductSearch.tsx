'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Product {
  id?: string
  ean: string
  name: string
  brand: string
  ingredients_text: string
}

interface Props {
  onProductSelect: (product: Product) => void
}

export function ProductSearch({ onProductSelect }: Props) {
  const t = useTranslations('scan')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.products || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 rounded-2xl border border-app bg-canvas-raised px-4 py-2.5 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
        >
          {loading ? t('searching') : t('searchButton')}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className="rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app-muted">
          {t('noResults')}
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((product) => (
            <li key={product.ean}>
              <button
                onClick={() => onProductSelect(product)}
                className="block w-full rounded-2xl border border-app bg-surface p-4 text-left transition-all hover:border-brand hover:bg-brand-tint"
              >
                <div className="text-sm font-medium text-app">{product.name}</div>
                {product.brand && (
                  <div className="text-xs text-app-muted">{product.brand}</div>
                )}
                <div className="mt-2 line-clamp-2 text-xs leading-relaxed text-app-secondary">
                  {product.ingredients_text}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
