'use client'

import { useEffect, useState } from 'react'

type Signal = 'safe' | 'warning' | 'danger'

const ROTATION: { signal: Signal; product: string; ingredient: string; verdict: string }[] = [
  { signal: 'safe', product: 'Hafermilch Barista', ingredient: 'Hafer, Wasser, Rapsoel', verdict: 'Frei von deinen Allergenen' },
  { signal: 'warning', product: 'Mueslimischung', ingredient: 'Spuren von Schalenfruechten moeglich', verdict: 'Vorsicht - Spurenwarnung' },
  { signal: 'danger', product: 'Schokocreme', ingredient: 'Enthaelt Haselnuss, Milch', verdict: 'Nicht geeignet' },
]

const COLORS: Record<Signal, { bg: string; ring: string; text: string; chip: string; label: string }> = {
  safe: {
    bg: 'bg-[#2d8659]',
    ring: 'bg-[#2d8659]/30',
    text: 'text-[#1a4d3a]',
    chip: 'bg-[#e3f1e9] text-[#1a4d3a]',
    label: 'Geeignet',
  },
  warning: {
    bg: 'bg-[#c08810]',
    ring: 'bg-[#c08810]/30',
    text: 'text-[#7a5408]',
    chip: 'bg-[#faf0d8] text-[#7a5408]',
    label: 'Vorsicht',
  },
  danger: {
    bg: 'bg-[#b3380e]',
    ring: 'bg-[#b3380e]/30',
    text: 'text-[#7a2608]',
    chip: 'bg-[#f7e1d4] text-[#7a2608]',
    label: 'Nicht geeignet',
  },
}

export function LiveAmpel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATION.length), 3200)
    return () => clearInterval(id)
  }, [])

  const current = ROTATION[index]
  const colors = COLORS[current.signal]

  return (
    <div className="relative h-full overflow-hidden rounded-[32px] border border-[#e8e0d0] bg-[#fbf8f2] p-8 shadow-[0_1px_2px_rgba(26,77,58,0.06)]">
      {/* corner ribbon */}
      <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8a8275] backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2d8659]" />
        Live Demo
      </div>

      {/* ampel */}
      <div className="flex flex-col items-center justify-center pt-6">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className={`absolute inset-0 rounded-full ${colors.ring} animate-pulse-ring`} />
          <div className={`absolute inset-4 rounded-full ${colors.ring} animate-pulse-ring`} style={{ animationDelay: '0.6s' }} />
          <div className={`relative h-32 w-32 rounded-full ${colors.bg} animate-breathe shadow-[0_8px_30px_rgba(0,0,0,0.12)]`} />
        </div>

        <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${colors.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${colors.bg}`} />
          {colors.label}
        </div>
      </div>

      {/* product card */}
      <div className="mt-7 rounded-2xl border border-[#e8e0d0] bg-white p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8275]">Produkt</p>
        <p className="mt-1 text-base font-medium text-[#1a1a1a]">{current.product}</p>
        <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a]">{current.ingredient}</p>
        <div className={`mt-3 text-xs font-medium ${colors.text}`}>{current.verdict}</div>
      </div>
    </div>
  )
}
