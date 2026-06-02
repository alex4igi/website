'use client'

import { useMemo, useState } from 'react'
import { Phone } from 'lucide-react'
import type { ScheduleData, ScheduleDay, ScheduleLevel } from '@/lib/db/types'

const dayOrder: ScheduleDay[] = ['lu', 'ma', 'mi', 'jo', 'vi', 'sa', 'du']

const dayLabels: Record<ScheduleDay, { short: string; long: string }> = {
  lu: { short: 'LU', long: 'Luni' },
  ma: { short: 'MA', long: 'Marți' },
  mi: { short: 'MI', long: 'Miercuri' },
  jo: { short: 'JO', long: 'Joi' },
  vi: { short: 'VI', long: 'Vineri' },
  sa: { short: 'SA', long: 'Sâmbătă' },
  du: { short: 'DU', long: 'Duminică' },
}

const levelLabels: Record<ScheduleLevel, string> = {
  incepator: 'Începător',
  intermediar: 'Intermediar',
  mixt: 'Mixt',
  avansat: 'Avansat',
}

// Culorile din planșa de orar.
const levelStyles: Record<ScheduleLevel, string> = {
  incepator: 'bg-white text-[#231f20] border-[#e5e5e5]',
  intermediar: 'bg-[#e4e4e4] text-[#231f20] border-[#d4d4d4]',
  mixt: 'bg-[#9c9c9c] text-[#231f20] border-[#8a8a8a]',
  avansat: 'bg-[#231f20] text-white border-[#231f20]',
}

const levelSwatch: Record<ScheduleLevel, string> = {
  incepator: 'bg-white border-[#cfcfcf]',
  intermediar: 'bg-[#e4e4e4] border-[#cfcfcf]',
  mixt: 'bg-[#9c9c9c] border-[#8a8a8a]',
  avansat: 'bg-[#231f20] border-[#231f20]',
}

export default function WeeklyScheduleView({ data }: { data: ScheduleData }) {
  const locations = useMemo(
    () => [...data.locations].sort((a, b) => a.displayOrder - b.displayOrder),
    [data.locations],
  )

  const [locId, setLocId] = useState(locations[0]?.id ?? '')
  const activeLoc = locations.find((l) => l.id === locId) ?? locations[0]

  const [studioId, setStudioId] = useState(activeLoc?.studios[0]?.id ?? '')
  const activeStudio =
    activeLoc?.studios.find((s) => s.id === studioId) ?? activeLoc?.studios[0]

  if (!activeLoc) {
    return (
      <div className="text-center py-12 text-[#6b6b6b]">Orarul va fi disponibil în curând.</div>
    )
  }

  const showStudioTabs =
    activeLoc.studios.length > 1 || (activeLoc.studios.length === 1 && !!activeLoc.studios[0].name)

  function selectLocation(id: string) {
    setLocId(id)
    const loc = locations.find((l) => l.id === id)
    setStudioId(loc?.studios[0]?.id ?? '')
  }

  const classesByDay = (day: ScheduleDay) =>
    (activeStudio?.classes ?? [])
      .filter((cl) => cl.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="flex flex-col gap-6">
      {/* Location tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {locations.map((loc) => {
          const active = loc.id === activeLoc.id
          return (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                active
                  ? 'bg-[#231f20] text-[#f8ef21] shadow-lg'
                  : 'bg-white text-[#231f20] border-2 border-[#e5e5e5] hover:border-[#231f20]'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {loc.name}
            </button>
          )
        })}
      </div>

      {/* Phone + studio tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {showStudioTabs ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeLoc.studios.map((st) => {
              const active = st.id === activeStudio?.id
              return (
                <button
                  key={st.id}
                  onClick={() => setStudioId(st.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-[#f8ef21] text-[#231f20]'
                      : 'bg-[#f5f5f5] text-[#6b6b6b] hover:text-[#231f20]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {st.name || 'Studio'}
                </button>
              )
            })}
          </div>
        ) : (
          <span />
        )}

        {activeLoc.phone && (
          <a
            href={`tel:${activeLoc.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#231f20] hover:text-[#6b6b6b] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Phone size={15} className="text-[#f8ef21] fill-[#231f20]" />
            {activeLoc.phone}
          </a>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {(Object.keys(levelLabels) as ScheduleLevel[]).map((lvl) => (
          <div key={lvl} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded border ${levelSwatch[lvl]}`} />
            <span
              className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {levelLabels[lvl]}
            </span>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="flex flex-col gap-2.5">
        {dayOrder.map((day) => {
          const items = classesByDay(day)
          return (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-stretch gap-2.5 rounded-2xl bg-[#f5f5f5] p-2.5"
            >
              {/* Day badge */}
              <div className="flex sm:flex-col items-center justify-center gap-1 sm:w-20 flex-shrink-0 rounded-xl bg-[#231f20] px-3 py-2 sm:py-3">
                <span
                  className="text-[#f8ef21] text-lg font-extrabold leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {dayLabels[day].short}
                </span>
                <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider hidden sm:block">
                  {dayLabels[day].long}
                </span>
              </div>

              {/* Classes */}
              {items.length > 0 ? (
                <div className="flex-1 flex flex-wrap gap-2">
                  {items.map((cl) => (
                    <div
                      key={cl.id}
                      className={`rounded-xl border px-3 py-2 min-w-[120px] flex flex-col ${levelStyles[cl.level]}`}
                    >
                      <span
                        className="text-sm font-extrabold leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {cl.discipline}
                      </span>
                      {cl.ageGroup && (
                        <span className="text-[11px] font-semibold opacity-70 leading-tight">
                          {cl.ageGroup}
                        </span>
                      )}
                      {(cl.startTime || cl.endTime) && (
                        <span className="text-xs font-bold mt-1 tabular-nums">
                          {cl.startTime}
                          {cl.endTime ? ` – ${cl.endTime}` : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center px-3 text-sm text-[#9c9c9c] font-medium">
                  Liber
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
