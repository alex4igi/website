'use client'

import { useState } from 'react'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import type { CalendarData, CalendarEvent, CalendarModule, CalendarVacation } from '@/lib/db/types'

const eventTypes = [
  { value: 'spectacol', label: 'Spectacol' },
  { value: 'concurs', label: 'Concurs' },
  { value: 'special', label: 'Special' },
] as const

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function CalendarEditor({ initialData }: { initialData: CalendarData }) {
  const [data, setData] = useState<CalendarData>(initialData)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const update = (patch: Partial<CalendarData>) => setData((d) => ({ ...d, ...patch }))

  // Modules
  const addModule = () =>
    setData((d) => ({
      ...d,
      modules: [
        ...d.modules,
        {
          id: uid('mod'),
          number: d.modules.length + 1,
          label: `Modulul ${d.modules.length + 1}`,
          startDate: '',
          endDate: '',
          weeks: 7,
        },
      ],
    }))
  const updateModule = (id: string, patch: Partial<CalendarModule>) =>
    setData((d) => ({ ...d, modules: d.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  const removeModule = (id: string) =>
    setData((d) => ({ ...d, modules: d.modules.filter((m) => m.id !== id) }))

  // Vacations
  const addVacation = () =>
    setData((d) => ({
      ...d,
      vacations: [...d.vacations, { id: uid('vac'), label: '', startDate: '', endDate: '' }],
    }))
  const updateVacation = (id: string, patch: Partial<CalendarVacation>) =>
    setData((d) => ({
      ...d,
      vacations: d.vacations.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }))
  const removeVacation = (id: string) =>
    setData((d) => ({ ...d, vacations: d.vacations.filter((v) => v.id !== id) }))

  // Events
  const addEvent = () =>
    setData((d) => ({
      ...d,
      events: [
        ...d.events,
        { id: uid('evt'), date: '', type: 'spectacol', title: '', description: '' },
      ],
    }))
  const updateEvent = (id: string, patch: Partial<CalendarEvent>) =>
    setData((d) => ({
      ...d,
      events: d.events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)),
    }))
  const removeEvent = (id: string) =>
    setData((d) => ({ ...d, events: d.events.filter((ev) => ev.id !== id) }))

  async function save() {
    setStatus('saving')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorMsg(err.error === 'validation_failed' ? 'Câmpuri invalide. Verifică datele.' : 'Eroare la salvare.')
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-[#231f20] text-3xl md:text-4xl font-extrabold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Calendar
          </h1>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Editează modulele, vacanțele și evenimentele anului școlar.
          </p>
        </div>
        <SaveButton status={status} onClick={save} />
      </div>

      {errorMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* General */}
      <section className="bg-white border border-[#e5e5e5] rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Perioada anului școlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Început">
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => update({ startDate: e.target.value })}
              className="admin-input"
            />
          </Field>
          <Field label="Sfârșit">
            <input
              type="date"
              value={data.endDate}
              onChange={(e) => update({ endDate: e.target.value })}
              className="admin-input"
            />
          </Field>
        </div>
      </section>

      {/* Modules */}
      <Section
        title={`Module (${data.modules.length})`}
        onAdd={addModule}
        addLabel="Adaugă modul"
      >
        {data.modules.map((m, idx) => (
          <ItemCard key={m.id} title={`Modul #${idx + 1}`} onRemove={() => removeModule(m.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Etichetă">
                <input
                  type="text"
                  value={m.label}
                  onChange={(e) => updateModule(m.id, { label: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Număr modul">
                <input
                  type="number"
                  min={1}
                  value={m.number}
                  onChange={(e) => updateModule(m.id, { number: Number(e.target.value) || 0 })}
                  className="admin-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Început">
                <input
                  type="date"
                  value={m.startDate}
                  onChange={(e) => updateModule(m.id, { startDate: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Sfârșit">
                <input
                  type="date"
                  value={m.endDate}
                  onChange={(e) => updateModule(m.id, { endDate: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Săptămâni">
                <input
                  type="number"
                  min={1}
                  value={m.weeks}
                  onChange={(e) => updateModule(m.id, { weeks: Number(e.target.value) || 0 })}
                  className="admin-input"
                />
              </Field>
            </div>
          </ItemCard>
        ))}
      </Section>

      {/* Vacations */}
      <Section
        title={`Vacanțe (${data.vacations.length})`}
        onAdd={addVacation}
        addLabel="Adaugă vacanță"
      >
        {data.vacations.map((v, idx) => (
          <ItemCard key={v.id} title={`Vacanță #${idx + 1}`} onRemove={() => removeVacation(v.id)}>
            <Field label="Etichetă">
              <input
                type="text"
                value={v.label}
                onChange={(e) => updateVacation(v.id, { label: e.target.value })}
                className="admin-input"
                placeholder="Vacanță iarnă"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Început">
                <input
                  type="date"
                  value={v.startDate}
                  onChange={(e) => updateVacation(v.id, { startDate: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Sfârșit">
                <input
                  type="date"
                  value={v.endDate}
                  onChange={(e) => updateVacation(v.id, { endDate: e.target.value })}
                  className="admin-input"
                />
              </Field>
            </div>
          </ItemCard>
        ))}
      </Section>

      {/* Events */}
      <Section
        title={`Evenimente (${data.events.length})`}
        onAdd={addEvent}
        addLabel="Adaugă eveniment"
      >
        {data.events.map((ev, idx) => (
          <ItemCard key={ev.id} title={`Eveniment #${idx + 1}`} onRemove={() => removeEvent(ev.id)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Data">
                <input
                  type="date"
                  value={ev.date}
                  onChange={(e) => updateEvent(ev.id, { date: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Tip">
                <select
                  value={ev.type}
                  onChange={(e) => updateEvent(ev.id, { type: e.target.value as CalendarEvent['type'] })}
                  className="admin-input"
                >
                  {eventTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Titlu">
                <input
                  type="text"
                  value={ev.title}
                  onChange={(e) => updateEvent(ev.id, { title: e.target.value })}
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Descriere (opțional)">
              <textarea
                value={ev.description || ''}
                onChange={(e) => updateEvent(ev.id, { description: e.target.value })}
                className="admin-input min-h-[60px]"
                rows={2}
              />
            </Field>
          </ItemCard>
        ))}
      </Section>

      <SaveButton status={status} onClick={save} />
    </div>
  )
}

function Section({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string
  onAdd: () => void
  addLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#f8ef21] text-[#231f20] px-4 py-2 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div
          className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
          aria-label="Șterge"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {children}
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
