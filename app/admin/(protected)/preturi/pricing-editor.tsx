'use client'

import { useState } from 'react'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import type { PricingData, PricingPlan } from '@/lib/db/types'

function newPlan(order: number): PricingPlan {
  return {
    id: `plan-${Date.now()}`,
    name: '',
    description: '',
    ageGroup: '',
    level: 'Începător',
    priceMode: 'lunar',
    sessionsPerYear: 70,
    durationMinutes: 55,
    priceMonthly: 0,
    priceNote: '',
    priceStandard: 0,
    priceEarlyBird: 0,
    displayOrder: order,
  }
}

const byOrder = (a: PricingPlan, b: PricingPlan) => a.displayOrder - b.displayOrder

// Verifică local aceleași reguli ca schema de pe server și întoarce o listă de
// probleme lizibile (ce plan și ce câmp) — ca adminul să știe exact ce lipsește
// în loc de „câmpuri invalide" fără detalii.
function validate(data: PricingData): string[] {
  const problems: string[] = []
  data.plans.forEach((p, i) => {
    const missing: string[] = []
    if (!p.name.trim()) missing.push('Nume program')
    if (!p.description.trim()) missing.push('Descriere')
    if (!p.ageGroup.trim()) missing.push('Grupă')
    if (!Number.isFinite(p.durationMinutes) || p.durationMinutes < 1) missing.push('Durată (min)')
    if (missing.length) {
      const label = p.name.trim() ? `„${p.name.trim()}"` : `#${i + 1}`
      problems.push(`Plan ${label}: completează ${missing.join(', ')}.`)
    }
  })
  return problems
}

