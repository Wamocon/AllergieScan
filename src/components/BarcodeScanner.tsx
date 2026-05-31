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

// Check for native BarcodeDetector support
function hasNativeBarcodeDetector(): boolean {
  return typeof window !== 'undefined' && 'BarcodeDetector' in window
}

export function BarcodeScanner({ onProductFound }: BarcodeScannerProps) {
  const t = useTranslations('scan')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [lookupStatus, setLookupStatus] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<unknown>(null)
  const animFrameRef = useRef<number>(0)
  const [manualEan, setManualEan] = useState('')

  async function startScanning() {
    setError('')
    setScanning(true)

    if (hasNativeBarcodeDetector()) {
      await startNativeScanning()
    } else {
      await startFallbackScanning()
    }
  }

  async function startNativeScanning() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] })

      const scan = async () => {
        if (!videoRef.current || !streamRef.current) return
        try {
          const barcodes = await detector.detect(videoRef.current)
          if (barcodes.length > 0) {
            stopScanning()
            handleBarcodeLookup(barcodes[0].rawValue)
            return
          }
        } catch { /* detection frame error, continue */ }
        animFrameRef.current = requestAnimationFrame(scan)
      }
      animFrameRef.current = requestAnimationFrame(scan)
    } catch (err) {
      setScanning(false)
      if (err instanceof Error && err.message.includes('Permission')) {
        setError(t('cameraPermissionDenied'))
      } else {
        setError(t('cameraError'))
      }
    }
  }

  async function startFallbackScanning() {
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      if (!scannerRef.current) return
      const scannerId = 'barcode-scanner-region'
      scannerRef.current.id = scannerId
      const html5QrCode = new Html5Qrcode(scannerId)
      html5QrCodeRef.current = html5QrCode
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 300, height: 150 }, aspectRatio: 2.0 },
        async (decodedText: string) => {
          await html5QrCode.stop()
          html5QrCodeRef.current = null
          setScanning(false)
          handleBarcodeLookup(decodedText)
        },
        () => {},
      )
    } catch (err) {
      setScanning(false)
      if (err instanceof Error && err.message.includes('Permission')) {
        setError(t('cameraPermissionDenied'))
      } else {
        setError(t('cameraError'))
      }
    }
  }

  async function stopScanning() {
    // Stop native camera
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = 0
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    // Stop html5-qrcode fallback
    if (html5QrCodeRef.current) {
      try {
        await (html5QrCodeRef.current as { stop: () => Promise<void> }).stop()
      } catch {}
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
      } else if (data.product) {
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

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (/^\d{8,13}$/.test(manualEan.trim())) {
      handleBarcodeLookup(manualEan.trim())
    }
  }

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (html5QrCodeRef.current) {
        (html5QrCodeRef.current as { stop: () => Promise<void> }).stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Native BarcodeDetector video */}
      <video
        ref={videoRef}
        className={`w-full overflow-hidden rounded-2xl border border-app bg-canvas-raised ${scanning && hasNativeBarcodeDetector() ? 'block' : 'hidden'}`}
        playsInline
        muted
      />
      {/* html5-qrcode fallback container */}
      <div
        ref={scannerRef}
        className={`overflow-hidden rounded-2xl border border-app bg-canvas-raised ${scanning && !hasNativeBarcodeDetector() ? 'min-h-[250px]' : 'hidden'}`}
      />

      {!scanning && (
        <button
          onClick={startScanning}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover"
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
          className="w-full rounded-full border border-app bg-surface px-6 py-2.5 text-sm font-medium text-app transition-colors hover:bg-canvas-raised"
        >
          {t('stopCamera')}
        </button>
      )}

      <div className="border-t border-app pt-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-app-muted">{t('manualEanLabel')}</p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{8,13}"
            value={manualEan}
            onChange={(e) => setManualEan(e.target.value)}
            placeholder="4000521005702"
            className="flex-1 rounded-2xl border border-app bg-canvas-raised px-4 py-2.5 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="submit"
            disabled={!/^\d{8,13}$/.test(manualEan.trim())}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
          >
            {t('lookupButton')}
          </button>
        </form>
      </div>

      {lookupStatus && (
        <div className="flex items-center gap-2 text-sm text-app-muted">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-app border-t-brand" />
          {lookupStatus}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger-tint p-4 text-sm text-danger">
          {error}
        </div>
      )}
    </div>
  )
}
