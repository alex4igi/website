'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Heart, Target, Sparkles, Star, MapPin, Trophy, Tv, Briefcase, Calendar, Music, Flame, Handshake } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import InstructorDeckCarousel, { instructorsData } from '@/components/InstructorDeckCarousel'

// Timeline data — istoria reală a clubului
const timelineEvents = [
  { year: '1981', title: 'Începutul', desc: 'Clubul ia naștere la Casa de Cultură a Studenților din Iași, sub îndrumarea scriitorului Dan Merișca, pionier al break-dance-ului în România.' },
  { year: '2000–2004', title: 'Era street-dance', desc: 'Ignat Alexandru (IGi) preia ștafeta și transformă clubul într-un reper al stilurilor street: Hip-Hop, House, Dancehall, Popping, Locking.' },
  { year: '2015–2020', title: 'Școală independentă', desc: 'Quasar Dance devine o școală de dans independentă, cu propria identitate și direcție.' },
  { year: '2020 — azi', title: 'O nouă etapă', desc: 'Odată cu alăturarea Roxanei Scantee, Quasar intră într-o etapă de extindere, profesionalizare și consolidare a comunității — astăzi cu 3 puncte de lucru proprii.' },
]

// Values — ADN-ul Quasar
const values = [
  { icon: Target, title: 'Tu vs. Tu', desc: 'Competiția cu sine însuși. Îi învățăm pe copii să își depășească propriile limite și să fie mai buni față de ei înșiși în fiecare zi.' },
  { icon: Users, title: 'Echipa ca familie', desc: 'Lucrăm în grupuri care se sincronizează perfect. Exersăm permanent lucrul în echipă — cu bucuriile comune, dar și cu răbdarea din momentele de frustrare.' },
  { icon: Sparkles, title: 'Entuziasm & Inovație', desc: 'Suntem tineri, curioși și mereu la curent cu noile trenduri. Ne hrănim cu energia cursanților și transformăm fiecare oră într-o experiență memorabilă.' },
]

// Instructors data with real photos and bios
// Using instructors data from shared component
const instructors = instructorsData

// Impact stats
const impactStats = [
  { value: '11.000+', label: 'Tineri introduși la dans', icon: Users },
  { value: '600+', label: 'Membri activi', icon: Heart },
  { value: '11', label: 'Instructori dedicați', icon: Star },
  { value: '3', label: 'Puncte de lucru în Iași', icon: MapPin },
]

// Performanță & impact
const internationalScenes = [
  'Battle of the Year · Grecia',
  'RedBull BC One',
  'World of Dance · România & Chișinău',
  'DanceStar World Masters · Croația',
]

// Experiența completă de dansator — mai mult decât cursuri
const experiences = [
  { icon: Calendar, title: '2 spectacole anuale', desc: 'Producții proprii de Crăciun și la Final de an, pe scene mari din Iași.' },
  { icon: Music, title: 'Tabere & workshop-uri', desc: 'Tabere de dans și workshop-uri cu invitați speciali de pretutindeni.' },
  { icon: Flame, title: 'Evenimente & concursuri', desc: 'Evenimente în aer liber, concursuri și flashmob-uri care animă orașul.' },
  { icon: Handshake, title: 'Parteneriate solide', desc: 'Colaborări cu școli, cluburi educaționale și spații de joacă.' },
]

function useInView() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}



