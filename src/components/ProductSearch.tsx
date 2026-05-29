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

interface ProductSearchProps {
  onProductSelect: (product: Product) => void
}

export function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const t = useTranslations('scan')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (query.trim().length < 2) return

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      setResults(data.products || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {t('searchButton')}
        </button>
      </div>

      {loading && (
        <div className="text-sm text-zinc-500">{t('searching')}</div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="rounded-lg border border-zinc-200 p-3 text-sm text-zinc-500 dark:border-zinc-700">
          {t('noResults')}
        </div>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((product, i) => (
            <li key={product.id || i}>
              <button
                onClick={() => onProductSelect(product)}
                className="w-full rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <div className="font-medium">{product.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {product.brand && <span>{product.brand} &middot; </span>}
                  <span>EAN: {product.ean}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-zinc-400">
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