export default function PricingEditor({ initialData }: { initialData: PricingData }) {
  const [data, setData] = useState<PricingData>(() => ({
    ...initialData,
    plans: [...initialData.plans].sort(byOrder),
  }))
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [problems, setProblems] = useState<string[]>([])

  const update = (patch: Partial<PricingData>) => setData((d) => ({ ...d, ...patch }))

  const updatePlan = (id: string, patch: Partial<PricingPlan>) =>
    setData((d) => ({
      ...d,
      plans: d.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))

  const removePlan = (id: string) =>
    setData((d) => ({ ...d, plans: d.plans.filter((p) => p.id !== id) }))

  const addPlan = () =>
    setData((d) => {
      const nextOrder = d.plans.reduce((max, p) => Math.max(max, p.displayOrder), 0) + 1
      return { ...d, plans: [...d.plans, newPlan(nextOrder)] }
    })

  // Reordonează cardurile după „Ordine" (ca la orar, care se sortează după oră).
  // Rulează la blur ca lista să nu sară în timp ce scrii numărul.
  const reorderPlans = () =>
    setData((d) => ({ ...d, plans: [...d.plans].sort(byOrder) }))

  async function save() {
    const found = validate(data)
    setProblems(found)
    if (found.length) {
      setErrorMsg('Verifică câmpurile de mai jos înainte de salvare:')
      setStatus('error')
      return
    }
    setStatus('saving')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorMsg(err.error === 'validation_failed' ? 'Câmpuri invalide. Verifică valorile.' : 'Eroare la salvare.')
        setStatus('error')
        return
      }
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setErrorMsg('Eroare de rețea.')
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-[#231f20] text-3xl md:text-4xl font-extrabold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Prețuri
          </h1>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Editează planurile, prețul afișat și taxa de rezervare. Alege tipul de
            preț (lunar sau per ședință) și scrie manual subtitlul de preț.
          </p>
        </div>
        <SaveButton status={status} onClick={save} />
      </div>

      {errorMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="font-semibold">{errorMsg}</p>
          {problems.length > 0 && (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {problems.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Global config */}
      <section className="bg-white border border-[#e5e5e5] rounded-2xl p-6 flex flex-col gap-5">
        <h2
          className="text-[#231f20] text-lg font-bold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Setări generale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Deadline reînscriere (intern)">
            <input
              type="date"
              value={data.earlyBirdDeadline}
              onChange={(e) => update({ earlyBirdDeadline: e.target.value })}
              className="admin-input"
            />
            <span className="text-[11px] text-[#6b6b6b]">
              Folosit doar pentru campania de reînscriere, nu pe site.
            </span>
          </Field>
          <Field label="Taxă rezervare (lei)">
            <input
              type="number"
              min={0}
              value={data.reservationFee}
              onChange={(e) => update({ reservationFee: Number(e.target.value) || 0 })}
              className="admin-input"
            />
            <span className="text-[11px] text-[#6b6b6b]">
              0 = taxa nu apare pe site.
            </span>
          </Field>
          <div className="md:col-span-2">
            <Field label="Reduceri (câte una pe rând)">
              <textarea
                rows={4}
                value={data.notes ?? ''}
                onChange={(e) => update({ notes: e.target.value })}
                className="admin-input"
              />
              <span className="text-[11px] text-[#6b6b6b]">
                Apar sub carduri, în blocul „Reduceri”. Gol = blocul nu apare.
              </span>
            </Field>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-[#231f20] text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Planuri ({data.plans.length})
          </h2>
          <button
            onClick={addPlan}
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#f8ef21] text-[#231f20] px-4 py-2 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Plus size={14} /> Adaugă plan
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {data.plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="bg-white border border-[#e5e5e5] rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Plan #{idx + 1}
                </div>
                <button
                  onClick={() => removePlan(plan.id)}
                  className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                  aria-label="Șterge plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nume program">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Grupă (ex: Tiny, Junior, Varsity)">
                  <input
                    type="text"
                    value={plan.ageGroup}
                    onChange={(e) => updatePlan(plan.id, { ageGroup: e.target.value })}
                    className="admin-input"
                  />
                </Field>
              </div>

              <Field label="Descriere">
                <input
                  type="text"
                  value={plan.description}
                  onChange={(e) => updatePlan(plan.id, { description: e.target.value })}
                  className="admin-input"
                  placeholder="4-7 ani; 55 min; 70 ședințe (2 ședințe/săptămână)"
                />
              </Field>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Tip preț">
                  <select
                    value={plan.priceMode}
                    onChange={(e) =>
                      updatePlan(plan.id, { priceMode: e.target.value as PricingPlan['priceMode'] })
                    }
                    className="admin-input"
                  >
                    <option value="lunar">Lunar (/ lună)</option>
                    <option value="sedinta">Per ședință (/ ședință)</option>
                  </select>
                </Field>
                <Field label="Dificultate">
                  <select
                    value={plan.level}
                    onChange={(e) => updatePlan(plan.id, { level: e.target.value })}
                    className="admin-input"
                  >
                    <option value="">— (fără nivel)</option>
                    <option>Începător</option>
                    <option>Intermediar</option>
                    <option>Avansat</option>
                    <option>Începător & Intermediar</option>
                    <option>Toate dificultățile</option>
                  </select>
                </Field>
                <Field label="Durată (min)">
                  <input
                    type="number"
                    min={1}
                    value={plan.durationMinutes}
                    onChange={(e) => updatePlan(plan.id, { durationMinutes: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Ordine">
                  <input
                    type="number"
                    value={plan.displayOrder}
                    onChange={(e) => updatePlan(plan.id, { displayOrder: Number(e.target.value) || 0 })}
                    onBlur={reorderPlans}
                    className="admin-input"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    Planurile se reordonează după acest număr.
                  </span>
                </Field>
              </div>

              {/* Prețuri afișate public */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Preț principal (lei) · afișat mare">
                  <input
                    type="number"
                    min={0}
                    value={plan.priceMonthly}
                    onChange={(e) => updatePlan(plan.id, { priceMonthly: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    Se afișează cu „{plan.priceMode === 'sedinta' ? '/ ședință' : '/ lună'}".
                  </span>
                </Field>
                <Field label="Subtitlu preț (manual)">
                  <input
                    type="text"
                    value={plan.priceNote ?? ''}
                    onChange={(e) => updatePlan(plan.id, { priceNote: e.target.value })}
                    className="admin-input"
                    placeholder="≈ 45 lei / ședință"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    Text liber sub preț. Lasă gol ca să nu apară nimic.
                  </span>
                </Field>
              </div>

              {/* Date anuale — opționale, informative (nu se calculează nimic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Ședințe/an (opțional, informativ)">
                  <input
                    type="number"
                    min={0}
                    value={plan.sessionsPerYear ?? 0}
                    onChange={(e) => updatePlan(plan.id, { sessionsPerYear: Number(e.target.value) || undefined })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Preț anual (lei) (opțional, informativ)">
                  <input
                    type="number"
                    min={0}
                    value={plan.priceStandard ?? 0}
                    onChange={(e) => updatePlan(plan.id, { priceStandard: Number(e.target.value) || undefined })}
                    className="admin-input"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    Nu se afișează automat. Detaliază-l, dacă vrei, în descriere.
                  </span>
                </Field>
              </div>

              {/* Preț reînscriere — nu se afișează public */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Preț reînscriere / early-bird (lei)">
                  <input
                    type="number"
                    min={0}
                    value={plan.priceEarlyBird}
                    onChange={(e) => updatePlan(plan.id, { priceEarlyBird: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    Nu se afișează pe site. Rezervat pentru campania de reînscriere (mai).
                  </span>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SaveButton status={status} onClick={save} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function SaveButton({ status, onClick }: { status: 'idle' | 'saving' | 'ok' | 'error'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={status === 'saving'}
      className="inline-flex items-center gap-2 bg-[#231f20] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#3a3637] disabled:opacity-50 transition-all"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {status === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {status === 'ok' ? 'Salvat ✓' : status === 'saving' ? 'Se salvează...' : 'Salvează'}
    </button>
  )
}
