import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, ShieldCheck, Sparkles } from 'lucide-react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SchedulePreviewSection from '@/components/sections/SchedulePreviewSection'
import PricingSection from '@/components/sections/PricingSection'
import SprayLabel from '@/components/ui/spray-label'
import { getCalendar, getPricing } from '@/lib/db'
import { defaultCalendarData, defaultPricingData } from '@/lib/db/defaults'

export const dynamic = 'force-dynamic'

async function safeCalendar() {
  try {
    return await getCalendar()
  } catch {
    return defaultCalendarData
  }
}

async function safePricing() {
  try {
    return await getPricing()
  } catch {
    return defaultPricingData
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [pricing, calendar] = await Promise.all([safePricing(), safeCalendar()])
  const monthlyPrices = pricing.plans
    .map((p) => p.priceMonthly ?? 0)
    .filter((v) => v > 0)
  const minMonthly = monthlyPrices.length ? Math.min(...monthlyPrices) : 0
  const title = `Program și Prețuri — Cursuri Dans | Quasar Dance Iași`
  const description = `Calendar academic și prețuri pentru cursurile Quasar Dance din Iași: Street Dance, KPOP Dance, Gimnastică acrobatică și Zumba. Tarife de la ${minMonthly.toLocaleString('ro-RO')} lei/lună, taxă rezervare ${pricing.reservationFee} lei.`

  return {
    title,
    description,
    keywords: [
      'program cursuri dans Iași',
      'prețuri Quasar Dance',
      'tarife școală dans Iași',
      'oferta educațională Quasar Dance',
      'street dance Iași preț',
      'KPOP dance Iași preț',
      'gimnastică acrobatică Iași preț',
      'zumba Iași preț',
    ],
    alternates: { canonical: '/program-si-preturi' },
    openGraph: {
      title,
      description,
      url: 'https://quasardance.ro/program-si-preturi',
      siteName: 'Quasar Dance',
      locale: 'ro_RO',
      type: 'website',
    },
  }
}

export default async function ProgramSiPreturiPage() {
  const [pricing, calendar] = await Promise.all([safePricing(), safeCalendar()])
  const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-[#231f20] overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#f8ef21] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f8ef21] rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <SprayLabel>Oferta educațională</SprayLabel>
            </div>
            <h1
              className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Program și <span className="text-[#f8ef21]">prețuri</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Tot ce ai nevoie pentru a-ți alege cursul potrivit: calendarul anului școlar, modulele, evenimentele importante și tarifele complete.
            </p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3">
              <InfoPill icon={CalendarDays}>
                Start: <strong>{formatDate(calendar.startDate)}</strong>
              </InfoPill>
              <InfoPill icon={Sparkles}>
                Preț lunar transparent
              </InfoPill>
              <InfoPill icon={ShieldCheck}>
                Taxă rezervare: <strong>{pricing.reservationFee} lei</strong>
              </InfoPill>
            </div>

            {/* Anchor jump */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#preturi"
                className="inline-flex items-center gap-2 bg-[#f8ef21] text-[#231f20] font-bold text-sm px-6 py-3 rounded-full hover:bg-white transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vezi prețurile <ArrowRight size={16} />
              </a>
              <Link
                href="/orar"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white hover:text-[#231f20] hover:border-white transition-all"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vezi orarul
              </Link>
              <a
                href="#program"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white hover:text-[#231f20] hover:border-white transition-all"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vezi calendarul
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Calendar */}
      <SchedulePreviewSection />

      {/* How it works */}
      <section className="bg-[#f5f5f5] py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <div className="mb-4 flex justify-center">
              <SprayLabel>Cum funcționează</SprayLabel>
            </div>
            <h2
              className="text-[#231f20] text-3xl md:text-4xl font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              3 pași simpli ca să începi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Alegi cursul',
                desc: 'Vezi grupele de vârstă, dificultățile și prețurile. Sună-ne dacă ai nelămuriri sau dă quiz-ul pentru recomandare.',
              },
              {
                num: '02',
                title: 'Rezervi loc',
                desc: `Plătești taxa de rezervare de ${pricing.reservationFee} lei și locul tău în grupă e blocat.`,
              },
              {
                num: '03',
                title: 'Începi să dansezi',
                desc: `Cursurile pornesc pe ${formatDate(calendar.startDate)}. Te integrăm imediat în grupul potrivit.`,
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white border border-[#e5e5e5] rounded-2xl p-6 flex flex-col gap-3 card-lift"
              >
                <div
                  className="w-12 h-12 rounded-full bg-[#231f20] text-[#f8ef21] flex items-center justify-center text-sm font-extrabold"
                  style={{ fontFamily: 'var(--font-display)' }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <h3
                  className="text-[#231f20] text-xl font-bold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f8ef21] py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-black leading-tight mb-6 text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gata să rezervi locul în grupă?
          </h2>
          <p className="text-[#231f20]/70 text-lg mb-8 max-w-2xl mx-auto">
            Te contactăm în 24 de ore ca să stabilim prima ședință și grupa potrivită.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#inscriere"
              className="inline-flex items-center justify-center gap-2 bg-[#231f20] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-[#3a3637] transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Rezervă loc <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#231f20] text-[#231f20] font-bold text-base px-8 py-4 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Întreabă-ne ceva
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function InfoPill({ icon: Icon, children }: { icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
      <Icon size={14} />
      <span>{children}</span>
    </span>
  )
}
