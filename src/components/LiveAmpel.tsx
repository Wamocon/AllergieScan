'use client'

import { useEffect, useState } from 'react'

type Signal = 'safe' | 'warning' | 'danger'

const ROTATION: { signal: Signal; product: string; ingredient: string; verdict: string }[] = [
  { signal: 'safe', product: 'Hafermilch Barista', ingredient: 'Hafer, Wasser, Rapsoel', verdict: 'Frei von deinen Allergenen' },
  { signal: 'warning', product: 'Mueslimischung', ingredient: 'Spuren von Schalenfruechten moeglich', verdict: 'Vorsicht - Spurenwarnung' },
  { signal: 'danger', product: 'Schokocreme', ingredient: 'Enthaelt Haselnuss, Milch', verdict: 'Nicht geeignet' },
]

const SIGNAL_CLASS: Record<Signal, { dot: string; ring: string; chip: string; verdict: string; label: string }> = {
  safe: { dot: 'bg-safe', ring: 'bg-safe/30', chip: 'bg-safe-tint text-safe', verdict: 'text-safe', label: 'Geeignet' },
  warning: { dot: 'bg-warning', ring: 'bg-warning/30', chip: 'bg-warning-tint text-warning', verdict: 'text-warning', label: 'Vorsicht' },
  danger: { dot: 'bg-danger', ring: 'bg-danger/30', chip: 'bg-danger-tint text-danger', verdict: 'text-danger', label: 'Nicht geeignet' },
}

export function LiveAmpel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATION.length), 3200)
    return () => clearInterval(id)
  }, [])

  const current = ROTATION[index]
  const c = SIGNAL_CLASS[current.signal]

  return (
    <div className="relative h-full overflow-hidden rounded-[32px] border border-app bg-canvas-raised p-8 shadow-soft">
      <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-surface-overlay px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-app-muted backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe" />
        Live Demo
      </div>

      <div className="flex flex-col items-center justify-center pt-6">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className={`absolute inset-0 rounded-full ${c.ring} animate-pulse-ring`} />
          <div className={`absolute inset-4 rounded-full ${c.ring} animate-pulse-ring`} style={{ animationDelay: '0.6s' }} />
          <div className={`relative h-32 w-32 rounded-full ${c.dot} animate-breathe shadow-[0_8px_30px_rgba(0,0,0,0.12)]`} />
        </div>

        <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${c.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
          {c.label}
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-app bg-surface p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-app-muted">Produkt</p>
        <p className="mt-1 text-base font-medium text-app">{current.product}</p>
        <p className="mt-2 text-xs leading-relaxed text-app-secondary">{current.ingredient}</p>
        <div className={`mt-3 text-xs font-medium ${c.verdict}`}>{current.verdict}</div>
      </div>
    </div>
  )
}
