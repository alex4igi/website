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
    sessionsPerYear: 70,
    durationMinutes: 55,
    priceMonthly: 0,
    priceStandard: 0,
    priceEarlyBird: 0,
    displayOrder: order,
  }
}

export default function PricingEditor({ initialData }: { initialData: PricingData }) {
  const [data, setData] = useState<PricingData>(initialData)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const update = (patch: Partial<PricingData>) => setData((d) => ({ ...d, ...patch }))

  const updatePlan = (id: string, patch: Partial<PricingPlan>) =>
    setData((d) => ({
      ...d,
      plans: d.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))

  const removePlan = (id: string) =>
    setData((d) => ({ ...d, plans: d.plans.filter((p) => p.id !== id) }))

  const addPlan = () =>
    setData((d) => ({ ...d, plans: [...d.plans, newPlan(d.plans.length + 1)] }))

  async function save() {
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
            Editează planurile, prețul lunar afișat și taxa de rezervare. Prețul
            per ședință se calculează automat din prețul anual.
          </p>
        </div>
        <SaveButton status={status} onClick={save} />
      </div>

      {errorMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="An școlar">
            <input
              type="text"
              value={data.academicYearLabel}
              onChange={(e) => update({ academicYearLabel: e.target.value })}
              className="admin-input"
            />
          </Field>
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
          </Field>
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
                <Field label="Dificultate">
                  <select
                    value={plan.level}
                    onChange={(e) => updatePlan(plan.id, { level: e.target.value })}
                    className="admin-input"
                  >
                    <option>Începător</option>
                    <option>Intermediar</option>
                    <option>Avansat</option>
                    <option>Începător & Intermediar</option>
                    <option>Toate dificultățile</option>
                  </select>
                </Field>
                <Field label="Ședințe/an">
                  <input
                    type="number"
                    min={1}
                    value={plan.sessionsPerYear}
                    onChange={(e) => updatePlan(plan.id, { sessionsPerYear: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
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
                    className="admin-input"
                  />
                </Field>
              </div>

              {/* Prețuri afișate public */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Preț lunar (lei) · afișat mare">
                  <input
                    type="number"
                    min={0}
                    value={plan.priceMonthly}
                    onChange={(e) => updatePlan(plan.id, { priceMonthly: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Preț anual (lei) · calculează preț/ședință">
                  <input
                    type="number"
                    min={0}
                    value={plan.priceStandard}
                    onChange={(e) => updatePlan(plan.id, { priceStandard: Number(e.target.value) || 0 })}
                    className="admin-input"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">
                    {plan.sessionsPerYear > 0 && plan.priceStandard > 0
                      ? `≈ ${Math.round(plan.priceStandard / plan.sessionsPerYear)} lei / ședință (afișat public)`
                      : 'Detaliază prețul anual și în descriere.'}
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
