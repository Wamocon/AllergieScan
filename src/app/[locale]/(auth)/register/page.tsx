'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

interface Allergen {
  id: string
  code: string
  name_de: string
  name_en: string
  category: string
}

type RiskLevel = 'critical' | 'high' | 'medium'
interface ProfileAllergen {
  allergen_id: string
  allergen_code: string
  risk_level: RiskLevel
}

const TOTAL_STEPS = 4

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Step 1
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2
  const [displayName, setDisplayName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  // Steps 3-4
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [selected, setSelected] = useState<ProfileAllergen[]>([])

  useEffect(() => {
    async function load() {
      const r = await fetch('/api/allergens')
      const { allergens: list } = await r.json()
      setAllergens(list || [])
    }
    load()
  }, [])

  const top14 = useMemo(() => allergens.filter((a) => a.category === 'top14'), [allergens])
  const top30 = useMemo(() => allergens.filter((a) => a.category === 'top30'), [allergens])

  const isOn = (id: string) => selected.some((s) => s.allergen_id === id)
  function toggleAllergen(a: Allergen) {
    setSelected((prev) => {
      if (prev.some((s) => s.allergen_id === a.id)) return prev.filter((s) => s.allergen_id !== a.id)
      return [...prev, { allergen_id: a.id, allergen_code: a.code, risk_level: a.category === 'top14' ? 'high' : 'medium' }]
    })
  }

  function canAdvance(): boolean {
    if (step === 1) return /\S+@\S+\.\S+/.test(email) && password.length >= 6
    if (step === 2) return displayName.trim().length >= 2
    return true
  }

  async function next() {
    setError('')
    if (!canAdvance()) return
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
      return
    }
    // Submit
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data, error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      })
      if (signErr) throw new Error(signErr.message)
      if (!data.session) {
        // Email confirmation required
        setError(t('confirmEmail'))
        setSubmitting(false)
        return
      }

      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.session.access_token}` },
        body: JSON.stringify({
          display_name: displayName,
          birth_year: birthYear ? Number(birthYear) : null,
          allergen_config: selected,
        }),
      })

      router.push('/scan')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
      setSubmitting(false)
    }
  }

  function back() {
    setError('')
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col px-5 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 self-start">
        <span className="font-serif-italic text-2xl text-brand">A</span>
        <span className="text-sm font-medium text-app">{tc('appName')}</span>
      </Link>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
          <span>{t('wizardStepLabel', { current: step, total: TOTAL_STEPS })}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-raised">
          <div
            className="h-full bg-brand transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1">
        {step === 1 && (
          <StepShell eyebrow="01" title={t('wizardStep1Title')} subtitle={t('wizardStep1Sub')}>
            <div className="space-y-4">
              <Field label={t('email')}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>
              <Field label={t('password')} hint={t('passwordHint')}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell eyebrow="02" title={t('wizardStep2Title')} subtitle={t('wizardStep2Sub')}>
            <div className="space-y-4">
              <Field label={t('displayName')}>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoFocus
                  placeholder={t('displayNamePlaceholder')}
                  className="block w-full rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>
              <Field label={t('birthYear')} hint={t('birthYearHint')}>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="1990"
                  min={1900}
                  max={new Date().getFullYear()}
                  className="block w-40 rounded-2xl border border-app bg-canvas-raised px-4 py-3 text-sm text-app placeholder:text-app-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell eyebrow="03" title={t('wizardStep3Title')} subtitle={t('wizardStep3Sub')}>
            <AllergenGrid items={top14} isOn={isOn} onToggle={toggleAllergen} />
            <p className="mt-4 text-xs text-app-muted">
              {t('selected', { count: top14.filter((a) => isOn(a.id)).length })}
            </p>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell eyebrow="04" title={t('wizardStep4Title')} subtitle={t('wizardStep4Sub')}>
            <AllergenGrid items={top30} isOn={isOn} onToggle={toggleAllergen} />
            <p className="mt-4 text-xs text-app-muted">
              {t('selected', { count: top30.filter((a) => isOn(a.id)).length })}
            </p>
          </StepShell>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-danger/30 bg-danger-tint p-3 text-sm text-danger">{error}</div>
      )}

      {/* Footer nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={back}
          disabled={step === 1 || submitting}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-app-secondary transition-colors hover:text-brand disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t('back')}
        </button>

        <button
          onClick={next}
          disabled={!canAdvance() || submitting}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand shadow-brand transition-all hover:bg-brand-hover disabled:opacity-50"
        >
          {submitting ? tc('loading') : step === TOTAL_STEPS ? t('finish') : t('next')}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-app-secondary">
        {t('hasAccount')}{' '}
        <Link href="/login" className="font-medium text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand">
          {tc('login')}
        </Link>
      </p>
    </div>
  )
}

function StepShell({
  eyebrow, title, subtitle, children,
}: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-app-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        Schritt {eyebrow}
      </div>
      <h1 className="mt-3 font-serif text-[32px] leading-[1.05] text-app sm:text-[40px]">
        {title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className="font-serif-italic text-brand">{title.split(' ').slice(-1)[0]}</span>
      </h1>
      <p className="mt-2 text-sm text-app-secondary">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-app-muted">{label}</label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-app-muted">{hint}</p>}
    </div>
  )
}

function AllergenGrid({
  items, isOn, onToggle,
}: { items: Allergen[]; isOn: (id: string) => boolean; onToggle: (a: Allergen) => void }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-app bg-surface p-6 text-center text-sm text-app-muted">
        Lade...
      </div>
    )
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((a) => {
        const on = isOn(a.id)
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onToggle(a)}
            className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
              on ? 'border-brand bg-brand-tint shadow-soft' : 'border-app bg-surface hover:border-app-strong'
            }`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
              on ? 'border-brand bg-brand text-on-brand' : 'border-app-strong bg-canvas-raised'
            }`}>
              {on && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-app">{a.name_de}</div>
              <div className="truncate text-[11px] text-app-muted">{a.name_en}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
