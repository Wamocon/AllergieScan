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
        className={`overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700 ${
          scanning ? 'min-h-[250px]' : 'hidden'
        }`}
      />

      {!scanning && (
        <button
          onClick={startScanning}
          className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {t('startCamera')}
        </button>
      )}

      {scanning && (
        <button
          onClick={stopScanning}
          className="w-full rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {t('stopCamera')}
        </button>
      )}

      {/* Manual EAN input */}
      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <p className="mb-2 text-xs text-zinc-500">{t('manualEanLabel')}</p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{8,13}"
            value={manualEan}
            onChange={(e) => setManualEan(e.target.value)}
            placeholder="4000521005702"
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={!/^\d{8,13}$/.test(manualEan.trim())}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t('lookupButton')}
          </button>
        </form>
      </div>

      {lookupStatus && (
        <div className="text-sm text-zinc-500">{lookupStatus}</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}
    </div>
  )
}
