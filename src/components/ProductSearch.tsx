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
          className="flex-1 rounded-2xl border border-[#e8e0d0] bg-[#fbf8f2] px-4 py-2.5 text-sm placeholder:text-[#8a8275] transition-colors focus:border-[#1a4d3a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3a]/15"
        />
        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="inline-flex items-center justify-center rounded-full bg-[#1a4d3a] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e] disabled:opacity-50"
        >
          {t('searchButton')}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#8a8275]">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#e8e0d0] border-t-[#1a4d3a]" />
          {t('searching')}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="rounded-2xl border border-[#e8e0d0] bg-[#fbf8f2] p-4 text-sm text-[#8a8275]">
          {t('noResults')}
        </div>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((product, i) => (
            <li key={product.id || i}>
              <button
                onClick={() => onProductSelect(product)}
                className="group w-full rounded-2xl border border-[#e8e0d0] bg-white p-4 text-left transition-all hover:border-[#1a4d3a] hover:bg-[#fbf8f2]"
              >
                <div className="text-sm font-medium text-[#1a1a1a]">{product.name}</div>
                <div className="mt-0.5 text-xs text-[#8a8275]">
                  {product.brand && <span>{product.brand} &middot; </span>}
                  <span>EAN: {product.ean}</span>
                </div>
                <div className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#4a4a4a]">
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
