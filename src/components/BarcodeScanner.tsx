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

const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128']

export function BarcodeScanner({ onProductFound }: BarcodeScannerProps) {
  const t = useTranslations('scan')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [lookupStatus, setLookupStatus] = useState('')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [noBarcodeInPhoto, setNoBarcodeInPhoto] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<unknown>(null)
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manualEan, setManualEan] = useState('')

  function clearScanTimer() {
    if (scanTimerRef.current !== null) {
      clearTimeout(scanTimerRef.current)
      scanTimerRef.current = null
    }
  }

  async function capturePhoto() {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    clearScanTimer()
    setCapturedImage(dataUrl)
    setNoBarcodeInPhoto(false)
    setLookupStatus(t('processingPhoto'))

    // 1. Try native BarcodeDetector
    if (hasNativeBarcodeDetector()) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: BARCODE_FORMATS })
        const img = new Image()
        img.src = dataUrl
        await new Promise<void>((resolve) => { img.onload = () => resolve() })
        const barcodes = await detector.detect(img)
        if (barcodes.length > 0) {
          setLookupStatus('')
          setCapturedImage(null)
          stopScanning()
          handleBarcodeLookup(barcodes[0].rawValue)
          return
        }
      } catch { /* fallthrough */ }
    }

    // 2. Fallback: html5-qrcode scanFile on captured canvas blob
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        const { Html5Qrcode } = await import('html5-qrcode')
        const tempId = '__allergiescan_file_scan__'
        if (!document.getElementById(tempId)) {
          const div = document.createElement('div')
          div.id = tempId
          div.style.display = 'none'
          document.body.appendChild(div)
        }
        const scanner = new Html5Qrcode(tempId)
        const ean = await scanner.scanFile(file, false)
        setLookupStatus('')
        setCapturedImage(null)
        stopScanning()
        handleBarcodeLookup(ean)
        return
      }
    } catch { /* fallthrough */ }

    setLookupStatus('')
    setNoBarcodeInPhoto(true)
  }

  function dismissCapture() {
    setCapturedImage(null)
    setNoBarcodeInPhoto(false)
    // Camera stream stays active - user takes another photo manually
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    clearScanTimer()
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (ev) => resolve(ev.target!.result as string)
      reader.readAsDataURL(file)
    })
    setCapturedImage(dataUrl)
    setNoBarcodeInPhoto(false)
    setLookupStatus(t('processingPhoto'))

    // 1. Try native BarcodeDetector
    if (hasNativeBarcodeDetector()) {
      try {
        const bitmap = await createImageBitmap(file)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: BARCODE_FORMATS })
        const barcodes = await detector.detect(bitmap)
        if (barcodes.length > 0) {
          setLookupStatus('')
          setCapturedImage(null)
          stopScanning()
          handleBarcodeLookup(barcodes[0].rawValue)
          return
        }
      } catch { /* fallthrough */ }
    }

    // 2. Fallback: html5-qrcode scanFile
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const tempId = '__allergiescan_file_scan__'
      if (!document.getElementById(tempId)) {
        const div = document.createElement('div')
        div.id = tempId
        div.style.display = 'none'
        document.body.appendChild(div)
      }
      const scanner = new Html5Qrcode(tempId)
      const ean = await scanner.scanFile(file, false)
      setLookupStatus('')
      setCapturedImage(null)
      stopScanning()
      handleBarcodeLookup(ean)
      return
    } catch { /* fallthrough */ }

    setLookupStatus('')
    setNoBarcodeInPhoto(true)
  }

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
      // No auto-scan loop — user captures a photo manually via the shutter button
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
    clearScanTimer()
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
      if (scanTimerRef.current !== null) clearTimeout(scanTimerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
      if (html5QrCodeRef.current) {
        (html5QrCodeRef.current as { stop: () => Promise<void> }).stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Hidden file input – on mobile opens camera, on desktop opens file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Captured / uploaded photo preview */}
      {capturedImage && (
        <div className="overflow-hidden rounded-2xl border border-app">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capturedImage} alt="Aufgenommenes Foto" className="w-full object-cover" />
          {noBarcodeInPhoto && (
            <div className="border-t border-app bg-warning-tint p-3 text-sm text-warning">
              {t('noBarcode')}
            </div>
          )}
          <div className="border-t border-app p-3">
            <button
              onClick={dismissCapture}
              className="w-full rounded-full border border-app bg-surface px-4 py-2 text-sm font-medium text-app transition-colors hover:bg-canvas-raised"
            >
              {t('retakePhoto')}
            </button>
          </div>
        </div>
      )}

      {/* Native BarcodeDetector: video + shutter button */}
      <div className={`relative ${scanning && hasNativeBarcodeDetector() && !capturedImage ? '' : 'hidden'}`}>
        <video
          ref={videoRef}
          className="w-full overflow-hidden rounded-2xl border border-app bg-canvas-raised"
          playsInline
          muted
        />
        {/* Hint overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <span className="rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {t('aimCameraHint')}
          </span>
        </div>
        {/* Shutter button */}
        <button
          onClick={capturePhoto}
          aria-label={t('capturePhoto')}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-lg backdrop-blur-sm transition-transform active:scale-95">
            <div className="h-12 w-12 rounded-full bg-white" />
          </div>
          <span className="rounded-full bg-black/50 px-3 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {t('capturePhoto')}
          </span>
        </button>
      </div>
      {/* html5-qrcode fallback container */}
      <div
        ref={scannerRef}
        className={`overflow-hidden rounded-2xl border border-app bg-canvas-raised ${scanning && !hasNativeBarcodeDetector() ? 'min-h-[250px]' : 'hidden'}`}
      />

      {/* Start camera + Upload photo */}
      {!scanning && (
        <div className="flex flex-col gap-2">
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-app bg-surface px-6 py-3 text-sm font-medium text-app transition-colors hover:bg-canvas-raised"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {t('uploadPhoto')}
          </button>
        </div>
      )}

      {scanning && (
        <div className="flex flex-col gap-2">
          <button
            onClick={stopScanning}
            className="w-full rounded-full border border-app bg-surface px-6 py-2.5 text-sm font-medium text-app transition-colors hover:bg-canvas-raised"
          >
            {t('stopCamera')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-app bg-surface px-6 py-2.5 text-sm font-medium text-app transition-colors hover:bg-canvas-raised"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {t('uploadPhoto')}
          </button>
        </div>
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
