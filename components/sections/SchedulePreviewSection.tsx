import { CalendarDays, PartyPopper, Trophy } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import CalendarLightbox from '@/components/CalendarLightbox'
import { getCalendar } from '@/lib/db'
import { defaultCalendarData } from '@/lib/db/defaults'
import type { CalendarData } from '@/lib/db/types'

async function fetchCalendar(): Promise<CalendarData> {
  try {
    return await getCalendar()
  } catch (err) {
    console.error('[SchedulePreviewSection] fallback to defaults:', err)
    return defaultCalendarData
  }
}

function formatRange(start: string, end: string) {
  if (!start || !end) return ''
  const s = new Date(start)
  const e = new Date(end)
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('ro-RO', opts)
  if (sameMonth) {
    return `${s.getDate()} – ${fmt(e, { day: 'numeric', month: 'long', year: 'numeric' })}`
  }
  return `${fmt(s, { day: 'numeric', month: 'short' })} – ${fmt(e, { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const eventIcons = {
  spectacol: PartyPopper,
  concurs: Trophy,
  special: CalendarDays,
} as const

const eventColors = {
  spectacol: 'bg-[#f8ef21] text-[#231f20]',
  concurs: 'bg-[#231f20] text-[#f8ef21]',
  special: 'bg-[#3a3637] text-white',
} as const

const eventLabels = {
  spectacol: 'Spectacol',
  concurs: 'Concurs',
  special: 'Special',
} as const

export default async function SchedulePreviewSection() {
  const data = await fetchCalendar()
  const sortedModules = [...data.modules].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )
  const sortedEvents = [...data.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const sortedVacations = [...data.vacations].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <section id="program" className="bg-[#f5f5f5] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mb-4"><SprayLabel>Program</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Calendar cursuri
              <br />
              <span className="text-[#231f20]/40">{data.yearLabel}</span>
            </h2>
            <p className="text-[#6b6b6b] mt-4 max-w-2xl">
              Începem pe <strong className="text-[#231f20]">{formatDate(data.startDate)}</strong> și terminăm pe{' '}
              <strong className="text-[#231f20]">{formatDate(data.endDate)}</strong>. {sortedModules.length} module, cu pauze și evenimente.
            </p>
          </div>

          <CalendarLightbox
            src="/2026-2027-calendar.jpeg"
            title={`Calendar ${data.yearLabel}`}
            alt={`Calendar cursuri Quasar Dance ${data.yearLabel}`}
            triggerLabel="Vezi calendar"
          />
        </div>

        {/* Modules */}
        {sortedModules.length > 0 && (
          <div className="mb-10">
            <h3
              className="text-[#231f20] text-lg font-bold uppercase tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Modulele anului
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {sortedModules.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-[#e5e5e5] p-5 flex flex-col gap-2"
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Modul {m.number}
                  </div>
                  <div
                    className="text-[#231f20] text-base font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {m.label}
                  </div>
                  <div className="text-[#6b6b6b] text-xs">{formatRange(m.startDate, m.endDate)}</div>
                  <div className="text-[#231f20]/50 text-xs font-semibold mt-auto pt-2">
                    {m.weeks} {m.weeks === 1 ? 'săptămână' : 'săptămâni'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column: Events + Vacations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events */}
          {sortedEvents.length > 0 && (
            <div>
              <h3
                className="text-[#231f20] text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Evenimente importante
              </h3>
              <div className="flex flex-col gap-3">
                {sortedEvents.map((ev) => {
                  const Icon = eventIcons[ev.type]
                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-xl border border-[#e5e5e5] p-4 flex items-start gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${eventColors[ev.type]}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[#231f20] text-sm font-bold"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {ev.title}
                          </span>
                          <span
                            className="text-[10px] uppercase tracking-wider font-bold text-[#6b6b6b] bg-[#f5f5f5] px-2 py-0.5 rounded-full"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {eventLabels[ev.type]}
                          </span>
                        </div>
                        <div className="text-[#6b6b6b] text-xs mt-0.5">{formatDate(ev.date)}</div>
                        {ev.description && (
                          <p className="text-[#6b6b6b] text-xs mt-1.5 leading-relaxed">{ev.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vacations */}
          {sortedVacations.length > 0 && (
            <div>
              <h3
                className="text-[#231f20] text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vacanțe
              </h3>
              <div className="flex flex-col gap-3">
                {sortedVacations.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white rounded-xl border border-[#e5e5e5] p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[#231f20] text-sm font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {v.label || 'Vacanță'}
                      </div>
                      <div className="text-[#6b6b6b] text-xs mt-0.5">
                        {formatRange(v.startDate, v.endDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
