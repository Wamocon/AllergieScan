'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Product {
  id?: string
  ean: string
  name: string
  brand: string
  ingredients_text: string
}

interface BarcodeScannerProps {
  onProductFound: (product: Product) => void
}

export function BarcodeScanner({ onProductFound }: BarcodeScannerProps) {
  const t = useTranslations('scan')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [lookupStatus, setLookupStatus] = useState('')
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<unknown>(null)

  async function startScanning() {
    setError('')
    setScanning(true)

    try {
      const { Html5Qrcode } = await import('html5-qrcode')

      if (!scannerRef.current) return

      const scannerId = 'barcode-scanner-region'
      scannerRef.current.id = scannerId

      const html5QrCode = new Html5Qrcode(scannerId)
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          aspectRatio: 2.0,
        },
        async (decodedText: string) => {
          // Stop scanning once we have a result
          await html5QrCode.stop()
          html5QrCodeRef.current = null
          setScanning(false)
          handleBarcodeLookup(decodedText)
        },
        () => {
          // Ignore scan failures (no barcode in frame)
        }
      )
    } catch (err) {
      setScanning(false)
      if (err instanceof Error) {
        if (err.message.includes('Permission')) {
          setError(t('cameraPermissionDenied'))
        } else {
          setError(t('cameraError'))
        }
      } else {
        setError(t('cameraError'))
      }
    }
  }

  async function stopScanning() {
    if (html5QrCodeRef.current) {
      try {
        await (html5QrCodeRef.current as { stop: () => Promise<void> }).stop()
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null
    }
    setScanning(false)
  }

  async function handleBarcodeLookup(ean: string) {
    setLookupStatus(t('lookingUp'))

    try {
      const res = await fetch(`/api/products/barcode/${ean}`)
      const data = await res.json()

      if (data.product && data.product.ingredients_text) {
        setLookupStatus('')
        onProductFound(data.product)
      } else if (data.product && !data.product.ingredients_text) {
        setLookupStatus('')
        setError(t('productFoundNoIngredients', { name: data.product.name }))
      } else {
        setLookupStatus('')
        setError(t('productNotFound', { ean }))
      }
    } catch {
      setLookupStatus('')
      setError(t('lookupError'))
    }
  }

  // Manual EAN input
  const [manualEan, setManualEan] = useState('')

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (/^\d{8,13}$/.test(manualEan.trim())) {
      handleBarcodeLookup(manualEan.trim())
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        (html5QrCodeRef.current as { stop: () => Promise<void> }).stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Camera scanner area */}
      <div
        ref={scannerRef}
        className={`overflow-hidden rounded-2xl border border-[#e8e0d0] bg-[#fbf8f2] ${
          scanning ? 'min-h-[250px]' : 'hidden'
        }`}
      />

      {!scanning && (
        <button
          onClick={startScanning}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a4d3a] px-6 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          {t('startCamera')}
        </button>
      )}

      {scanning && (
        <button
          onClick={stopScanning}
          className="w-full rounded-full border border-[#e8e0d0] bg-white px-6 py-2.5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-[#fbf8f2]"
        >
          {t('stopCamera')}
        </button>
      )}

      {/* Manual EAN input */}
      <div className="border-t border-[#e8e0d0] pt-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8275]">{t('manualEanLabel')}</p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{8,13}"
            value={manualEan}
            onChange={(e) => setManualEan(e.target.value)}
            placeholder="4000521005702"
            className="flex-1 rounded-2xl border border-[#e8e0d0] bg-[#fbf8f2] px-4 py-2.5 text-sm placeholder:text-[#8a8275] transition-colors focus:border-[#1a4d3a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3a]/15"
          />
          <button
            type="submit"
            disabled={!/^\d{8,13}$/.test(manualEan.trim())}
            className="rounded-full bg-[#1a4d3a] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(26,77,58,0.25)] transition-all hover:bg-[#0f3d2e] disabled:opacity-50"
          >
            {t('lookupButton')}
          </button>
        </form>
      </div>

      {lookupStatus && (
        <div className="flex items-center gap-2 text-sm text-[#8a8275]">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#e8e0d0] border-t-[#1a4d3a]" />
          {lookupStatus}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-[#f7e1d4] bg-[#fdf4ee] p-4 text-sm text-[#7a2608]">
          {error}
        </div>
      )}
    </div>
  )
}
