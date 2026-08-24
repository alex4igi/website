import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'
import WeeklyScheduleView from '@/components/WeeklyScheduleView'
import { getSchedule } from '@/lib/db'
import { defaultScheduleData } from '@/lib/db/defaults'
import type { ScheduleData } from '@/lib/db/types'

// Prerandată, reîmprospătată la 5 minute. Salvarea orarului din admin o împinge
// imediat prin revalidatePath('/orar') — vezi app/api/admin/schedule/route.ts.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Orar săptămânal — Cursuri pe locații | Quasar Dance Iași',
  description:
    'Orarul săptămânal al cursurilor Quasar Dance din Iași, pe locații și studiouri: Dans, Gimnastică, KPOP, AcroQ și multe altele. Vezi zilele, orele și nivelurile.',
  alternates: { canonical: '/orar' },
  openGraph: {
    title: 'Orar săptămânal | Quasar Dance Iași',
    description:
      'Vezi orarul cursurilor Quasar Dance pe locații și studiouri — zile, ore și niveluri.',
    url: 'https://quasardance.ro/orar',
    siteName: 'Quasar Dance',
    locale: 'ro_RO',
    type: 'website',
  },
}

async function fetchSchedule(): Promise<ScheduleData> {
  try {
    return await getSchedule()
  } catch (err) {
    console.error('[OrarPage] fallback to defaults:', err)
    return defaultScheduleData
  }
}

export default async function OrarPage() {
  const data = await fetchSchedule()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-14 md:pt-40 md:pb-20 bg-[#231f20] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#f8ef21] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f8ef21] rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <SprayLabel>Orar săptămânal</SprayLabel>
            </div>
            <h1
              className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Orarul cursurilor
              <br />
              <span className="text-[#f8ef21]">pe locații și studiouri</span>
            </h1>
            {data.note && (
              <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">{data.note}</p>
            )}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {data.locations.length > 0 ? (
            <WeeklyScheduleView data={data} />
          ) : (
            <div className="text-center py-12 text-[#6b6b6b]">Orarul va fi disponibil în curând.</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
