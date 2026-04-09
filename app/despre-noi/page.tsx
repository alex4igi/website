'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Heart, Target, TrendingUp, Star, MapPin, Award } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import InstructorDeckCarousel, { instructorsData } from '@/components/InstructorDeckCarousel'

// Timeline data
const timelineEvents = [
  { year: '1981', title: 'Începutul', desc: 'Prima sală de dans în Iași — clubul Quasar se naște din pasiune pură pentru mișcare.' },
  { year: '1995', title: 'Street Dance în România', desc: 'Aducem primele stiluri de street dance în România — Hip-Hop, Breaking, Popping.' },
  { year: '2003', title: 'Primul Campionat', desc: 'Organizăm prima competiție urbană de dans din Moldova — Quasar Battle.' },
  { year: '2010', title: 'Școlile Quasar', desc: 'Extindere: deschidere sălii de pe Str. Sărăriei — infrastructură profesională.' },
  { year: '2018', title: 'K-POP & Commercial', desc: 'Programele se diversifică: K-POP, Commercial Dance, Waacking, Voguing.' },
  { year: '2024', title: 'Astăzi', desc: 'Peste 500 de elevi activi, 25+ instructori, 3 săli. 43 de ani de dans.' },
]

// Values
const values = [
  { icon: Heart, title: 'Pasiune autentică', desc: 'Dansul nu e job. E identitate.' },
  { icon: Users, title: 'Comunitate', desc: 'Quasar e o familie. Nu doar o școală.' },
  { icon: Award, title: 'Excelență', desc: 'Standard ridicat — de la nivel 1 la pro.' },
  { icon: Target, title: 'Evoluție', desc: 'Nu repetăm formule. Inovăm constant.' },
]

// Instructors data with real photos and bios
// Using instructors data from shared component
const instructors = instructorsData

// Impact stats
const impactStats = [
  { value: '500+', label: 'Elevi activi', icon: Users },
  { value: '43', label: 'Ani de activitate', icon: TrendingUp },
  { value: '3', label: 'Săli în Iași', icon: MapPin },
  { value: '25+', label: 'Instructori', icon: Star },
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
  const [impactRef, impactInView] = useInView()
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
              43 de ani de dans.
              <br />
              <span className="text-[#f8ef21]">O singură poveste.</span>
            </h1>
            <p className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl reveal ${heroInView ? 'in-view' : ''}`} style={{ transitionDelay: '100ms' }}>
              De la un club underground în 1981 până la cea mai longevivă școală de dans din România. 
              Quasar nu e doar dans — e identitate, comunitate, familie.
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
                Formăm dansatori.
                <br />
                <span className="text-[#231f20]/40">Construim caracter.</span>
              </h2>
              <p className="text-[#6b6b6b] text-base leading-relaxed mb-4">
                Quasar nu e doar despre pași. E despre disciplină, respect, auto-expresie și comunitate. 
                Credem că dansul dezvoltă mai mult decât tehnica — dezvoltă încredere, creativitate și reziliență.
              </p>
              <p className="text-[#6b6b6b] text-base leading-relaxed">
                Fiecare curs e construit să te facă să evoluezi — nu doar ca dansator, ci ca om. 
                De aceea părinții aleg Quasar și de aceea elevii rămân ani de zile.
              </p>
            </div>

            {/* Values */}
            <div>
              <h3
                className="text-[#231f20] text-2xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Valorile care ne definesc
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

      {/* Differentiators (compact) */}
      <section className="py-20 md:py-28 bg-white">
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
                Metodologie academică
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Structură, progresie, evaluare. Nu improvizăm — construim sistematic.
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

      {/* Team Section - Card Deck Carousel */}
      <section id="echipa" ref={teamRef} className="py-20 md:py-32 bg-white overflow-hidden">
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
              Swipe sau folosește săgețile pentru a descoperi întreaga echipă Quasar.
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
            Alătură-te celor peste 500 de elevi care dansează la Quasar. Primul pas începe aici.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#cursuri"
              className="inline-flex items-center justify-center gap-2 bg-[#231f20] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-[#3a3637] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi cursurile <ArrowRight size={18} />
            </a>
            <a
              href="#quiz"
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
