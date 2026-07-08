'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import type {
  ScheduleClass,
  ScheduleData,
  ScheduleDay,
  ScheduleLevel,
  ScheduleLocation,
  ScheduleStudio,
} from '@/lib/db/types'
import { scheduleDays, scheduleLevels } from '@/lib/db/types'

const dayLabels: Record<ScheduleDay, string> = {
  lu: 'Luni',
  ma: 'Marți',
  mi: 'Miercuri',
  jo: 'Joi',
  vi: 'Vineri',
  sa: 'Sâmbătă',
  du: 'Duminică',
}

const levelLabels: Record<ScheduleLevel, string> = {
  incepator: 'Începător',
  intermediar: 'Intermediar',
  mixt: 'Mixt',
  avansat: 'Avansat',
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function ScheduleEditor({ initialData }: { initialData: ScheduleData }) {
  const [data, setData] = useState<ScheduleData>(initialData)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // ── Locations ──────────────────────────────────────────────────────────
  const addLocation = () =>
    setData((d) => ({
      ...d,
      locations: [
        ...d.locations,
        {
          id: uid('loc'),
          name: 'Locație nouă',
          phone: '',
          displayOrder: d.locations.length + 1,
          studios: [{ id: uid('st'), name: '', classes: [] }],
        },
      ],
    }))

  const updateLocation = (id: string, patch: Partial<ScheduleLocation>) =>
    setData((d) => ({
      ...d,
      locations: d.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }))

  const removeLocation = (id: string) =>
    setData((d) => ({ ...d, locations: d.locations.filter((l) => l.id !== id) }))

  // ── Studios ────────────────────────────────────────────────────────────
  const mutateStudios = (locId: string, fn: (studios: ScheduleStudio[]) => ScheduleStudio[]) =>
    setData((d) => ({
      ...d,
      locations: d.locations.map((l) => (l.id === locId ? { ...l, studios: fn(l.studios) } : l)),
    }))

  const addStudio = (locId: string) =>
    mutateStudios(locId, (s) => [...s, { id: uid('st'), name: `Studio ${s.length + 1}`, classes: [] }])

  const updateStudio = (locId: string, stId: string, patch: Partial<ScheduleStudio>) =>
    mutateStudios(locId, (s) => s.map((st) => (st.id === stId ? { ...st, ...patch } : st)))

  const removeStudio = (locId: string, stId: string) =>
    mutateStudios(locId, (s) => s.filter((st) => st.id !== stId))

  // ── Classes ────────────────────────────────────────────────────────────
  const mutateClasses = (
    locId: string,
    stId: string,
    fn: (classes: ScheduleClass[]) => ScheduleClass[],
  ) => mutateStudios(locId, (s) => s.map((st) => (st.id === stId ? { ...st, classes: fn(st.classes) } : st)))

  const addClass = (locId: string, stId: string, day: ScheduleDay) =>
    mutateClasses(locId, stId, (c) => [
      ...c,
      { id: uid('cls'), day, discipline: '', ageGroup: '', startTime: '', endTime: '', level: 'incepator' },
    ])

  const updateClass = (locId: string, stId: string, clId: string, patch: Partial<ScheduleClass>) =>
    mutateClasses(locId, stId, (c) => c.map((cl) => (cl.id === clId ? { ...cl, ...patch } : cl)))

  const removeClass = (locId: string, stId: string, clId: string) =>
    mutateClasses(locId, stId, (c) => c.filter((cl) => cl.id !== clId))

  const duplicateClass = (locId: string, stId: string, cl: ScheduleClass) =>
    mutateClasses(locId, stId, (c) => {
      const idx = c.findIndex((x) => x.id === cl.id)
      const copy = { ...cl, id: uid('cls') }
      const next = [...c]
      next.splice(idx + 1, 0, copy)
      return next
    })

  // Copiază toate orele dintr-o zi în altă zi (aceleași ore, id-uri noi).
  const copyDay = (locId: string, stId: string, fromDay: ScheduleDay, toDay: ScheduleDay) =>
    mutateClasses(locId, stId, (c) => {
      const source = c.filter((cl) => cl.day === fromDay)
      if (source.length === 0) return c
      const copies = source.map((cl) => ({ ...cl, id: uid('cls'), day: toDay }))
      return [...c, ...copies]
    })

  async function save() {
    setStatus('saving')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorMsg(
          err.error === 'validation_failed'
            ? 'Câmpuri invalide. Verifică disciplina (obligatorie) și valorile.'
            : 'Eroare la salvare.',
        )
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
            Orar săptămânal
          </h1>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Adaugă locații, studiouri și ore. Nivelul stabilește culoarea în orar.
          </p>
        </div>
        <SaveButton status={status} onClick={save} />
      </div>

      {errorMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* Global note */}
      <section className="bg-white border border-[#e5e5e5] rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Setări generale
        </h2>
        <Field label="Notă afișată sub titlu (opțional)">
          <textarea
            value={data.note}
            onChange={(e) => setData((d) => ({ ...d, note: e.target.value }))}
            className="admin-input min-h-[60px]"
            rows={2}
            placeholder="Ex: Orarul poate suferi mici ajustări de la un modul la altul."
          />
        </Field>
      </section>

      {/* Locations */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Locații ({data.locations.length})
        </h2>
        <button
          onClick={addLocation}
          className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#f8ef21] text-[#231f20] px-4 py-2 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Plus size={14} /> Adaugă locație
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {data.locations.map((loc) => (
          <LocationCard
            key={loc.id}
            loc={loc}
            onUpdate={(patch) => updateLocation(loc.id, patch)}
            onRemove={() => removeLocation(loc.id)}
            onAddStudio={() => addStudio(loc.id)}
            onUpdateStudio={(stId, patch) => updateStudio(loc.id, stId, patch)}
            onRemoveStudio={(stId) => removeStudio(loc.id, stId)}
            onAddClass={(stId, day) => addClass(loc.id, stId, day)}
            onUpdateClass={(stId, clId, patch) => updateClass(loc.id, stId, clId, patch)}
            onRemoveClass={(stId, clId) => removeClass(loc.id, stId, clId)}
            onDuplicateClass={(stId, cl) => duplicateClass(loc.id, stId, cl)}
            onCopyDay={(stId, fromDay, toDay) => copyDay(loc.id, stId, fromDay, toDay)}
          />
        ))}
      </div>

      <SaveButton status={status} onClick={save} />
    </div>
  )
}

function LocationCard({
  loc,
  onUpdate,
  onRemove,
  onAddStudio,
  onUpdateStudio,
  onRemoveStudio,
  onAddClass,
  onUpdateClass,
  onRemoveClass,
  onDuplicateClass,
  onCopyDay,
}: {
  loc: ScheduleLocation
  onUpdate: (patch: Partial<ScheduleLocation>) => void
  onRemove: () => void
  onAddStudio: () => void
  onUpdateStudio: (stId: string, patch: Partial<ScheduleStudio>) => void
  onRemoveStudio: (stId: string) => void
  onAddClass: (stId: string, day: ScheduleDay) => void
  onUpdateClass: (stId: string, clId: string, patch: Partial<ScheduleClass>) => void
  onRemoveClass: (stId: string, clId: string) => void
  onDuplicateClass: (stId: string, cl: ScheduleClass) => void
  onCopyDay: (stId: string, fromDay: ScheduleDay, toDay: ScheduleDay) => void
}) {
  const [open, setOpen] = useState(true)
  const classCount = loc.studios.reduce((n, s) => n + s.classes.length, 0)

  return (
    <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl overflow-hidden">
      {/* Location header */}
      <div className="flex items-center gap-3 p-4 bg-[#231f20]">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-[#f8ef21] p-1"
          aria-label={open ? 'Restrânge' : 'Extinde'}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <div className="flex-1">
          <span className="text-[#f8ef21] text-base font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {loc.name || 'Locație'}
          </span>
          <span className="text-white/40 text-xs ml-2">
            {loc.studios.length} {loc.studios.length === 1 ? 'studio' : 'studiouri'} · {classCount} ore
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-white/60 hover:text-red-400 p-1.5 transition-colors"
          aria-label="Șterge locație"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {open && (
        <div className="p-5 flex flex-col gap-5">
          {/* Location fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Nume locație">
              <input
                type="text"
                value={loc.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="admin-input"
                placeholder="Ștefan cel Mare"
              />
            </Field>
            <Field label="Telefon">
              <input
                type="text"
                value={loc.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                className="admin-input"
                placeholder="0730 534 172"
              />
            </Field>
            <Field label="Ordine afișare">
              <input
                type="number"
                value={loc.displayOrder}
                onChange={(e) => onUpdate({ displayOrder: Number(e.target.value) || 0 })}
                className="admin-input"
              />
            </Field>
          </div>

          {/* Studios */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Studiouri
            </span>
            <button
              onClick={onAddStudio}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#f5f5f5] text-[#231f20] px-3 py-1.5 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Plus size={13} /> Adaugă studio
            </button>
          </div>

          {loc.studios.map((st) => (
            <StudioCard
              key={st.id}
              studio={st}
              canRemove={loc.studios.length > 1}
              onUpdate={(patch) => onUpdateStudio(st.id, patch)}
              onRemove={() => onRemoveStudio(st.id)}
              onAddClass={(day) => onAddClass(st.id, day)}
              onUpdateClass={(clId, patch) => onUpdateClass(st.id, clId, patch)}
              onRemoveClass={(clId) => onRemoveClass(st.id, clId)}
              onDuplicateClass={(cl) => onDuplicateClass(st.id, cl)}
              onCopyDay={(fromDay, toDay) => onCopyDay(st.id, fromDay, toDay)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StudioCard({
  studio,
  canRemove,
  onUpdate,
  onRemove,
  onAddClass,
  onUpdateClass,
  onRemoveClass,
  onDuplicateClass,
  onCopyDay,
}: {
  studio: ScheduleStudio
  canRemove: boolean
  onUpdate: (patch: Partial<ScheduleStudio>) => void
  onRemove: () => void
  onAddClass: (day: ScheduleDay) => void
  onUpdateClass: (clId: string, patch: Partial<ScheduleClass>) => void
  onRemoveClass: (clId: string) => void
  onDuplicateClass: (cl: ScheduleClass) => void
  onCopyDay: (fromDay: ScheduleDay, toDay: ScheduleDay) => void
}) {
  return (
    <div className="border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-4 bg-[#fafafa]">
      <div className="flex items-end gap-3">
        <Field label="Nume studio (gol = fără etichetă)">
          <input
            type="text"
            value={studio.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="admin-input"
            placeholder="Studio 1"
          />
        </Field>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors mb-0.5"
            aria-label="Șterge studio"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Classes grouped by day */}
      <div className="flex flex-col gap-3">
        {scheduleDays.map((day) => {
          const items = studio.classes
            .filter((c) => c.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
          return (
            <div key={day} className="rounded-lg bg-white border border-[#eee] p-3">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {dayLabels[day]}
                  <span className="text-[#9c9c9c] ml-2 normal-case font-medium">
                    {items.length} {items.length === 1 ? 'oră' : 'ore'}
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  {items.length > 0 && (
                    <select
                      aria-label={`Copiază ${dayLabels[day]} în altă zi`}
                      title="Copiază toate orele acestei zile în altă zi"
                      className="admin-input w-auto py-1 text-[11px]"
                      value=""
                      onChange={(e) => {
                        const target = e.target.value as ScheduleDay
                        if (target) onCopyDay(day, target)
                        e.currentTarget.value = ''
                      }}
                    >
                      <option value="">Copiază în…</option>
                      {scheduleDays
                        .filter((d) => d !== day)
                        .map((d) => (
                          <option key={d} value={d}>
                            {dayLabels[d]}
                          </option>
                        ))}
                    </select>
                  )}
                  <button
                    onClick={() => onAddClass(day)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#231f20] hover:text-[#6b6b6b] transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <Plus size={12} /> Adaugă oră
                  </button>
                </div>
              </div>

              {items.length > 0 && (
                <div className="flex flex-col gap-2">
                  {items.map((cl) => (
                    <ClassRow
                      key={cl.id}
                      cl={cl}
                      onUpdate={(patch) => onUpdateClass(cl.id, patch)}
                      onRemove={() => onRemoveClass(cl.id)}
                      onDuplicate={() => onDuplicateClass(cl)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ClassRow({
  cl,
  onUpdate,
  onRemove,
  onDuplicate,
}: {
  cl: ScheduleClass
  onUpdate: (patch: Partial<ScheduleClass>) => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-[#f5f5f5] rounded-lg p-2">
      <input
        type="text"
        value={cl.discipline}
        onChange={(e) => onUpdate({ discipline: e.target.value })}
        className="admin-input flex-1 min-w-[120px]"
        placeholder="Disciplină (ex: Dans)"
      />
      <input
        type="text"
        value={cl.ageGroup}
        onChange={(e) => onUpdate({ ageGroup: e.target.value })}
        className="admin-input w-28"
        placeholder="7-10 ani"
      />
      <input
        type="time"
        value={cl.startTime}
        onChange={(e) => onUpdate({ startTime: e.target.value })}
        className="admin-input w-28"
      />
      <input
        type="time"
        value={cl.endTime}
        onChange={(e) => onUpdate({ endTime: e.target.value })}
        className="admin-input w-28"
      />
      <select
        value={cl.level}
        onChange={(e) => onUpdate({ level: e.target.value as ScheduleLevel })}
        className="admin-input w-32"
      >
        {scheduleLevels.map((lvl) => (
          <option key={lvl} value={lvl}>
            {levelLabels[lvl]}
          </option>
        ))}
      </select>
      <button
        onClick={onDuplicate}
        className="text-[#6b6b6b] hover:bg-[#e5e5e5] p-1.5 rounded-md transition-colors"
        aria-label="Duplică ora"
        title="Duplică"
      >
        <Copy size={15} />
      </button>
      <button
        onClick={onRemove}
        className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
        aria-label="Șterge ora"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 flex-1">
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
