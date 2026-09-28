import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '@/components/sections/Navbar'
import LeadFormSection from '@/components/sections/LeadFormSection'
import LocationsSection from '@/components/sections/LocationsSection'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'
import { CAMPANIE_RECOMANDARI, formatDataRo, getCampanieRecomandare } from '@/lib/recomandari'

// Biletul de recomandare (același QR pentru toată lumea) trimite aici. Termenul și suma
// vin din CRM; după termen pagina nu se mai afișează, iar un QR rămas pe un bilet vechi
// ajunge la formularul obișnuit. Textele: docs/handoff/2026-09-28-referral-brief-claude-design.md (qapp).
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Ai fost invitat la Quasar — prima oră e gratuită | Quasar Dance Iași',
  description:
    'Un cursant Quasar te-a invitat la dans. Prima oră e gratuită: spune-ne cine te-a invitat și îți găsim o grupă, la Ștefan cel Mare sau Nicolina.',
  alternates: { canonical: '/recomandari' },
  robots: { index: false, follow: true },
}

const pasi = [
  { nr: '1', text: 'Ceri ora gratuită: aici, la telefon sau la recepție.' },
  { nr: '2', text: 'Vii la probă, într-o grupă potrivită vârstei și nivelului tău.' },
  { nr: '3', text: 'Te înscrii și plătești prima lună. Familia care te-a invitat primește creditul.' },
]

export default async function RecomandariPage() {
  const campanie = await getCampanieRecomandare()
  if (!campanie) redirect('/#inscriere')

  const termen = formatDataRo(campanie.data_limita)
  const lei = Math.round(Number(campanie.recompensa_lei))

  const intrebari = [
    {
      q: 'Cine poate fi invitat?',
      a: 'Oricine nu e înscris la Quasar în sezonul acesta, inclusiv foștii cursanți care revin.',
    },
    {
      q: 'Trebuie să aleg aceeași grupă cu prietenul meu?',
      a: 'Nu. Alegi grupa care ți se potrivește.',
    },
    {
      q: 'Dacă încep la mijlocul lunii?',
      a: 'Prima lună se plătește întreagă, iar diferența se scade din luna următoare. De exemplu: începi pe 15 octombrie, plătești 280 lei în octombrie și 98 lei în noiembrie.',
    },
    {
      q: 'Când primește familia creditul?',
      a: 'După ce prietenul achită integral prima lună. Creditul se vede la recepție și se folosește la următoarea plată.',
    },
    {
      q: 'Până când e valabilă campania?',
      a: `Până pe ${termen}, înainte de vacanța de toamnă. Până atunci trebuie să faci ora gratuită, să te înscrii și să plătești prima lună.`,
    },
    {
      q: 'Pot folosi creditul pe merch sau bilete la spectacol?',
      a: 'Nu. Creditul e pentru dans: abonament, OPEN class, ședințe, workshopuri, concursuri.',
    },
  ]

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#f8ef21] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="mb-6">
            <SprayLabel>Invitație de la un coleg Quasar</SprayLabel>
          </div>
          <h1
            className="text-[#231f20] text-4xl md:text-6xl font-extrabold leading-[1.05] text-balance mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ai fost invitat la Quasar.
            <br />
            Prima oră e gratuită.
          </h1>
          <p className="text-[#231f20]/80 text-lg md:text-xl max-w-2xl mb-8">
            Spune-ne cine te-a invitat și îți găsim o grupă.
          </p>
          <a
            href="#inscriere"
            className="inline-flex items-center justify-center bg-[#231f20] text-white font-bold text-base px-7 py-4 rounded-xl hover:bg-[#3a3637] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vreau ora gratuită
          </a>
          <p className="mt-4 text-sm text-[#231f20]/70">Valabil până pe {termen}.</p>
        </div>
      </section>

      {/* Formularul — imediat după hero */}
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
              Cum funcționează
            </h2>
            <ol className="flex flex-col gap-5">
              {pasi.map((p) => (
                <li key={p.nr} className="flex items-start gap-4">
                  <span
                    className="w-9 h-9 rounded-full bg-[#f8ef21] text-[#231f20] flex items-center justify-center text-base font-extrabold flex-shrink-0"
                    style={{ fontFamily: 'var(--font-display)' }}
                    aria-hidden="true"
                  >
                    {p.nr}
                  </span>
                  <span className="text-white/85 text-base leading-relaxed pt-1.5">{p.text}</span>
                </li>
              ))}
            </ol>
            <p className="text-white/60 text-sm leading-relaxed mt-8">
              După ce trimiți cererea, te sună recepția să stabilim grupa și ziua orei gratuite.
            </p>
          </div>
        }
      />

      {/* Pentru familia care invită */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="rounded-3xl border-2 border-[#231f20] p-8 md:p-12">
            <p
              className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pentru familia care invită
            </p>
            <h2
              className="text-[#231f20] text-3xl md:text-4xl font-extrabold leading-tight mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {lei} lei credit pentru fiecare prieten înscris.
            </h2>
            <p className="text-[#231f20]/80 text-base md:text-lg leading-relaxed mb-3">
              Pentru fiecare prieten care se înscrie și achită prima lună, familia ta primește {lei} lei
              credit. Fără limită de prieteni.
            </p>
            <p className="text-[#231f20]/80 text-base md:text-lg leading-relaxed">
              Creditul se folosește la abonament, OPEN class, ședințe, workshopuri și concursuri, pentru
              orice membru al familiei.
            </p>
          </div>
        </div>
      </section>

      {/* Întrebări frecvente */}
      <section className="bg-[#f7f7f5] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <h2
            className="text-[#231f20] text-3xl md:text-4xl font-extrabold mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Întrebări frecvente
          </h2>
          <div className="flex flex-col gap-3">
            {intrebari.map((i) => (
              <details key={i.q} className="group rounded-2xl bg-white border border-[#e5e5e5] px-5 py-4">
                <summary
                  className="cursor-pointer list-none flex items-center justify-between gap-4 text-[#231f20] font-bold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {i.q}
                  <span className="text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[#231f20]/75 text-sm md:text-base leading-relaxed">{i.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <LocationsSection />
      <Footer />
    </main>
  )
}
