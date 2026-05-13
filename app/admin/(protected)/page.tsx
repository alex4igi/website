import Link from 'next/link'
import { ArrowRight, CalendarDays, Wallet } from 'lucide-react'
import { getCalendar, getPricing } from '@/lib/db'

export default async function AdminDashboard() {
  const [pricing, calendar] = await Promise.all([getPricing(), getCalendar()])

  const cards = [
    {
      href: '/admin/preturi',
      title: 'Prețuri',
      icon: Wallet,
      summary: `${pricing.plans.length} planuri · taxă rezervare ${pricing.reservationFee} lei`,
      detail: `An școlar: ${pricing.academicYearLabel}`,
    },
    {
      href: '/admin/calendar',
      title: 'Calendar',
      icon: CalendarDays,
      summary: `${calendar.modules.length} module · ${calendar.events.length} evenimente · ${calendar.vacations.length} vacanțe`,
      detail: `An: ${calendar.yearLabel}`,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1
          className="text-[#231f20] text-3xl md:text-4xl font-extrabold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Bine ai venit
        </h1>
        <p className="text-[#6b6b6b] text-sm mt-2">
          Editează prețurile și calendarul cursurilor. Modificările apar pe site instant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-white border border-[#e5e5e5] rounded-2xl p-6 hover:border-[#231f20] hover:shadow-lg transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-full bg-[#f8ef21] flex items-center justify-center">
                <c.icon size={20} className="text-[#231f20]" />
              </div>
              <ArrowRight
                size={18}
                className="text-[#6b6b6b] group-hover:text-[#231f20] group-hover:translate-x-1 transition-all"
              />
            </div>
            <div>
              <h2
                className="text-[#231f20] text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c.title}
              </h2>
              <p className="text-[#231f20] text-sm mt-1">{c.summary}</p>
              <p className="text-[#6b6b6b] text-xs mt-0.5">{c.detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
