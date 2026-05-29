'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { ProductSearch } from '@/components/ProductSearch'
import { BarcodeScanner } from '@/components/BarcodeScanner'
import { ScanResult } from '@/components/ScanResult'
import type { ScanDecision } from '@/lib/engine/types'

type Tab = 'search' | 'barcode' | 'text'

interface Product {
  id?: string
  ean: string
  name: string
  brand: string
  ingredients_text: string
}

export default function ScanPage() {
  const t = useTranslations('scan')
  const [activeTab, setActiveTab] = useState<Tab>('search')
  const [ingredientsText, setIngredientsText] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [result, setResult] = useState<ScanDecision | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheck(text?: string, productId?: string) {
    const checkText = text || ingredientsText
    if (!checkText.trim()) return
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ ingredients_text: checkText, product_id: productId || null }),
      })
      const data = await response.json()
      if (!response.ok) setError(data.error || 'Unknown error')
      else setResult(data)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  function handleProductSelect(product: Product) {
    setSelectedProduct(product)
    setIngredientsText(product.ingredients_text)
    setResult(null)
    setError('')
    handleCheck(product.ingredients_text, product.id)
  }

  function handleDismissResult() {
    setResult(null)
    setSelectedProduct(null)
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'search', label: t('tabSearch'), icon: <SearchTabIcon /> },
    { key: 'barcode', label: t('tabBarcode'), icon: <BarcodeTabIcon /> },
    { key: 'text', label: t('tabText'), icon: <TextTabIcon /> },
  ]

  return (
    <>
      {result && <ScanResult result={result} product={selectedProduct} onDismiss={handleDismissResult} />}

      <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {t('title')}
        </div>
        <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-app sm:text-[42px]">
          {t('heading')} <span className="font-serif-italic text-brand">{t('headingHighlight')}</span>.
        </h1>

        <div className="mt-7 flex gap-1 rounded-full border border-app bg-canvas-raised p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setResult(null); setError(''); setSelectedProduct(null) }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-brand text-on-brand shadow-brand'
                  : 'text-app-secondary hover:text-brand'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === 'search' && (
            <div className="rounded-[28px] border border-app bg-surface p-5 shadow-soft">
              <ProductSearch onProductSelect={handleProductSelect} />
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="rounded-[28px] border border-app bg-surface p-5 shadow-soft">
              <BarcodeScanner onProductFound={handleProductSelect} />
            </div>
          )}

          {activeTab === 'text' && (
            <div className="rounded-[28px] border border-app bg-surface p-5 shadow-soft">
              <div className="space-y-4">
                <label htmlFor="ingredients" className="block text-sm font-medium text-app">
                  {t('inputLabel')}
                </label>
                <textarea
                  id="ingredients"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder={t('inputPlaceholder')}
                  rows={5}
                  className="block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm leading-relaxed text-app transition-colors placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                <button
                  onClick={() => handleCheck()}
                  disabled={loading || !ingredientsText.trim()}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
                >
                  {loading ? t('checking') : t('checkButton')}
                  {!loading && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedProduct && !result && (activeTab === 'search' || activeTab === 'barcode') && (
          <div className="mt-4 rounded-[28px] border border-app bg-surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <BarcodeTabIcon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-app">{selectedProduct.name}</div>
                {selectedProduct.brand && <div className="text-xs text-app-muted">{selectedProduct.brand}</div>}
                <div className="mt-2 line-clamp-2 text-xs leading-relaxed text-app-secondary">
                  {selectedProduct.ingredients_text}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-app-muted">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-app border-t-brand" />
            {t('checking')}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-danger/30 bg-danger-tint p-4 text-sm text-danger">
            {error}
          </div>
        )}
      </div>
    </>
  )
}

function SearchTabIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) }
function BarcodeTabIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg>) }
function TextTabIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>) }