export default function DespreNoiPage() {
  const [heroRef, heroInView] = useInView()
  const [timelineRef, timelineInView] = useInView()
  const [perfRef, perfInView] = useInView()
  const [impactRef, impactInView] = useInView()
  const [moreRef, moreInView] = useInView()
  const [teamRef, teamInView] = useInView()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#231f20] overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 animate-slow-pan"
            style={{ backgroundImage: "url('/images/quasar-team.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#231f20]/50 to-[#231f20]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <SprayLabel>Despre noi</SprayLabel>
            </div>
            <h1
              className={`text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 reveal ${heroInView ? 'in-view' : ''}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pasiune în mișcare
              <br />
              <span className="text-[#f8ef21]">din 1981.</span>
            </h1>
            <p className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl reveal ${heroInView ? 'in-view' : ''}`} style={{ transitionDelay: '100ms' }}>
              Suntem o comunitate de peste 600 de membri activi și o echipă de 11 instructori dedicați,
              uniți de o singură filozofie: <span className="text-white font-semibold">„Music is number 1”</span>.
              La Quasar nu predăm doar pași de dans — creștem încrederea și caracterul fiecărui tânăr care ne trece pragul.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Mission */}
            <div>
              <div className="mb-4"><SprayLabel>Misiunea noastră</SprayLabel></div>
              <h2
                className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Nu doar predăm dans.
                <br />
                <span className="text-[#231f20]/40">Creștem oameni.</span>
              </h2>
              <p className="text-[#6b6b6b] text-base leading-relaxed mb-4">
                Nu ne propunem să fim doar o școală de dans, ci un mediu de dezvoltare. La Quasar, fiecare oră
                construiește mai mult decât tehnica — dezvoltă încredere, caracter, creativitate și reziliență.
              </p>
              <p className="text-[#6b6b6b] text-base leading-relaxed">
                Filozofia noastră, „Music is number 1”, ne ghidează în fiecare zi. De aceea părinții aleg Quasar
                și de aceea tinerii rămân ani de zile — pentru că aici cresc odată cu muzica.
              </p>
            </div>

            {/* Values */}
            <div>
              <h3
                className="text-[#231f20] text-2xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ADN-ul Quasar
              </h3>
              <div className="grid gap-6">
                {values.map((val, i) => (
                  <div
                    key={val.title}
                    className="flex gap-4 items-start value-card"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center shadow-lg">
                      <val.icon size={22} className="text-[#231f20]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4
                        className="text-[#231f20] text-lg font-bold mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {val.title}
                      </h4>
                      <p className="text-[#6b6b6b] text-sm leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>Istoria noastră</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              De la underground
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">la instituție.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#f8ef21]" aria-hidden="true" />

            {/* Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, i) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col md:flex-row items-start gap-8 ${
                    i % 2 === 0 ? 'md:flex-row-reverse' : ''
                  } reveal ${timelineInView ? 'in-view' : ''}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Year badge */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -translate-y-1 md:translate-y-0">
                    <div
                      className="bg-[#f8ef21] text-[#231f20] font-black text-sm px-4 py-2 rounded-full border-4 border-[#f5f5f5] shadow-lg pulse-scale"
                      style={{ fontFamily: 'var(--font-display)', animationDelay: `${i * 80}ms` }}
                    >
                      {event.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 pl-16 md:pl-0">
                    <div className={`bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-md hover:shadow-xl transition-shadow duration-300 ${i % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}`}>
                      <h3
                        className="text-[#231f20] text-xl font-bold mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-[#6b6b6b] text-sm leading-relaxed">{event.desc}</p>
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performanță & Impact */}
      <section ref={perfRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>Performanță & impact</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Peste 11.000 de tineri
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">au dansat cu noi.</span>
            </h2>
            <p className="text-[#6b6b6b] mt-4 max-w-2xl text-base leading-relaxed">
              Rezultatele noastre vorbesc despre seriozitatea cu care tratăm dansul — de la scenele internaționale
              până la cariere construite în industria profesionistă.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Scene internaționale */}
            <div className="bg-[#f5f5f5] p-8 rounded-2xl border border-[#e5e5e5] card-lift">
              <div className="w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center shadow-lg mb-5">
                <Trophy size={22} className="text-[#231f20]" strokeWidth={2.5} />
              </div>
              <h3 className="text-[#231f20] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Scene internaționale
              </h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed mb-4">
                Am reprezentat Iașul și România la competiții de prestigiu:
              </p>
              <div className="flex flex-wrap gap-2">
                {internationalScenes.map((scene) => (
                  <span
                    key={scene}
                    className="text-xs font-semibold bg-white text-[#231f20] px-3 py-1.5 rounded-full border border-[#e5e5e5]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {scene}
                  </span>
                ))}
              </div>
            </div>

            {/* Vizibilitate TV */}
            <div className="bg-[#f5f5f5] p-8 rounded-2xl border border-[#e5e5e5] card-lift">
              <div className="w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center shadow-lg mb-5">
                <Tv size={22} className="text-[#231f20]" strokeWidth={2.5} />
              </div>
              <h3 className="text-[#231f20] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Vizibilitate
              </h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed mb-4">
                Ne-ați putut urmări evoluțiile la emisiuni de televiziune îndrăgite:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Românii au Talent', 'Dansez pentru Tine'].map((show) => (
                  <span
                    key={show}
                    className="text-xs font-semibold bg-white text-[#231f20] px-3 py-1.5 rounded-full border border-[#e5e5e5]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {show}
                  </span>
                ))}
              </div>
            </div>

            {/* Cariere */}
            <div className="bg-[#231f20] p-8 rounded-2xl card-lift hover-glow">
              <div className="w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center shadow-lg mb-5">
                <Briefcase size={22} className="text-[#231f20]" strokeWidth={2.5} />
              </div>
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Cariere lansate
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Quasar a fost rampa de lansare pentru mulți dansatori care astăzi performează în industria
                profesionistă din București.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators (compact) */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>De ce Quasar?</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu orice școală
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">e Quasar.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#231f20] p-8 rounded-2xl card-lift hover-glow">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Rădăcini autentice
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Street dance-ul românesc a început la Quasar. Nu importăm trend-uri — noi le-am adus primii.
              </p>
            </div>
            <div className="bg-[#231f20] p-8 rounded-2xl card-lift hover-glow">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Metodologie proprie
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                O metodă dezvoltată în ani de practică, care oferă rezultate rapide și o experiență de dansator completă.
              </p>
            </div>
            <div className="bg-[#231f20] p-8 rounded-2xl card-lift hover-glow">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Comunitate reală
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Nu clienți — familie. Generații întregi au crescut în Quasar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Community (replaces Founder) */}
      <section ref={impactRef} className="py-20 md:py-28 bg-gradient-to-br from-[#231f20] via-[#2a2527] to-[#231f20] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#f8ef21] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#f8ef21] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block"><SprayLabel>Impactul nostru</SprayLabel></div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Numere care spun
              <br />
              <span className="text-[#f8ef21]">mai mult decât cuvintele.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card reveal ${impactInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-[#f8ef21]/20 rounded-2xl p-6 text-center hover:border-[#f8ef21]/60 transition-all duration-300 hover:scale-105">
                  <div className="mb-4 flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#f8ef21]/10 flex items-center justify-center">
                      <stat.icon size={28} className="text-[#f8ef21]" strokeWidth={2} />
                    </div>
                  </div>
                  <div
                    className="text-[#f8ef21] text-4xl md:text-5xl font-black mb-2 counter"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm font-bold uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mai mult decât cursuri */}
      <section ref={moreRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>Mai mult decât cursuri</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              O experiență de dansator
              <br />
              <span className="text-[#231f20]/40">completă.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp, i) => (
              <div
                key={exp.title}
                className={`bg-[#f5f5f5] p-6 rounded-2xl border border-[#e5e5e5] card-lift reveal ${moreInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center shadow-lg mb-5">
                  <exp.icon size={22} className="text-[#231f20]" strokeWidth={2.5} />
                </div>
                <h3 className="text-[#231f20] text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {exp.title}
                </h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Card Deck Carousel */}
      <section id="echipa" ref={teamRef} className="py-20 md:py-32 bg-[#f5f5f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center"><SprayLabel>Echipa Quasar</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Instructorii tăi.
              <br />
              <span className="text-[#231f20]/40">Mentorii tăi.</span>
            </h2>
            <p className="text-[#6b6b6b] mt-4 max-w-2xl mx-auto">
              11 instructori dedicați și oamenii din spatele scenei. Swipe sau folosește săgețile pentru a descoperi întreaga echipă Quasar.
            </p>
          </div>

          <InstructorDeckCarousel instructors={instructors} inView={teamInView} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f8ef21]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-black mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gata să începi?
          </h2>
          <p className="text-[#231f20]/70 text-lg mb-8">
            Alătură-te celor peste 600 de membri care dansează la Quasar. Primul pas începe aici.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#cursuri"
              className="inline-flex items-center justify-center gap-2 bg-[#231f20] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-[#3a3637] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi cursurile <ArrowRight size={18} />
            </a>
            <a
              href="/#quiz"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#231f20] text-[#231f20] font-bold text-base px-8 py-4 rounded-full hover:bg-[#231f20] hover:text-white transition-all duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul tău
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes slow-pan {
          0%, 100% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-2%, 2%); }
        }

        .animate-slow-pan {
          animation: slow-pan 20s ease-in-out infinite;
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        @keyframes value-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .value-card {
          animation: value-fade-in 0.6s ease forwards;
          opacity: 0;
        }

        .card-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .hover-glow {
          position: relative;
          overflow: hidden;
        }

        .hover-glow::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(248, 239, 33, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .hover-glow:hover::before {
          opacity: 1;
        }



        .instructor-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .instructor-card.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .card-front {
          transform: rotateY(0deg);
        }

        .card-back {
          transform: rotateY(180deg);
        }

        @keyframes counter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .counter {
          animation: counter 0.8s ease forwards;
        }

        .stat-card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
