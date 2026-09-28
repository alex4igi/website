import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/sections/Navbar'
import LeadFormSection from '@/components/sections/LeadFormSection'
import LocationsSection from '@/components/sections/LocationsSection'
import PathsSection from '@/components/sections/PathsSection'
import WhyParentsSection from '@/components/sections/WhyParentsSection'
import AgeGroupsSection from '@/components/sections/AgeGroupsSection'
import DifferentiatorsSection from '@/components/sections/DifferentiatorsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import RegulamentRecomandari from './regulament'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'
import { CAMPANIE_RECOMANDARI, formatDataRo, getCampanieRecomandare } from '@/lib/recomandari'

// Biletul de recomandare (același QR pentru toată lumea) trimite aici. Pagina e pentru
// INVITAT: ora gratuită și ce primește la Quasar; creditul familiei care invită stă în
// regulament (pop-up), nu în față. Termenul și suma vin din CRM; după termen pagina nu
// se mai afișează, iar un QR rămas pe un bilet vechi ajunge la formularul obișnuit. Textele: docs/handoff/2026-09-28-referral-brief-claude-design.md (qapp).
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Ai fost invitat la Quasar — prima oră e gratuită | Quasar Dance Iași',
  description:
    'Un prieten te-a invitat la dans. Prima oră e gratuită: Street Dance, KPOP, gimnastică acrobatică, grupe pe vârste, la Ștefan cel Mare, Nicolina și Quasar for Kids.',
  alternates: { canonical: '/recomandari' },
  robots: { index: false, follow: true },
}


export default async function RecomandariPage() {
  const campanie = await getCampanieRecomandare()
  if (!campanie) redirect('/#inscriere')

  const termen = formatDataRo(campanie.data_limita)
  const lei = Math.round(Number(campanie.recompensa_lei))

  const beneficii = [
    'Prima oră complet gratuită',
    'Grupă potrivită vârstei și nivelului tău',
    'Instructori care te iau de la zero',
    'Fără obligații după ora gratuită',
  ]

  return (
    <main>
      <Navbar />

      {/* Hero — pentru invitat */}
      <section className="bg-[#f8ef21] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="mb-6">
            <SprayLabel>Ai primit o invitație</SprayLabel>
          </div>
          <h1
            className="text-[#231f20] text-4xl md:text-6xl font-extrabold leading-[1.05] text-balance mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Un prieten te-a invitat la dans.
            <br />
            Prima oră e gratuită.
          </h1>
          <p className="text-[#231f20]/80 text-lg md:text-xl max-w-2xl mb-8">
            Vino să vezi cum e la Quasar: Street Dance, KPOP, gimnastică acrobatică — în grupe pe vârste,
            cu instructori care te iau de la zero.
          </p>
          <a
            href="#inscriere"
            className="inline-flex items-center justify-center bg-[#231f20] text-white font-bold text-base px-7 py-4 rounded-xl hover:bg-[#3a3637] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vreau ora gratuită
          </a>
          <div className="mt-4 text-sm text-[#231f20]/70">
            Valabil până pe {termen} ·{' '}
            <RegulamentRecomandari termen={termen} lei={lei} />
          </div>
        </div>
      </section>

      {/* Ce găsești la Quasar — secțiunile de pe homepage */}
      <PathsSection />
      <WhyParentsSection />
      <AgeGroupsSection />
      <DifferentiatorsSection />
      <TestimonialsSection />

      {/* Formularul */}
      <LeadFormSection
        invitat="obligatoriu"
        campanie={CAMPANIE_RECOMANDARI}
        trackSource="recomandari"
        titluFormular="Cere ora gratuită"
        textButon="Trimite cererea"
        stanga={
          <div className="md:pt-4">
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Rezervă-ți
              <br />
              <span className="text-[#f8ef21]">ora gratuită.</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Completează formularul și spune-ne cine te-a invitat. Te sună recepția să alegem împreună
              grupa și ziua.
            </p>
            <div className="flex flex-col gap-4">
              {beneficii.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full bg-[#f8ef21] text-[#231f20] flex items-center justify-center text-xs font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-white/80 text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-white/50 text-sm mt-8">
              Valabil până pe {termen} ·{' '}
              <RegulamentRecomandari termen={termen} lei={lei} className="underline underline-offset-4 text-white/70" />
            </div>
          </div>
        }
      />

      <LocationsSection />
      <Footer />
    </main>
  )
}
